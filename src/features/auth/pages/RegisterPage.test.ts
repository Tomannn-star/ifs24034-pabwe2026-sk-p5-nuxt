import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import RegisterPage from "./RegisterPage.vue";
import { createMockPinia } from "@/test-utils";
import { useAuthStore } from "../states/authStore";
import * as toolsHelper from "@/helpers/toolsHelper";

const mockPush = vi.fn();
vi.mock("vue-router", async () => {
  const actual = await vi.importActual("vue-router");
  return {
    ...actual,
    useRouter: () => ({
      push: mockPush,
    }),
  };
});

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createMockPinia();
  });

  const customStubs = {
    RouterLink: {
      template: "<a><slot /></a>",
    },
  };

  it("should validate empty fields", async () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);
    const wrapper = mount(RegisterPage, { global: { stubs: customStubs } });

    await wrapper.find("form").trigger("submit.prevent");
    expect(errorSpy).toHaveBeenCalledWith("Semua kolom formulir pendaftaran wajib diisi!");
  });

  it("should validate password mismatch", async () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);
    const wrapper = mount(RegisterPage, { global: { stubs: customStubs } });

    await wrapper.find("input#name").setValue("Toman");
    await wrapper.find("input#email").setValue("toman@delcom.org");
    await wrapper.find("input#password").setValue("pass123");
    await wrapper.find("input#confirmPassword").setValue("mismatch");
    await wrapper.find("form").trigger("submit.prevent");

    expect(errorSpy).toHaveBeenCalledWith("Konfirmasi kata sandi tidak cocok!");
  });

  it("should register successfully and navigate to login", async () => {
    const store = useAuthStore();
    const registerSpy = vi.spyOn(store, "register").mockResolvedValue({ success: true } as any);

    const wrapper = mount(RegisterPage, { global: { stubs: customStubs } });
    await wrapper.find("input#name").setValue("Toman");
    await wrapper.find("input#email").setValue("toman@delcom.org");
    await wrapper.find("input#password").setValue("pass123");
    await wrapper.find("input#confirmPassword").setValue("pass123");
    await wrapper.find("form").trigger("submit.prevent");

    expect(registerSpy).toHaveBeenCalledWith({
      name: "Toman",
      email: "toman@delcom.org",
      password: "pass123",
    });
    expect(mockPush).toHaveBeenCalledWith("/auth/login");
  });

  it("should catch and handle registration errors", async () => {
    const store = useAuthStore();
    vi.spyOn(store, "register").mockRejectedValue(new Error("Fail"));

    const wrapper = mount(RegisterPage, { global: { stubs: customStubs } });
    await wrapper.find("input#name").setValue("Toman");
    await wrapper.find("input#email").setValue("toman@delcom.org");
    await wrapper.find("input#password").setValue("pass123");
    await wrapper.find("input#confirmPassword").setValue("pass123");
    await wrapper.find("form").trigger("submit.prevent");

    expect(mockPush).not.toHaveBeenCalled();
  });

  it("should show loading text when registering", () => {
    const store = useAuthStore();
    store.isAuthRegister = true;
    const wrapper = mount(RegisterPage, { global: { stubs: customStubs } });
    expect(wrapper.find("button[type='submit']").text()).toBe("Memproses...");
  });
});
