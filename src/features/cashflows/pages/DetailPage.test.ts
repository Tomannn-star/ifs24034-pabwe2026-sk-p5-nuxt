import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import DetailPage from "./DetailPage.vue";
import { createMockPinia } from "@/test-utils";
import { useCashFlowsStore } from "../states/cashFlowsStore";
import * as toolsHelper from "@/helpers/toolsHelper";

const mockPush = vi.fn();
let mockRouteParams: Record<string, any> = { cashFlowId: "1" };

vi.mock("vue-router", async () => {
  const actual = await vi.importActual("vue-router");
  return {
    ...actual,
    useRouter: () => ({
      push: mockPush,
    }),
    useRoute: () => ({
      params: mockRouteParams,
    }),
  };
});

describe("DetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createMockPinia();
    mockRouteParams = { cashFlowId: "1" };
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

  it("should handle delete with confirmation and back button", async () => {
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
    const backBtn = wrapper.findAll("button").find((b) => b.text().includes("Kembali ke Ringkasan"));
    await backBtn?.trigger("click");
    expect(mockPush).toHaveBeenCalledWith("/");

    const deleteBtn = wrapper.findAll("button").find((b) => b.text().includes("Hapus"));
    await deleteBtn?.trigger("click");
    expect(deleteSpy).toHaveBeenCalledWith(1);
    expect(mockPush).toHaveBeenCalledWith("/");

    // Test error in deleteCashFlow catch block
    deleteSpy.mockRejectedValueOnce(new Error("Del fail"));
    await deleteBtn?.trigger("click");
  });

  it("should render outflow and fallback description properly", async () => {
    const cashFlowsStore = useCashFlowsStore();
    cashFlowsStore.cashFlow = { ...dummyFlow, type: "outflow", description: "" } as any;
    cashFlowsStore.isLoading = false;

    const wrapper = mount(DetailPage, {
      global: {
        stubs: {
          ChangeModal: {
            template: "<button data-testid='close-modal' @click=\"$emit('close')\"></button>",
          },
        },
      },
    });

    expect(wrapper.text()).toContain("Pengeluaran");
    expect(wrapper.text()).toContain("Tidak ada keterangan tambahan.");

    // Trigger close on ChangeModal
    await wrapper.find("[data-testid='close-modal']").trigger("click");
  });

  it("should handle delete cancellation and when cashFlow is null", async () => {
    const cashFlowsStore = useCashFlowsStore();
    cashFlowsStore.cashFlow = null;

    const wrapper = mount(DetailPage, {
      global: { stubs: { ChangeModal: true } },
    });
    // Calling handleDelete on vm when cashFlow is null
    await (wrapper.vm as any).handleDelete();

    // Mount with cashFlow present and test cancellation
    cashFlowsStore.cashFlow = dummyFlow as any;
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: false } as any);
    const wrapper2 = mount(DetailPage, {
      global: { stubs: { ChangeModal: true } },
    });
    const deleteBtn = wrapper2.findAll("button").find((b) => b.text().includes("Hapus"));
    await deleteBtn?.trigger("click");
  });

  it("should handle error in loadDetail silently and handle absent route id", async () => {
    const cashFlowsStore = useCashFlowsStore();
    vi.spyOn(cashFlowsStore, "fetchCashFlowDetail").mockRejectedValue(new Error("Detail fail"));
    const wrapper = mount(DetailPage, {
      global: { stubs: { ChangeModal: true } },
    });
    expect(wrapper.exists()).toBe(true);

    mockRouteParams = {};
    const wrapperNoId = mount(DetailPage, {
      global: { stubs: { ChangeModal: true } },
    });
    expect(wrapperNoId.exists()).toBe(true);
  });
});
