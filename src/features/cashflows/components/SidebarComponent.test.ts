import { describe, it, expect } from "vitest";
import { renderWithProviders } from "@/test-utils";
import SidebarComponent from "./SidebarComponent.vue";

describe("SidebarComponent", () => {
  it("should render navigation items", () => {
    const wrapper = renderWithProviders(SidebarComponent, {
      props: { isOpen: false },
    });
    expect(wrapper.text()).toContain("Ringkasan Arus Kas");
    expect(wrapper.text()).toContain("Direktori Pengguna");
    expect(wrapper.text()).toContain("Profil Saya");
  });

  it("should handle open state and emit close on backdrop or link click", async () => {
    const wrapper = renderWithProviders(SidebarComponent, {
      props: { isOpen: true },
    });

    const backdrop = wrapper.find(".fixed.inset-0");
    await backdrop.trigger("click");
    expect(wrapper.emitted("close")).toBeTruthy();

    const closeBtn = wrapper.find("button");
    await closeBtn.trigger("click");

    const link = wrapper.find("a");
    await link.trigger("click");
    expect(wrapper.emitted("close")?.length).toBe(3);
  });
});

