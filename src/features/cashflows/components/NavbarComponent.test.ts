import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import NavbarComponent from "./NavbarComponent.vue";
import { createMockPinia } from "@/test-utils";
import { useAuthStore } from "@/features/auth/states/authStore";
import { useUsersStore } from "@/features/users/states/usersStore";

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

describe("NavbarComponent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createMockPinia();
  });

  it("should render correctly and display user name", () => {
    const usersStore = useUsersStore();
    usersStore.profile = { id: 1, name: "Toman Sihombing", email: "toman@delcom.org" };

    const wrapper = mount(NavbarComponent);
    expect(wrapper.text()).toContain("Delcom Cash Flow");
    expect(wrapper.text()).toContain("Toman Sihombing");
    expect(wrapper.text()).toContain("T");
  });

  it("should emit toggleSidebar when menu button is clicked", async () => {
    const wrapper = mount(NavbarComponent);
    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("toggleSidebar")).toBeTruthy();
  });

  it("should trigger logout on logout button click and redirect", async () => {
    const authStore = useAuthStore();
    const logoutSpy = vi.spyOn(authStore, "logout");

    const wrapper = mount(NavbarComponent);
    const buttons = wrapper.findAll("button");
    const logoutBtn = buttons[buttons.length - 1];
    await logoutBtn.trigger("click");

    expect(logoutSpy).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("/auth/login");
  });
});
