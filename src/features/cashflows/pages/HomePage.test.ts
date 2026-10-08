import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import HomePage from "./HomePage.vue";
import { createMockPinia } from "@/test-utils";
import { useCashFlowsStore } from "../states/cashFlowsStore";
import * as toolsHelper from "@/helpers/toolsHelper";

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

  it("should render cash flows list when data exists", () => {
    const cashFlowsStore = useCashFlowsStore();
    cashFlowsStore.cashFlows = dummyFlows as any;
    cashFlowsStore.stats = { balance: 9800000, total_inflow: 10000000, total_outflow: 200000 };

    const wrapper = mount(HomePage, {
      global: {
        stubs: {
          AddModal: true,
          ChangeModal: true,
        },
      },
    });
    expect(wrapper.text()).toContain("Gaji Pokok");
    expect(wrapper.text()).toContain("Belanja");
    expect(wrapper.text()).toContain("Pemasukan");
    expect(wrapper.text()).toContain("Pengeluaran");
  });

  it("should handle filter submission and reset", async () => {
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
    const filterBtn = wrapper.findAll("button").find((b) => b.text().includes("Terapkan Filter"));
    await filterBtn?.trigger("click");
    expect(fetchSpy).toHaveBeenCalled();

    const resetBtn = wrapper.findAll("button").find((b) => b.text().includes("Reset"));
    await resetBtn?.trigger("click");
    expect(fetchSpy).toHaveBeenCalled();
  });

  it("should open and close modals", async () => {
    const wrapper = mount(HomePage, {
      global: {
        stubs: {
          AddModal: true,
          ChangeModal: true,
        },
      },
    });
    const addBtn = wrapper.findAll("button").find((b) => b.text().includes("Catat Transaksi"));
    await addBtn?.trigger("click");

    expect(wrapper.findComponent({ name: "AddModal" }).props("isOpen")).toBe(true);
  });

  it("should handle delete item with confirmation", async () => {
    const cashFlowsStore = useCashFlowsStore();
    cashFlowsStore.cashFlows = dummyFlows as any;
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: true } as any);
    const deleteSpy = vi.spyOn(cashFlowsStore, "deleteCashFlow").mockResolvedValue({ success: true } as any);

    const wrapper = mount(HomePage, {
      global: {
        stubs: {
          AddModal: true,
          ChangeModal: true,
        },
      },
    });
    const deleteButtons = wrapper.findAll("button[title='Hapus']");
    await deleteButtons[0].trigger("click");

    expect(deleteSpy).toHaveBeenCalledWith(1);
  });

  it("should handle delete all cash flows with confirmation", async () => {
    const cashFlowsStore = useCashFlowsStore();
    cashFlowsStore.cashFlows = dummyFlows as any;
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: true } as any);
    const deleteAllSpy = vi.spyOn(cashFlowsStore, "deleteAllCashFlows").mockResolvedValue({ success: true } as any);

    const wrapper = mount(HomePage, {
      global: {
        stubs: {
          AddModal: true,
          ChangeModal: true,
        },
      },
    });
    const deleteAllBtn = wrapper.findAll("button").find((b) => b.text().includes("Hapus Semua"));
    await deleteAllBtn?.trigger("click");

    expect(deleteAllSpy).toHaveBeenCalled();
  });
});
