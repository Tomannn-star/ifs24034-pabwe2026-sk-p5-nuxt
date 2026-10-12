import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useCashFlowsStore } from "./cashFlowsStore";
import * as cashFlowApi from "../api/cashFlowApi";

describe("cashFlowsStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("should initialize default state", () => {
    const store = useCashFlowsStore();
    expect(store.cashFlows).toEqual([]);
    expect(store.cashFlow).toBeNull();
    expect(store.labels).toEqual([]);
  });

  it("should fetchCashFlows successfully", async () => {
    const store = useCashFlowsStore();
    vi.spyOn(cashFlowApi, "getCashFlowsApi").mockResolvedValue({
      success: true,
      data: {
        cash_flows: [
          { id: 1, type: "inflow", source: "cash", label: "Salary", nominal: 10000000 },
        ],
        stats: { total_inflow: 10000000, balance: 10000000 },
      },
    });

    await store.fetchCashFlows();
    expect(store.cashFlows.length).toBe(1);
    expect(store.stats.total_inflow).toBe(10000000);
  });

  it("should fetchCashFlowDetail successfully", async () => {
    const store = useCashFlowsStore();
    vi.spyOn(cashFlowApi, "getCashFlowDetailApi").mockResolvedValue({
      success: true,
      data: {
        cash_flow: { id: 1, type: "inflow", source: "cash", label: "Salary", nominal: 10000000 },
      },
    });

    await store.fetchCashFlowDetail(1);
    expect(store.cashFlow?.nominal).toBe(10000000);
  });

  it("should addCashFlow successfully", async () => {
    const store = useCashFlowsStore();
    vi.spyOn(cashFlowApi, "addCashFlowApi").mockResolvedValue({ success: true });

    await store.addCashFlow({
      type: "inflow",
      source: "cash",
      label: "Bonus",
      nominal: 2000000,
    });
    expect(store.isCashFlowAdded).toBe(true);
  });

  it("should updateCashFlow successfully", async () => {
    const store = useCashFlowsStore();
    store.cashFlow = { id: 1, type: "inflow", source: "cash", label: "Salary", nominal: 10000000 };
    vi.spyOn(cashFlowApi, "updateCashFlowApi").mockResolvedValue({ success: true });

    await store.updateCashFlow(1, { nominal: 12000000 });
    expect(store.isCashFlowChanged).toBe(true);
    expect(store.cashFlow.nominal).toBe(12000000);
  });

  it("should deleteCashFlow successfully", async () => {
    const store = useCashFlowsStore();
    store.cashFlows = [
      { id: 1, type: "inflow", source: "cash", label: "Salary", nominal: 10000000 },
      { id: 2, type: "outflow", source: "cash", label: "Food", nominal: 50000 },
    ];
    vi.spyOn(cashFlowApi, "deleteCashFlowApi").mockResolvedValue({ success: true });

    await store.deleteCashFlow(1);
    expect(store.isCashFlowDeleted).toBe(true);
    expect(store.cashFlows.length).toBe(1);
    expect(store.cashFlows[0].id).toBe(2);
  });

  it("should fetchLabels successfully", async () => {
    const store = useCashFlowsStore();
    vi.spyOn(cashFlowApi, "getCashFlowLabelsApi").mockResolvedValue({
      success: true,
      data: { labels: ["Gaji", "Makan", "Investasi"] },
    });

    await store.fetchLabels();
    expect(store.labels).toEqual(["Gaji", "Makan", "Investasi"]);
  });

  it("should handle error in fetchLabels catch block", async () => {
    const store = useCashFlowsStore();
    vi.spyOn(cashFlowApi, "getCashFlowLabelsApi").mockRejectedValue(new Error("Net error"));

    const res = await store.fetchLabels();
    expect(res.success).toBe(false);
  });

  it("should fetchDailyStats successfully", async () => {
    const store = useCashFlowsStore();
    vi.spyOn(cashFlowApi, "getDailyStatsApi").mockResolvedValue({
      success: true,
      data: { stats: [{ date: "2026-03-01", total: 10000 }] },
    });

    await store.fetchDailyStats();
    expect(store.dailyStats.length).toBe(1);
  });

  it("should handle error in fetchDailyStats catch block", async () => {
    const store = useCashFlowsStore();
    vi.spyOn(cashFlowApi, "getDailyStatsApi").mockRejectedValue(new Error("Net error"));

    const res = await store.fetchDailyStats();
    expect(res.success).toBe(false);
  });

  it("should fetchMonthlyStats successfully", async () => {
    const store = useCashFlowsStore();
    vi.spyOn(cashFlowApi, "getMonthlyStatsApi").mockResolvedValue({
      success: true,
      data: { stats: [{ month: "2026-03", total: 500000 }] },
    });

    await store.fetchMonthlyStats();
    expect(store.monthlyStats.length).toBe(1);
  });

  it("should handle error in fetchMonthlyStats catch block", async () => {
    const store = useCashFlowsStore();
    vi.spyOn(cashFlowApi, "getMonthlyStatsApi").mockRejectedValue(new Error("Net error"));

    const res = await store.fetchMonthlyStats();
    expect(res.success).toBe(false);
  });

  it("should deleteAllCashFlows successfully", async () => {
    const store = useCashFlowsStore();
    store.cashFlows = [
      { id: 1, type: "inflow", source: "cash", label: "Salary", nominal: 10000000 },
    ];
    vi.spyOn(cashFlowApi, "deleteAllCashFlowsApi").mockResolvedValue({ success: true });

    await store.deleteAllCashFlows();
    expect(store.isCashFlowDeletedAll).toBe(true);
    expect(store.cashFlows.length).toBe(0);
  });

  it("should handle error in fetchCashFlows and empty res.data", async () => {
    const store = useCashFlowsStore();
    vi.spyOn(cashFlowApi, "getCashFlowsApi").mockRejectedValue(new Error("Fetch flows error"));
    await expect(store.fetchCashFlows()).rejects.toThrow("Fetch flows error");
    expect(store.error).toBe("Fetch flows error");

    vi.spyOn(cashFlowApi, "getCashFlowsApi").mockResolvedValue({});
    await store.fetchCashFlows();
  });

  it("should handle error in fetchCashFlowDetail and empty res.data", async () => {
    const store = useCashFlowsStore();
    vi.spyOn(cashFlowApi, "getCashFlowDetailApi").mockRejectedValue(new Error("Detail error"));
    await expect(store.fetchCashFlowDetail(1)).rejects.toThrow("Detail error");
    expect(store.error).toBe("Detail error");

    vi.spyOn(cashFlowApi, "getCashFlowDetailApi").mockResolvedValue({});
    await store.fetchCashFlowDetail(1);
  });

  it("should handle error in addCashFlow", async () => {
    const store = useCashFlowsStore();
    vi.spyOn(cashFlowApi, "addCashFlowApi").mockRejectedValue(new Error("Add error"));
    await expect(store.addCashFlow({ type: "inflow", source: "cash", label: "L", nominal: 100 })).rejects.toThrow("Add error");

    vi.spyOn(cashFlowApi, "addCashFlowApi").mockRejectedValue(new Error(""));
    await expect(store.addCashFlow({ type: "inflow", source: "cash", label: "L", nominal: 100 })).rejects.toThrow();
  });

  it("should handle error in updateCashFlow and when cashFlow is null", async () => {
    const store = useCashFlowsStore();
    store.cashFlow = null;
    vi.spyOn(cashFlowApi, "updateCashFlowApi").mockResolvedValue({ message: "OK" });
    await store.updateCashFlow(1, { nominal: 50 });

    vi.spyOn(cashFlowApi, "updateCashFlowApi").mockRejectedValue(new Error("Update error"));
    await expect(store.updateCashFlow(1, {})).rejects.toThrow("Update error");

    vi.spyOn(cashFlowApi, "updateCashFlowApi").mockRejectedValue(new Error(""));
    await expect(store.updateCashFlow(1, {})).rejects.toThrow();
  });

  it("should handle error in deleteCashFlow", async () => {
    const store = useCashFlowsStore();
    vi.spyOn(cashFlowApi, "deleteCashFlowApi").mockRejectedValue(new Error("Del error"));
    await expect(store.deleteCashFlow(1)).rejects.toThrow("Del error");

    vi.spyOn(cashFlowApi, "deleteCashFlowApi").mockRejectedValue(new Error(""));
    await expect(store.deleteCashFlow(1)).rejects.toThrow();
  });

  it("should handle error in deleteAllCashFlows", async () => {
    const store = useCashFlowsStore();
    vi.spyOn(cashFlowApi, "deleteAllCashFlowsApi").mockRejectedValue(new Error("Del all error"));
    await expect(store.deleteAllCashFlows()).rejects.toThrow("Del all error");

    vi.spyOn(cashFlowApi, "deleteAllCashFlowsApi").mockRejectedValue(new Error(""));
    await expect(store.deleteAllCashFlows()).rejects.toThrow();
  });

  it("should handle empty data in fetchLabels, fetchDailyStats, fetchMonthlyStats", async () => {
    const store = useCashFlowsStore();
    vi.spyOn(cashFlowApi, "getCashFlowLabelsApi").mockResolvedValue({});
    await store.fetchLabels();

    vi.spyOn(cashFlowApi, "getDailyStatsApi").mockResolvedValue({});
    await store.fetchDailyStats();

    vi.spyOn(cashFlowApi, "getMonthlyStatsApi").mockResolvedValue({});
    await store.fetchMonthlyStats();
  });
});

