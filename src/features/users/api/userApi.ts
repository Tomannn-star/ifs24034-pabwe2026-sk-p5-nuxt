import { fetchApi } from "@/helpers/apiHelper";

export async function getUsersApi(params: Record<string, any> = {}) {
  return fetchApi("/users", { params });
}

export async function getProfileApi() {
  return fetchApi("/users/me");
}

export async function updateProfileApi(payload: { name?: string }) {
  return fetchApi("/users/me", {
    method: "PUT",
    body: payload,
  });
}

export async function uploadPhotoApi(formData: FormData) {
  return fetchApi("/users/me/photo", {
    method: "POST",
    body: formData,
    isFormData: true,
  });
}

export async function changePasswordApi(payload: {
  old_password?: string;
  new_password?: string;
}) {
  return fetchApi("/users/me/password", {
    method: "PUT",
    body: payload,
  });
}
