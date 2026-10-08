import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import DetailPage from "./DetailPage.vue";
import { createMockPinia } from "@/test-utils";
import { useCashFlowsStore } from "../states/cashFlowsStore";
import * as toolsHelper from "@/helpers/toolsHelper";

const mockPush = vi.fn();
vi.mock("vue-router", async () => {
  const actual = await vi.importActual("vue-router");
  return {
    ...actual,
    useRouter: () => ({
      push: mockPush,
    }),
    useRoute: () => ({
      params: { cashFlowId: "1" },
    }),
  };
});

describe("DetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createMockPinia();
  });

  const dummyFlow = {
    id: 1,
    type: "inflow",
    source: "cash",
    label: "Bonus Proyek",
    nominal: 7500000,
    description: "Bonus apresiasi tim",
    created_at: "2026-03-01T10:00:00Z",
    updated_at: "2026-03-01T10:00:00Z",
  };

  it("should render not found state when cash flow is missing", () => {
    const cashFlowsStore = useCashFlowsStore();
    cashFlowsStore.cashFlow = null;
    cashFlowsStore.isLoading = false;

    const wrapper = mount(DetailPage, {
      global: {
        stubs: {
          ChangeModal: true,
        },
      },
    });
    expect(wrapper.text()).toContain("Catatan transaksi tidak ditemukan.");
  });

  it("should render cash flow detail properly", () => {
    const cashFlowsStore = useCashFlowsStore();
    cashFlowsStore.cashFlow = dummyFlow as any;
    cashFlowsStore.isLoading = false;

    const wrapper = mount(DetailPage, {
      global: {
        stubs: {
          ChangeModal: true,
        },
      },
    });
    expect(wrapper.text()).toContain("Bonus Proyek");
    expect(wrapper.text()).toContain("Bonus apresiasi tim");
    expect(wrapper.text()).toContain("Pemasukan");
  });

  it("should open edit modal", async () => {
    const cashFlowsStore = useCashFlowsStore();
    cashFlowsStore.cashFlow = dummyFlow as any;

    const wrapper = mount(DetailPage, {
      global: {
        stubs: {
          ChangeModal: true,
        },
      },
    });
    const editBtn = wrapper.findAll("button").find((b) => b.text().includes("Ubah"));
    await editBtn?.trigger("click");

    expect(wrapper.findComponent({ name: "ChangeModal" }).props("isOpen")).toBe(true);
  });

  it("should handle delete with confirmation", async () => {
    const cashFlowsStore = useCashFlowsStore();
    cashFlowsStore.cashFlow = dummyFlow as any;
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: true } as any);
    const deleteSpy = vi.spyOn(cashFlowsStore, "deleteCashFlow").mockResolvedValue({ success: true } as any);

    const wrapper = mount(DetailPage, {
      global: {
        stubs: {
          ChangeModal: true,
        },
      },
    });
    const deleteBtn = wrapper.findAll("button").find((b) => b.text().includes("Hapus"));
    await deleteBtn?.trigger("click");

    expect(deleteSpy).toHaveBeenCalledWith(1);
    expect(mockPush).toHaveBeenCalledWith("/");
  });
});
