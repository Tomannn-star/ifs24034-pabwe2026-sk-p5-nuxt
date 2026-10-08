import { describe, it, expect } from "vitest";
import { renderWithProviders } from "./test-utils";
import App from "./App.vue";

describe("App", () => {
  it("should mount App properly", () => {
    const wrapper = renderWithProviders(App);
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find("#app").exists()).toBe(true);
  });
});

