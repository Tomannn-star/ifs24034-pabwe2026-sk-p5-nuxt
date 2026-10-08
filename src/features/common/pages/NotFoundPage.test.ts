import { describe, it, expect } from "vitest";
import { renderWithProviders } from "@/test-utils";
import NotFoundPage from "./NotFoundPage.vue";

describe("NotFoundPage", () => {
  it("should render 404 message", () => {
    const wrapper = renderWithProviders(NotFoundPage);
    expect(wrapper.text()).toContain("404");
    expect(wrapper.text()).toContain("Halaman Tidak Ditemukan");
    expect(wrapper.text()).toContain("Kembali ke Beranda");
  });
});

