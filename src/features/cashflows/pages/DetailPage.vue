<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCashFlowsStore } from "../states/cashFlowsStore";
import { formatRupiah, formatDate, showConfirmDialog } from "@/helpers/toolsHelper";
import ChangeModal from "../modals/ChangeModal.vue";
import { ArrowLeft, Edit2, Trash2, Calendar, Tag, Wallet, FileText } from "lucide-vue-next";

const route = useRoute();
const router = useRouter();
const cashFlowsStore = useCashFlowsStore();

const isChangeModalOpen = ref(false);

async function loadDetail() {
  const id = route.params.cashFlowId;
  if (id) {
    try {
      await cashFlowsStore.fetchCashFlowDetail(id);
    } catch {
      // Handled
    }
  }
}

onMounted(() => {
  loadDetail();
});

async function handleDelete() {
  if (!cashFlowsStore.cashFlow) return;
  const result = await showConfirmDialog("Apakah Anda yakin ingin menghapus catatan transaksi ini?");
  if (result.isConfirmed) {
    try {
      await cashFlowsStore.deleteCashFlow(cashFlowsStore.cashFlow.id);
      router.push("/");
    } catch {
      // Handled
    }
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <button
        @click="router.push('/')"
        class="inline-flex items-center space-x-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition"
      >
        <ArrowLeft class="w-4 h-4" />
        <span>Kembali ke Ringkasan</span>
      </button>

      <div v-if="cashFlowsStore.cashFlow" class="flex items-center space-x-2">
        <button
          @click="isChangeModalOpen = true"
          class="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition"
        >
          <Edit2 class="w-3.5 h-3.5" />
          <span>Ubah</span>
        </button>
        <button
          @click="handleDelete"
          class="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition"
        >
          <Trash2 class="w-3.5 h-3.5" />
          <span>Hapus</span>
        </button>
      </div>
    </div>

    <div v-if="cashFlowsStore.isLoading" class="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
      Memuat rincian transaksi...
    </div>

    <div v-else-if="!cashFlowsStore.cashFlow" class="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
      Catatan transaksi tidak ditemukan.
    </div>

    <div v-else class="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <span
            :class="[
              'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2',
              cashFlowsStore.cashFlow.type === 'inflow'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200',
            ]"
          >
            {{ cashFlowsStore.cashFlow.type === 'inflow' ? 'Pemasukan' : 'Pengeluaran' }}
          </span>
          <h1 class="text-2xl font-bold text-slate-900">{{ cashFlowsStore.cashFlow.label }}</h1>
        </div>

        <div class="text-left sm:text-right">
          <p class="text-xs text-slate-500 font-medium">Nominal Transaksi</p>
          <p
            :class="[
              'text-3xl font-extrabold tracking-tight mt-1',
              cashFlowsStore.cashFlow.type === 'inflow' ? 'text-emerald-700' : 'text-rose-700',
            ]"
          >
            {{ cashFlowsStore.cashFlow.type === 'inflow' ? '+' : '-' }}
            {{ formatRupiah(cashFlowsStore.cashFlow.nominal) }}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="flex items-start space-x-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
          <Wallet class="w-5 h-5 text-slate-500 mt-0.5" />
          <div>
            <p class="text-xs text-slate-500 font-medium">Sumber Dana</p>
            <p class="text-sm font-semibold text-slate-800 capitalize mt-0.5">
              {{ cashFlowsStore.cashFlow.source }}
            </p>
          </div>
        </div>

        <div class="flex items-start space-x-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
          <Tag class="w-5 h-5 text-slate-500 mt-0.5" />
          <div>
            <p class="text-xs text-slate-500 font-medium">Kategori / Label</p>
            <p class="text-sm font-semibold text-slate-800 mt-0.5">
              {{ cashFlowsStore.cashFlow.label }}
            </p>
          </div>
        </div>

        <div class="flex items-start space-x-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
          <Calendar class="w-5 h-5 text-slate-500 mt-0.5" />
          <div>
            <p class="text-xs text-slate-500 font-medium">Waktu Transaksi Dicatat</p>
            <p class="text-sm font-semibold text-slate-800 mt-0.5">
              {{ formatDate(cashFlowsStore.cashFlow.created_at) }}
            </p>
          </div>
        </div>

        <div class="flex items-start space-x-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
          <Calendar class="w-5 h-5 text-slate-500 mt-0.5" />
          <div>
            <p class="text-xs text-slate-500 font-medium">Terakhir Diperbarui</p>
            <p class="text-sm font-semibold text-slate-800 mt-0.5">
              {{ formatDate(cashFlowsStore.cashFlow.updated_at) }}
            </p>
          </div>
        </div>
      </div>

      <div class="space-y-2 pt-2">
        <div class="flex items-center space-x-2 text-slate-700 font-semibold text-sm">
          <FileText class="w-4 h-4 text-slate-500" />
          <span>Keterangan Tambahan</span>
        </div>
        <div class="p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-700 leading-relaxed min-h-[5rem]">
          {{ cashFlowsStore.cashFlow.description || "Tidak ada keterangan tambahan." }}
        </div>
      </div>
    </div>

    <ChangeModal
      :is-open="isChangeModalOpen"
      :cash-flow="cashFlowsStore.cashFlow"
      @close="isChangeModalOpen = false"
      @success="loadDetail"
    />
  </div>
</template>
