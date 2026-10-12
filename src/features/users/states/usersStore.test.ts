import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useUsersStore } from "./usersStore";
import * as userApi from "../api/userApi";

describe("usersStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("should initialize default state", () => {
    const store = useUsersStore();
    expect(store.users).toEqual([]);
    expect(store.profile).toBeNull();
  });

  it("should fetchUsers successfully", async () => {
    const store = useUsersStore();
    vi.spyOn(userApi, "getUsersApi").mockResolvedValue({
      success: true,
      data: { users: [{ id: 1, name: "User 1", email: "u1@delcom.org" }] },
    });

    await store.fetchUsers();
    expect(store.users.length).toBe(1);
    expect(store.users[0].name).toBe("User 1");
  });

  it("should fetchProfile successfully", async () => {
    const store = useUsersStore();
    vi.spyOn(userApi, "getProfileApi").mockResolvedValue({
      success: true,
      data: { user: { id: 1, name: "Admin", email: "admin@delcom.org" } },
    });

    await store.fetchProfile();
    expect(store.profile?.name).toBe("Admin");
  });

  it("should updateProfile successfully", async () => {
    const store = useUsersStore();
    store.profile = { id: 1, name: "Old", email: "old@delcom.org" };
    vi.spyOn(userApi, "updateProfileApi").mockResolvedValue({ success: true });

    await store.updateProfile({ name: "Updated" });
    expect(store.profile.name).toBe("Updated");
  });

  it("should uploadPhoto successfully", async () => {
    const store = useUsersStore();
    store.profile = { id: 1, name: "User", email: "u@delcom.org" };
    vi.spyOn(userApi, "uploadPhotoApi").mockResolvedValue({
      success: true,
      data: { photo_url: "https://photo.url/img.png" },
    });

    const file = new File(["dummy"], "photo.png", { type: "image/png" });
    await store.uploadPhoto(file);
    expect(store.profile.photo_url).toBe("https://photo.url/img.png");
  });

  it("should changePassword successfully", async () => {
    const store = useUsersStore();
    vi.spyOn(userApi, "changePasswordApi").mockResolvedValue({ success: true });

    const res = await store.changePassword({ old_password: "old", new_password: "new" });
    expect(res.success).toBe(true);
  });

  it("should handle fetchUsers error and response without users", async () => {
    const store = useUsersStore();
    vi.spyOn(userApi, "getUsersApi").mockRejectedValue(new Error("Net error"));
    await expect(store.fetchUsers()).rejects.toThrow("Net error");
    expect(store.error).toBe("Net error");

    vi.spyOn(userApi, "getUsersApi").mockResolvedValue({});
    await store.fetchUsers();
  });

  it("should handle fetchProfile error and response without user", async () => {
    const store = useUsersStore();
    vi.spyOn(userApi, "getProfileApi").mockRejectedValue(new Error("Profile error"));
    await expect(store.fetchProfile()).rejects.toThrow("Profile error");
    expect(store.error).toBe("Profile error");

    vi.spyOn(userApi, "getProfileApi").mockResolvedValue({});
    await store.fetchProfile();
  });

  it("should handle updateProfile error and updateProfile when profile is null", async () => {
    const store = useUsersStore();
    store.profile = null;
    vi.spyOn(userApi, "updateProfileApi").mockResolvedValue({ message: "OK" });
    await store.updateProfile({ name: "Updated" });

    vi.spyOn(userApi, "updateProfileApi").mockRejectedValue(new Error("Up fail"));
    await expect(store.updateProfile({ name: "Err" })).rejects.toThrow("Up fail");

    vi.spyOn(userApi, "updateProfileApi").mockRejectedValue(new Error(""));
    await expect(store.updateProfile({ name: "Err" })).rejects.toThrow();
  });

  it("should handle uploadPhoto error and uploadPhoto when profile is null or no photo_url", async () => {
    const store = useUsersStore();
    store.profile = null;
    vi.spyOn(userApi, "uploadPhotoApi").mockResolvedValue({});
    const file = new File(["dummy"], "photo.png", { type: "image/png" });
    await store.uploadPhoto(file);

    vi.spyOn(userApi, "uploadPhotoApi").mockRejectedValue(new Error("Upload fail"));
    await expect(store.uploadPhoto(file)).rejects.toThrow("Upload fail");

    vi.spyOn(userApi, "uploadPhotoApi").mockRejectedValue(new Error(""));
    await expect(store.uploadPhoto(file)).rejects.toThrow();
  });

  it("should handle changePassword error", async () => {
    const store = useUsersStore();
    vi.spyOn(userApi, "changePasswordApi").mockRejectedValue(new Error("Pwd fail"));
    await expect(store.changePassword({})).rejects.toThrow("Pwd fail");

    vi.spyOn(userApi, "changePasswordApi").mockRejectedValue(new Error(""));
    await expect(store.changePassword({})).rejects.toThrow();
  });
});

