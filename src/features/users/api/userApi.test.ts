import { describe, it, expect, vi, beforeEach } from "vitest";
import * as apiHelper from "@/helpers/apiHelper";
import {
  getUsersApi,
  getProfileApi,
  updateProfileApi,
  uploadPhotoApi,
  changePasswordApi,
} from "./userApi";

describe("userApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should fetch all users with params", async () => {
    const spy = vi.spyOn(apiHelper, "fetchApi").mockResolvedValue({ status: "success", data: { users: [] } });
    const res = await getUsersApi({ page: 1 });
    expect(spy).toHaveBeenCalledWith("/users", { params: { page: 1 } });
    expect(res).toEqual({ status: "success", data: { users: [] } });
  });

  it("should fetch profile", async () => {
    const spy = vi.spyOn(apiHelper, "fetchApi").mockResolvedValue({ status: "success", data: { user: {} } });
    const res = await getProfileApi();
    expect(spy).toHaveBeenCalledWith("/users/me");
    expect(res).toEqual({ status: "success", data: { user: {} } });
  });

  it("should update profile", async () => {
    const spy = vi.spyOn(apiHelper, "fetchApi").mockResolvedValue({ status: "success" });
    const res = await updateProfileApi({ name: "Updated Name" });
    expect(spy).toHaveBeenCalledWith("/users/me", {
      method: "PUT",
      body: { name: "Updated Name" },
    });
    expect(res).toEqual({ status: "success" });
  });

  it("should change profile photo", async () => {
    const formData = new FormData();
    const spy = vi.spyOn(apiHelper, "fetchApi").mockResolvedValue({ status: "success" });
    const res = await uploadPhotoApi(formData);
    expect(spy).toHaveBeenCalledWith("/users/me/photo", {
      method: "POST",
      body: formData,
      isFormData: true,
    });
    expect(res).toEqual({ status: "success" });
  });

  it("should change password", async () => {
    const spy = vi.spyOn(apiHelper, "fetchApi").mockResolvedValue({ status: "success" });
    const res = await changePasswordApi({ old_password: "old", new_password: "new" });
    expect(spy).toHaveBeenCalledWith("/users/me/password", {
      method: "PUT",
      body: { old_password: "old", new_password: "new" },
    });
    expect(res).toEqual({ status: "success" });
  });
});
