import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import AddModal from "./AddModal.vue";
import { createMockPinia } from "@/test-utils";
import { useCashFlowsStore } from "../states/cashFlowsStore";
import * as toolsHelper from "@/helpers/toolsHelper";

describe("AddModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createMockPinia();
  });

  it("should not render when isOpen is false", () => {
    const wrapper = mount(AddModal, {
      props: { isOpen: false },
    });
    expect(wrapper.find("form").exists()).toBe(false);
  });

  it("should validate empty label", async () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);
    const wrapper = mount(AddModal, {
      props: { isOpen: true },
    });

    await wrapper.find("form").trigger("submit.prevent");
    expect(errorSpy).toHaveBeenCalledWith("Label/Kategori transaksi wajib diisi!");
  });

  it("should validate invalid nominal", async () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);
    const wrapper = mount(AddModal, {
      props: { isOpen: true },
    });

    await wrapper.find("input#label").setValue("Belanja");
    await wrapper.find("input#nominal").setValue("0");
    await wrapper.find("form").trigger("submit.prevent");

    expect(errorSpy).toHaveBeenCalledWith("Nominal harus berupa angka lebih dari 0!");
  });

  it("should add cash flow successfully", async () => {
    const cashFlowsStore = useCashFlowsStore();
    const addSpy = vi.spyOn(cashFlowsStore, "addCashFlow").mockResolvedValue({ success: true } as any);

    const wrapper = mount(AddModal, {
      props: { isOpen: true },
    });

    await wrapper.find("select#type").setValue("inflow");
    await wrapper.find("select#source").setValue("cash");
    await wrapper.find("input#label").setValue("Gaji");
    await wrapper.find("input#nominal").setValue("5000000");
    await wrapper.find("textarea#description").setValue("Gaji Maret");
    await wrapper.find("form").trigger("submit.prevent");

    expect(addSpy).toHaveBeenCalledWith({
      type: "inflow",
      source: "cash",
      label: "Gaji",
      nominal: 5000000,
      description: "Gaji Maret",
    });
    expect(wrapper.emitted("success")).toBeTruthy();
    expect(wrapper.emitted("close")).toBeTruthy();
  });

  it("should handle error when adding cash flow fails", async () => {
    const cashFlowsStore = useCashFlowsStore();
    vi.spyOn(cashFlowsStore, "addCashFlow").mockRejectedValue(new Error("Server error"));

    const wrapper = mount(AddModal, {
      props: { isOpen: true },
    });

    await wrapper.find("input#label").setValue("Gaji");
    await wrapper.find("input#nominal").setValue("5000000");
    await wrapper.find("form").trigger("submit.prevent");

    expect(wrapper.emitted("success")).toBeFalsy();
  });
});
