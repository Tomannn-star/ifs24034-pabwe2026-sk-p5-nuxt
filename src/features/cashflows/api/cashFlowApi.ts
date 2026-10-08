import { fetchApi } from "@/helpers/apiHelper";

export async function getCashFlowsApi(params: Record<string, any> = {}) {
  return fetchApi("/cash-flows", { params });
}

export async function getCashFlowDetailApi(id: string | number) {
  return fetchApi(`/cash-flows/${id}`);
}

export async function addCashFlowApi(payload: {
  type: string;
  source: string;
  label: string;
  nominal: number;
  description?: string;
}) {
  return fetchApi("/cash-flows", {
    method: "POST",
    body: payload,
  });
}

export async function updateCashFlowApi(
  id: string | number,
  payload: {
    type?: string;
    source?: string;
    label?: string;
    nominal?: number;
    description?: string;
  }
) {
  return fetchApi(`/cash-flows/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export async function deleteCashFlowApi(id: string | number) {
  return fetchApi(`/cash-flows/${id}`, {
    method: "DELETE",
  });
}

export async function getCashFlowLabelsApi() {
  return fetchApi("/cash-flows/labels");
}

export async function getDailyStatsApi(params: Record<string, any> = {}) {
  return fetchApi("/cash-flows/stats/daily", { params });
}

export async function getMonthlyStatsApi(params: Record<string, any> = {}) {
  return fetchApi("/cash-flows/stats/monthly", { params });
}

export async function deleteAllCashFlowsApi() {
  return fetchApi("/cash-flows", {
    method: "DELETE",
  });
}
