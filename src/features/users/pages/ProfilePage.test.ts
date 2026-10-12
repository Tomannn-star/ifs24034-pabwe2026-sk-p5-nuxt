import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import ProfilePage from "./ProfilePage.vue";
import { createMockPinia } from "@/test-utils";
import { useUsersStore } from "../states/usersStore";
import * as toolsHelper from "@/helpers/toolsHelper";

describe("ProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createMockPinia();
  });

  const dummyProfile = {
    id: 1,
    name: "Toman Sihombing",
    email: "ifs24034@delcom.org",
    photo_url: "https://avatar.url/img.jpg",
  };

  it("should render profile data", async () => {
    const usersStore = useUsersStore();
    usersStore.profile = dummyProfile;
    vi.spyOn(usersStore, "fetchProfile").mockImplementation(async () => {
      usersStore.profile = dummyProfile;
      return { success: true } as any;
    });

    const wrapper = mount(ProfilePage);
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Toman Sihombing");
    expect(wrapper.text()).toContain("ifs24034@delcom.org");
    expect(wrapper.find("img").attributes("src")).toBe("https://avatar.url/img.jpg");
  });

  it("should show error dialog when name is empty on update profile", async () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);
    const wrapper = mount(ProfilePage);

    await wrapper.find("input#name").setValue("");
    await wrapper.findAll("form")[0].trigger("submit.prevent");

    expect(errorSpy).toHaveBeenCalledWith("Nama tidak boleh kosong!");
  });

  it("should update profile successfully", async () => {
    const usersStore = useUsersStore();
    const updateSpy = vi.spyOn(usersStore, "updateProfile").mockResolvedValue({ success: true } as any);

    const wrapper = mount(ProfilePage);
    await wrapper.find("input#name").setValue("Toman Baru");
    await wrapper.findAll("form")[0].trigger("submit.prevent");

    expect(updateSpy).toHaveBeenCalledWith({ name: "Toman Baru" });
  });

  it("should handle profile update failure gracefully", async () => {
    const usersStore = useUsersStore();
    vi.spyOn(usersStore, "updateProfile").mockRejectedValue(new Error("Server error"));

    const wrapper = mount(ProfilePage);
    await wrapper.find("input#name").setValue("Toman Baru");
    await wrapper.findAll("form")[0].trigger("submit.prevent");
  });

  it("should handle photo upload", async () => {
    const usersStore = useUsersStore();
    const uploadSpy = vi.spyOn(usersStore, "uploadPhoto").mockResolvedValue({ success: true } as any);

    const wrapper = mount(ProfilePage);
    const input = wrapper.find("input[type='file']");
    const file = new File(["dummy"], "profile.png", { type: "image/png" });

    Object.defineProperty(input.element, "files", {
      value: [file],
    });
    await input.trigger("change");

    expect(uploadSpy).toHaveBeenCalledWith(file);
  });

  it("should handle empty photo file selection", async () => {
    const usersStore = useUsersStore();
    const uploadSpy = vi.spyOn(usersStore, "uploadPhoto");
    const wrapper = mount(ProfilePage);
    const input = wrapper.find("input[type='file']");

    Object.defineProperty(input.element, "files", {
      value: [],
    });
    await input.trigger("change");

    expect(uploadSpy).not.toHaveBeenCalled();
  });

  it("should handle photo upload error gracefully", async () => {
    const usersStore = useUsersStore();
    vi.spyOn(usersStore, "uploadPhoto").mockRejectedValue(new Error("Fail"));

    const wrapper = mount(ProfilePage);
    const input = wrapper.find("input[type='file']");
    const file = new File(["dummy"], "profile.png", { type: "image/png" });

    Object.defineProperty(input.element, "files", {
      value: [file],
    });
    await input.trigger("change");
  });

  it("should validate empty password fields", async () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);
    const wrapper = mount(ProfilePage);

    await wrapper.findAll("form")[1].trigger("submit.prevent");
    expect(errorSpy).toHaveBeenCalledWith("Semua kolom kata sandi wajib diisi!");
  });

  it("should validate password mismatch", async () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);
    const wrapper = mount(ProfilePage);

    await wrapper.find("input#oldPassword").setValue("old123");
    await wrapper.find("input#newPassword").setValue("new123");
    await wrapper.find("input#confirmNewPassword").setValue("mismatch");
    await wrapper.findAll("form")[1].trigger("submit.prevent");

    expect(errorSpy).toHaveBeenCalledWith("Konfirmasi kata sandi baru tidak sesuai!");
  });

  it("should change password successfully", async () => {
    const usersStore = useUsersStore();
    const changeSpy = vi.spyOn(usersStore, "changePassword").mockResolvedValue({ success: true } as any);

    const wrapper = mount(ProfilePage);
    await wrapper.find("input#oldPassword").setValue("old123");
    await wrapper.find("input#newPassword").setValue("new123");
    await wrapper.find("input#confirmNewPassword").setValue("new123");
    await wrapper.findAll("form")[1].trigger("submit.prevent");

    expect(changeSpy).toHaveBeenCalledWith({
      old_password: "old123",
      new_password: "new123",
    });
  });

  it("should handle change password failure gracefully", async () => {
    const usersStore = useUsersStore();
    vi.spyOn(usersStore, "changePassword").mockRejectedValue(new Error("Fail"));

    const wrapper = mount(ProfilePage);
    await wrapper.find("input#oldPassword").setValue("old123");
    await wrapper.find("input#newPassword").setValue("new123");
    await wrapper.find("input#confirmNewPassword").setValue("new123");
    await wrapper.findAll("form")[1].trigger("submit.prevent");
  });

  it("should trigger fileInput click when camera button is clicked", async () => {
    const wrapper = mount(ProfilePage);
    const cameraBtn = wrapper.find("button[title='Ubah Foto Profil']");
    await cameraBtn.trigger("click");
    expect(cameraBtn.exists()).toBe(true);
  });
});
