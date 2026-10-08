import { describe, it, expect } from "vitest";
import { renderWithProviders } from "@/test-utils";
import AuthLayout from "./AuthLayout.vue";

describe("AuthLayout", () => {
  it("should render layout header and router-view slot", () => {
    const wrapper = renderWithProviders(AuthLayout);
    expect(wrapper.text()).toContain("Delcom Cash Flow");
    expect(wrapper.text()).toContain("Kelola transaksi dan pantau arus kas Anda secara rapi");
    expect(wrapper.find("img").attributes("src")).toBe("/logo.svg");
  });
});

