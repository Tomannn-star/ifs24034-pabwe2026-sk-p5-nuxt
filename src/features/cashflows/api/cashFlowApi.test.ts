import { describe, it, expect, vi, beforeEach } from "vitest";
import * as apiHelper from "@/helpers/apiHelper";
import {
  getCashFlowsApi,
  getCashFlowDetailApi,
  addCashFlowApi,
  updateCashFlowApi,
  deleteCashFlowApi,
  getCashFlowLabelsApi,
  getDailyStatsApi,
  getMonthlyStatsApi,
  deleteAllCashFlowsApi,
} from "./cashFlowApi";

describe("cashFlowApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should call getCashFlowsApi", async () => {
    const spy = vi.spyOn(apiHelper, "fetchApi").mockResolvedValue({ success: true });
    const res = await getCashFlowsApi({ type: "inflow" });
    expect(spy).toHaveBeenCalledWith("/cash-flows", { params: { type: "inflow" } });
    expect(res).toEqual({ success: true });
  });

  it("should call getCashFlowDetailApi", async () => {
    const spy = vi.spyOn(apiHelper, "fetchApi").mockResolvedValue({ success: true });
    const res = await getCashFlowDetailApi(12);
    expect(spy).toHaveBeenCalledWith("/cash-flows/12");
    expect(res).toEqual({ success: true });
  });

  it("should call addCashFlowApi", async () => {
    const spy = vi.spyOn(apiHelper, "fetchApi").mockResolvedValue({ success: true });
    const payload = {
      type: "inflow",
      source: "cash",
      label: "Gaji",
      nominal: 5000000,
      description: "Gaji bulan ini",
    };
    const res = await addCashFlowApi(payload);
    expect(spy).toHaveBeenCalledWith("/cash-flows", {
      method: "POST",
      body: payload,
    });
    expect(res).toEqual({ success: true });
  });

  it("should call updateCashFlowApi", async () => {
    const spy = vi.spyOn(apiHelper, "fetchApi").mockResolvedValue({ success: true });
    const res = await updateCashFlowApi(12, { nominal: 6000000 });
    expect(spy).toHaveBeenCalledWith("/cash-flows/12", {
      method: "PUT",
      body: { nominal: 6000000 },
    });
    expect(res).toEqual({ success: true });
  });

  it("should call deleteCashFlowApi", async () => {
    const spy = vi.spyOn(apiHelper, "fetchApi").mockResolvedValue({ success: true });
    const res = await deleteCashFlowApi(12);
    expect(spy).toHaveBeenCalledWith("/cash-flows/12", {
      method: "DELETE",
    });
    expect(res).toEqual({ success: true });
  });

  it("should call getCashFlowLabelsApi", async () => {
    const spy = vi.spyOn(apiHelper, "fetchApi").mockResolvedValue({ success: true });
    const res = await getCashFlowLabelsApi();
    expect(spy).toHaveBeenCalledWith("/cash-flows/labels");
    expect(res).toEqual({ success: true });
  });

  it("should call getDailyStatsApi", async () => {
    const spy = vi.spyOn(apiHelper, "fetchApi").mockResolvedValue({ success: true });
    const res = await getDailyStatsApi({ total_data: 7 });
    expect(spy).toHaveBeenCalledWith("/cash-flows/stats/daily", { params: { total_data: 7 } });
    expect(res).toEqual({ success: true });
  });

  it("should call getMonthlyStatsApi", async () => {
    const spy = vi.spyOn(apiHelper, "fetchApi").mockResolvedValue({ success: true });
    const res = await getMonthlyStatsApi({ total_data: 12 });
    expect(spy).toHaveBeenCalledWith("/cash-flows/stats/monthly", { params: { total_data: 12 } });
    expect(res).toEqual({ success: true });
  });

  it("should call deleteAllCashFlowsApi", async () => {
    const spy = vi.spyOn(apiHelper, "fetchApi").mockResolvedValue({ success: true });
    const res = await deleteAllCashFlowsApi();
    expect(spy).toHaveBeenCalledWith("/cash-flows", {
      method: "DELETE",
    });
    expect(res).toEqual({ success: true });
  });
});
