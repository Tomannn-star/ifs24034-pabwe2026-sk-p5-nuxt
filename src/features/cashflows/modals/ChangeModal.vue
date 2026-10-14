<script setup>
import { ref, watch } from "vue";
import { useCashFlowsStore } from "../states/cashFlowsStore";
import { showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";
import { X } from "lucide-vue-next";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  cashFlow: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close", "success"]);
const cashFlowsStore = useCashFlowsStore();

const type = ref("inflow");
const source = ref("cash");
const label = ref("");
const nominal = ref("");
const description = ref("");

watch(
  () => props.cashFlow,
  (val) => {
    if (val) {
      type.value = val.type || "inflow";
      source.value = val.source || "cash";
      label.value = val.label || "";
      nominal.value = val.nominal ? String(val.nominal) : "";
      description.value = val.description || "";
    }
  },
  { immediate: true }
);

function handleClose() {
  emit("close");
}

async function handleSubmit() {
  if (!label.value.trim()) {
    await showErrorDialog("Label/Kategori transaksi wajib diisi!");
    return;
  }
  const parsedNominal = Number(nominal.value);
  if (!parsedNominal || parsedNominal <= 0) {
    await showErrorDialog("Nominal harus berupa angka lebih dari 0!");
    return;
  }

  try {
    await cashFlowsStore.updateCashFlow(props.cashFlow.id, {
      type: type.value,
      source: source.value,
      label: label.value.trim(),
      nominal: parsedNominal,
      description: description.value.trim(),
    });
    handleClose();
    emit("success");
  } catch {
    // Handled by store
  }
}
</script>

<template>
  <div v-if="isOpen && cashFlow" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity" @click="handleClose"></div>

    <div class="flex min-h-full items-center justify-center p-4">
      <div class="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-xl p-6 z-10 space-y-5">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 class="text-lg font-bold text-slate-900">Ubah Catatan Arus Kas</h3>
          <button
            type="button"
            @click="handleClose"
            aria-label="Tutup dialog"
            class="p-1 rounded-lg text-slate-500 hover:text-slate-600 hover:bg-slate-100"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="edit-type" class="block text-sm font-medium text-slate-700">Tipe Transaksi</label>
              <select
                id="edit-type"
                v-model="type"
                class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="inflow">Pemasukan (Inflow)</option>
                <option value="outflow">Pengeluaran (Outflow)</option>
              </select>
            </div>

            <div>
              <label for="edit-source" class="block text-sm font-medium text-slate-700">Sumber Dana</label>
              <select
                id="edit-source"
                v-model="source"
                class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="cash">Tunai (Cash)</option>
                <option value="savings">Tabungan (Savings)</option>
                <option value="loans">Pinjaman (Loans)</option>
              </select>
            </div>
          </div>

          <div>
            <label for="edit-label" class="block text-sm font-medium text-slate-700">Label / Kategori</label>
            <input
              id="edit-label"
              v-model="label"
              type="text"
              required
              class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label for="edit-nominal" class="block text-sm font-medium text-slate-700">Nominal (Rp)</label>
            <input
              id="edit-nominal"
              v-model="nominal"
              type="number"
              min="1"
              required
              class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label for="edit-description" class="block text-sm font-medium text-slate-700">Keterangan / Catatan</label>
            <textarea
              id="edit-description"
              v-model="description"
              rows="3"
              class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            ></textarea>
          </div>

          <div class="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              @click="handleClose"
              class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="cashFlowsStore.isCashFlowChange"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {{ cashFlowsStore.isCashFlowChange ? "Menyimpan..." : "Simpan Perubahan" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

