import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import ChangeModal from "./ChangeModal.vue";
import { createMockPinia } from "@/test-utils";
import { useCashFlowsStore } from "../states/cashFlowsStore";
import * as toolsHelper from "@/helpers/toolsHelper";

describe("ChangeModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createMockPinia();
  });

  const mockCashFlow = {
    id: 1,
    type: "inflow",
    source: "cash",
    label: "Gaji Pokok",
    nominal: 5000000,
    description: "Gaji bulan lalu",
  };

  it("should not render when isOpen is false", () => {
    const wrapper = mount(ChangeModal, {
      props: { isOpen: false, cashFlow: mockCashFlow },
    });
    expect(wrapper.find("form").exists()).toBe(false);
  });

  it("should validate empty label", async () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);
    const wrapper = mount(ChangeModal, {
      props: { isOpen: true, cashFlow: mockCashFlow },
    });

    await wrapper.find("input#edit-label").setValue("");
    await wrapper.find("form").trigger("submit.prevent");
    expect(errorSpy).toHaveBeenCalledWith("Label/Kategori transaksi wajib diisi!");
  });

  it("should validate invalid nominal", async () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);
    const wrapper = mount(ChangeModal, {
      props: { isOpen: true, cashFlow: mockCashFlow },
    });

    await wrapper.find("input#edit-nominal").setValue("0");
    await wrapper.find("form").trigger("submit.prevent");
    expect(errorSpy).toHaveBeenCalledWith("Nominal harus berupa angka lebih dari 0!");
  });

  it("should update cash flow successfully", async () => {
    const cashFlowsStore = useCashFlowsStore();
    const updateSpy = vi.spyOn(cashFlowsStore, "updateCashFlow").mockResolvedValue({ success: true } as any);

    const wrapper = mount(ChangeModal, {
      props: { isOpen: true, cashFlow: mockCashFlow },
    });

    await wrapper.find("select#edit-type").setValue("outflow");
    await wrapper.find("select#edit-source").setValue("savings");
    await wrapper.find("input#edit-nominal").setValue("6000000");
    await wrapper.find("textarea#edit-description").setValue("New desc");
    await wrapper.find("form").trigger("submit.prevent");

    expect(updateSpy).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ nominal: 6000000, type: "outflow", source: "savings", description: "New desc" })
    );
    expect(wrapper.emitted("success")).toBeTruthy();
    expect(wrapper.emitted("close")).toBeTruthy();
  });

  it("should handle error when updating cash flow fails", async () => {
    const cashFlowsStore = useCashFlowsStore();
    vi.spyOn(cashFlowsStore, "updateCashFlow").mockRejectedValue(new Error("Fail"));

    const wrapper = mount(ChangeModal, {
      props: { isOpen: true, cashFlow: mockCashFlow },
    });

    await wrapper.find("form").trigger("submit.prevent");
    expect(wrapper.emitted("success")).toBeFalsy();
  });

  it("should handle cashFlow with fallback values and isCashFlowChange loading state", async () => {
    const cashFlowsStore = useCashFlowsStore();
    cashFlowsStore.isCashFlowChange = true;

    const wrapper = mount(ChangeModal, {
      props: {
        isOpen: true,
        cashFlow: { id: 2, type: null, source: null, label: null, nominal: 0, description: null },
      },
    });

    expect(wrapper.find("button[type='submit']").text()).toBe("Menyimpan...");
    const closeBtn = wrapper.find("button.p-1");
    await closeBtn.trigger("click");
    expect(wrapper.emitted("close")).toBeTruthy();

    const cancelBtn = wrapper.findAll("button").find((b) => b.text().includes("Batal"));
    await cancelBtn?.trigger("click");

    const backdrop = wrapper.find(".fixed.inset-0.bg-slate-900\\/50");
    await backdrop.trigger("click");
  });
});
