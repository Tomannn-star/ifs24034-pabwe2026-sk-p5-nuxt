import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useAuthStore } from "./authStore";
import * as authApi from "../api/authApi";

describe("authStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should initialize with default state", () => {
    const store = useAuthStore();
    expect(store.token).toBeNull();
    expect(store.isAuthenticated).toBe(false);
  });

  it("should login successfully and save token", async () => {
    const store = useAuthStore();
    vi.spyOn(authApi, "loginApi").mockResolvedValue({
      success: true,
      data: { token: "new-token-123" },
    });

    const res = await store.login({ email: "user@delcom.org", password: "password" });
    expect(res.success).toBe(true);
    expect(store.token).toBe("new-token-123");
    expect(store.isAuthenticated).toBe(true);
    expect(localStorage.getItem("accessToken")).toBe("new-token-123");
  });

  it("should handle login failure without saving token", async () => {
    const store = useAuthStore();
    vi.spyOn(authApi, "loginApi").mockResolvedValue({
      success: false,
      message: "Invalid credentials",
    });

    const res = await store.login({ email: "user@delcom.org", password: "bad" });
    expect(res.success).toBe(false);
    expect(store.token).toBeNull();
  });

  it("should register successfully", async () => {
    const store = useAuthStore();
    vi.spyOn(authApi, "registerApi").mockResolvedValue({
      success: true,
      message: "Registered",
    });

    const res = await store.register({ name: "User", email: "user@delcom.org", password: "password" });
    expect(res.success).toBe(true);
  });

  it("should logout properly and clear token from store and localStorage", () => {
    const store = useAuthStore();
    store.token = "token";
    localStorage.setItem("accessToken", "token");

    store.logout();
    expect(store.token).toBeNull();
    expect(localStorage.getItem("accessToken")).toBeNull();
  });
});

