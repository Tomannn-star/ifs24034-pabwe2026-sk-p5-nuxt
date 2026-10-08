import { fetchApi } from "@/helpers/apiHelper";

export async function loginApi(payload: { email?: string; password?: string }) {
  return fetchApi("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export async function registerApi(payload: {
  name?: string;
  email?: string;
  password?: string;
}) {
  return fetchApi("/auth/register", {
    method: "POST",
    body: payload,
  });
}
