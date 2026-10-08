import { describe, it, expect } from "vitest";
import { renderWithProviders } from "@/test-utils";
import CashFlowLayout from "./CashFlowLayout.vue";
import NavbarComponent from "../components/NavbarComponent.vue";
import SidebarComponent from "../components/SidebarComponent.vue";

describe("CashFlowLayout", () => {
  it("should render navbar and sidebar layout structure", () => {
    const wrapper = renderWithProviders(CashFlowLayout);
    expect(wrapper.findComponent(NavbarComponent).exists()).toBe(true);
    expect(wrapper.findComponent(SidebarComponent).exists()).toBe(true);
  });

  it("should toggle and close sidebar", async () => {
    const wrapper = renderWithProviders(CashFlowLayout);
    const navbar = wrapper.findComponent(NavbarComponent);
    await navbar.vm.$emit("toggleSidebar");
    expect(wrapper.findComponent(SidebarComponent).props("isOpen")).toBe(true);

    const sidebar = wrapper.findComponent(SidebarComponent);
    await sidebar.vm.$emit("close");
    expect(wrapper.findComponent(SidebarComponent).props("isOpen")).toBe(false);
  });
});

