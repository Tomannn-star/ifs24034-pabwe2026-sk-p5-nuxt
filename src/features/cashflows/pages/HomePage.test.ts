import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import HomePage from "./HomePage.vue";
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
  };
});

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createMockPinia();
  });

  const dummyFlows = [
    {
      id: 1,
      type: "inflow",
      source: "cash",
      label: "Gaji Pokok",
      nominal: 10000000,
      created_at: "2026-03-01T10:00:00Z",
    },
    {
      id: 2,
      type: "outflow",
      source: "savings",
      label: "Belanja",
      nominal: 200000,
      created_at: "2026-03-02T10:00:00Z",
    },
  ];

  it("should render stats and empty list when no data", () => {
    const cashFlowsStore = useCashFlowsStore();
    cashFlowsStore.cashFlows = [];
    cashFlowsStore.stats = { balance: 0, total_inflow: 0, total_outflow: 0 };

    const wrapper = mount(HomePage, {
      global: {
        stubs: {
          AddModal: true,
          ChangeModal: true,
        },
      },
    });
    expect(wrapper.text()).toContain("Ringkasan Arus Kas");
    expect(wrapper.text()).toContain("Tidak ada riwayat catatan transaksi yang ditemukan.");
  });

  it("should render cash flows list when data exists and handle row actions", async () => {
    const cashFlowsStore = useCashFlowsStore();
    cashFlowsStore.cashFlows = dummyFlows as any;
    cashFlowsStore.stats = { balance: 9800000, total_inflow: 10000000, total_outflow: 200000 };
    vi.spyOn(cashFlowsStore, "fetchCashFlows").mockImplementation(async () => {
      cashFlowsStore.cashFlows = dummyFlows as any;
      return { success: true } as any;
    });

    const wrapper = mount(HomePage, {
      global: {
        stubs: {
          AddModal: true,
          ChangeModal: true,
        },
      },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("Gaji Pokok");
    expect(wrapper.text()).toContain("Belanja");
    expect(wrapper.text()).toContain("Pemasukan");
    expect(wrapper.text()).toContain("Pengeluaran");

    // Click view detail button
    const viewBtn = wrapper.find("button[title='Lihat Rincian']");
    await viewBtn.trigger("click");
    expect(mockPush).toHaveBeenCalledWith("/cash-flows/1");

    // Click edit button
    const editBtn = wrapper.find("button[title='Ubah']");
    await editBtn.trigger("click");
    expect(wrapper.findComponent({ name: "ChangeModal" }).props("isOpen")).toBe(true);
  });

  it("should handle filter inputs, submission, and reset", async () => {
    const cashFlowsStore = useCashFlowsStore();
    const fetchSpy = vi.spyOn(cashFlowsStore, "fetchCashFlows").mockResolvedValue({ success: true } as any);

    const wrapper = mount(HomePage, {
      global: {
        stubs: {
          AddModal: true,
          ChangeModal: true,
        },
      },
    });

    const selects = wrapper.findAll("select");
    await selects[0].setValue("inflow");
    await selects[1].setValue("cash");

    const inputs = wrapper.findAll("input");
    await inputs[0].setValue("Gaji");
    await inputs[1].setValue("2026-03-01");
    await inputs[2].setValue("2026-03-31");

    const filterBtn = wrapper.findAll("button").find((b) => b.text().includes("Terapkan Filter"));
    await filterBtn?.trigger("click");
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "inflow",
        source: "cash",
        label: "Gaji",
        start_date: "2026-03-01",
        end_date: "2026-03-31",
      })
    );

    const resetBtn = wrapper.findAll("button").find((b) => b.text().includes("Reset"));
    await resetBtn?.trigger("click");
    expect(fetchSpy).toHaveBeenCalled();
  });

  it("should open, emit success and close modals", async () => {
    const cashFlowsStore = useCashFlowsStore();
    const fetchSpy = vi.spyOn(cashFlowsStore, "fetchCashFlows").mockResolvedValue({ success: true } as any);

    const wrapper = mount(HomePage, {
      global: {
        stubs: {
          AddModal: {
            template: "<button data-testid='add-m' @click=\"$emit('close'); $emit('success')\"></button>",
          },
          ChangeModal: {
            template: "<button data-testid='change-m' @click=\"$emit('close'); $emit('success')\"></button>",
          },
        },
      },
    });

    const addBtn = wrapper.findAll("button").find((b) => b.text().includes("Catat Transaksi"));
    await addBtn?.trigger("click");
    expect(wrapper.vm.isAddModalOpen).toBe(true);

    await wrapper.find("[data-testid='add-m']").trigger("click");
    expect(wrapper.vm.isAddModalOpen).toBe(false);

    wrapper.vm.isChangeModalOpen = true;
    await wrapper.find("[data-testid='change-m']").trigger("click");
    expect(wrapper.vm.isChangeModalOpen).toBe(false);
    expect(fetchSpy).toHaveBeenCalled();
  });

  it("should handle delete item with confirmation and cancellation", async () => {
    const cashFlowsStore = useCashFlowsStore();
    cashFlowsStore.cashFlows = dummyFlows as any;
    const deleteSpy = vi.spyOn(cashFlowsStore, "deleteCashFlow").mockResolvedValue({ success: true } as any);

    const wrapper = mount(HomePage, {
      global: {
        stubs: {
          AddModal: true,
          ChangeModal: true,
        },
      },
    });

    // Cancellation
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: false } as any);
    const deleteButtons = wrapper.findAll("button[title='Hapus']");
    await deleteButtons[0].trigger("click");
    expect(deleteSpy).not.toHaveBeenCalled();

    // Confirmation
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: true } as any);
    await deleteButtons[0].trigger("click");
    expect(deleteSpy).toHaveBeenCalledWith(1);
  });

  it("should handle delete all cash flows with confirmation and cancellation", async () => {
    const cashFlowsStore = useCashFlowsStore();
    cashFlowsStore.cashFlows = dummyFlows as any;
    const deleteAllSpy = vi.spyOn(cashFlowsStore, "deleteAllCashFlows").mockResolvedValue({ success: true } as any);

    const wrapper = mount(HomePage, {
      global: {
        stubs: {
          AddModal: true,
          ChangeModal: true,
        },
      },
    });

    // Cancellation
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: false } as any);
    const deleteAllBtn = wrapper.findAll("button").find((b) => b.text().includes("Hapus Semua"));
    await deleteAllBtn?.trigger("click");
    expect(deleteAllSpy).not.toHaveBeenCalled();

    // Confirmation
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: true } as any);
    await deleteAllBtn?.trigger("click");
    expect(deleteAllSpy).toHaveBeenCalled();
  });
});
