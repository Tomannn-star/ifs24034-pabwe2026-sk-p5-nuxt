import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import UsersPage from "./UsersPage.vue";
import { createMockPinia } from "@/test-utils";
import { useUsersStore } from "../states/usersStore";

describe("UsersPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createMockPinia();
  });

  it("should render loading state when fetching users", () => {
    const usersStore = useUsersStore();
    usersStore.isLoading = true;
    const wrapper = mount(UsersPage);
    expect(wrapper.text()).toContain("Memuat daftar pengguna...");
  });

  it("should render empty state when no users found", async () => {
    const usersStore = useUsersStore();
    usersStore.isLoading = false;
    usersStore.users = [];
    vi.spyOn(usersStore, "fetchUsers").mockResolvedValue({ success: true } as any);

    const wrapper = mount(UsersPage);
    expect(wrapper.text()).toContain("Belum ada pengguna lain terdaftar.");
  });

  it("should render users list properly", async () => {
    const usersStore = useUsersStore();
    usersStore.isLoading = false;
    usersStore.users = [
      { id: 1, name: "Alice", email: "alice@delcom.org", photo_url: "https://photo.url" },
      { id: 2, name: "Bob", email: "bob@delcom.org" },
    ];
    vi.spyOn(usersStore, "fetchUsers").mockResolvedValue({ success: true } as any);

    const wrapper = mount(UsersPage);
    expect(wrapper.text()).toContain("Alice");
    expect(wrapper.text()).toContain("bob@delcom.org");
    expect(wrapper.findAll("img").length).toBe(1);
  });
});
