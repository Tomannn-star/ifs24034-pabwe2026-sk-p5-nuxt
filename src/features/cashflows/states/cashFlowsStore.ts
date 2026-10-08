import { defineStore } from "pinia";
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
} from "../api/cashFlowApi";
import { showSuccessDialog, showErrorDialog } from "@/helpers/toolsHelper";

export interface CashFlow {
  id: string | number;
  type: "inflow" | "outflow";
  source: "cash" | "savings" | "loans";
  label: string;
  nominal: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CashFlowStats {
  total_inflow?: number;
  total_outflow?: number;
  balance?: number;
  cash?: number;
  savings?: number;
  loans?: number;
}

export interface CashFlowQueryParams {
  type?: string;
  source?: string;
  label?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
}

export interface CashFlowsState {
  cashFlows: CashFlow[];
  cashFlow: CashFlow | null;
  stats: CashFlowStats;
  labels: string[];
  dailyStats: any[];
  monthlyStats: any[];
  isLoading: boolean;
  isCashFlowAdd: boolean;
  isCashFlowAdded: boolean;
  isCashFlowChange: boolean;
  isCashFlowChanged: boolean;
  isCashFlowDelete: boolean;
  isCashFlowDeleted: boolean;
  isCashFlowDeleteAll: boolean;
  isCashFlowDeletedAll: boolean;
  error: string | null;
}

export const useCashFlowsStore = defineStore("cashFlows", {
  state: (): CashFlowsState => ({
    cashFlows: [],
    cashFlow: null,
    stats: {},
    labels: [],
    dailyStats: [],
    monthlyStats: [],
    isLoading: false,
    isCashFlowAdd: false,
    isCashFlowAdded: false,
    isCashFlowChange: false,
    isCashFlowChanged: false,
    isCashFlowDelete: false,
    isCashFlowDeleted: false,
    isCashFlowDeleteAll: false,
    isCashFlowDeletedAll: false,
    error: null,
  }),
  actions: {
    async fetchCashFlows(params: CashFlowQueryParams = {}) {
      this.isLoading = true;
      this.error = null;
      try {
        const res = await getCashFlowsApi(params);
        if (res?.data) {
          this.cashFlows = res.data.cash_flows || [];
          this.stats = res.data.stats || {};
        }
        return res;
      } catch (err: any) {
        this.error = err.message;
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
    async fetchCashFlowDetail(id: string | number) {
      this.isLoading = true;
      this.error = null;
      try {
        const res = await getCashFlowDetailApi(id);
        if (res?.data?.cash_flow) {
          this.cashFlow = res.data.cash_flow;
        }
        return res;
      } catch (err: any) {
        this.error = err.message;
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
    async addCashFlow(payload: {
      type: string;
      source: string;
      label: string;
      nominal: number;
      description?: string;
    }) {
      this.isCashFlowAdd = true;
      this.isCashFlowAdded = false;
      try {
        const res = await addCashFlowApi(payload);
        this.isCashFlowAdded = true;
        await showSuccessDialog(res?.message || "Catatan arus kas berhasil ditambahkan!");
        return res;
      } catch (err: any) {
        await showErrorDialog(err.message || "Gagal menambahkan catatan arus kas");
        throw err;
      } finally {
        this.isCashFlowAdd = false;
      }
    },
    async updateCashFlow(
      id: string | number,
      payload: {
        type?: string;
        source?: string;
        label?: string;
        nominal?: number;
        description?: string;
      }
    ) {
      this.isCashFlowChange = true;
      this.isCashFlowChanged = false;
      try {
        const res = await updateCashFlowApi(id, payload);
        this.isCashFlowChanged = true;
        if (this.cashFlow && String(this.cashFlow.id) === String(id)) {
          this.cashFlow = { ...this.cashFlow, ...payload };
        }
        await showSuccessDialog(res?.message || "Catatan arus kas berhasil diperbarui!");
        return res;
      } catch (err: any) {
        await showErrorDialog(err.message || "Gagal memperbarui catatan arus kas");
        throw err;
      } finally {
        this.isCashFlowChange = false;
      }
    },
    async deleteCashFlow(id: string | number) {
      this.isCashFlowDelete = true;
      this.isCashFlowDeleted = false;
      try {
        const res = await deleteCashFlowApi(id);
        this.isCashFlowDeleted = true;
        this.cashFlows = this.cashFlows.filter((item) => String(item.id) !== String(id));
        await showSuccessDialog(res?.message || "Catatan arus kas berhasil dihapus!");
        return res;
      } catch (err: any) {
        await showErrorDialog(err.message || "Gagal menghapus catatan arus kas");
        throw err;
      } finally {
        this.isCashFlowDelete = false;
      }
    },
    async fetchLabels() {
      try {
        const res = await getCashFlowLabelsApi();
        if (res?.data?.labels) {
          this.labels = res.data.labels;
        }
        return res;
      } catch {
        return { success: false, message: "Error fetching labels" };
      }
    },
    async fetchDailyStats(params: Record<string, any> = {}) {
      try {
        const res = await getDailyStatsApi(params);
        if (res?.data?.stats) {
          this.dailyStats = res.data.stats;
        }
        return res;
      } catch {
        return { success: false, message: "Error fetching daily stats" };
      }
    },
    async fetchMonthlyStats(params: Record<string, any> = {}) {
      try {
        const res = await getMonthlyStatsApi(params);
        if (res?.data?.stats) {
          this.monthlyStats = res.data.stats;
        }
        return res;
      } catch {
        return { success: false, message: "Error fetching monthly stats" };
      }
    },
    async deleteAllCashFlows() {
      this.isCashFlowDeleteAll = true;
      this.isCashFlowDeletedAll = false;
      try {
        const res = await deleteAllCashFlowsApi();
        this.isCashFlowDeletedAll = true;
        this.cashFlows = [];
        this.stats = {};
        await showSuccessDialog(res?.message || "Semua catatan arus kas berhasil dihapus!");
        return res;
      } catch (err: any) {
        await showErrorDialog(err.message || "Gagal menghapus seluruh catatan arus kas");
        throw err;
      } finally {
        this.isCashFlowDeleteAll = false;
      }
    },
  },
});
