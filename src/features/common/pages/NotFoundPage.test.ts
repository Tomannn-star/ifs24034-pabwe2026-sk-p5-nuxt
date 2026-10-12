import { describe, it, expect, vi } from "vitest";
import { renderWithProviders } from "@/test-utils";
import NotFoundPage from "./NotFoundPage.vue";

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

describe("NotFoundPage", () => {
  it("should render 404 message and navigate home on click", async () => {
    const wrapper = renderWithProviders(NotFoundPage);
    expect(wrapper.text()).toContain("404");
    expect(wrapper.text()).toContain("Halaman Tidak Ditemukan");
    expect(wrapper.text()).toContain("Kembali ke Beranda");

    const btn = wrapper.find("button");
    await btn.trigger("click");
    expect(mockPush).toHaveBeenCalledWith("/");
  });
});
