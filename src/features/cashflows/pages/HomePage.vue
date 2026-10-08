<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCashFlowsStore } from "../states/cashFlowsStore";
import { useUsersStore } from "@/features/users/states/usersStore";
import { formatRupiah, formatDate, showConfirmDialog } from "@/helpers/toolsHelper";
import AddModal from "../modals/AddModal.vue";
import ChangeModal from "../modals/ChangeModal.vue";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Building,
  Plus,
  Trash2,
  Edit2,
  Eye,
  Filter,
  RotateCcw,
} from "lucide-vue-next";

const router = useRouter();
const cashFlowsStore = useCashFlowsStore();
const usersStore = useUsersStore();

const filterType = ref("");
const filterSource = ref("");
const filterLabel = ref("");
const filterStartDate = ref("");
const filterEndDate = ref("");

const isAddModalOpen = ref(false);
const isChangeModalOpen = ref(false);
const selectedCashFlow = ref(null);

async function loadData() {
  try {
    await Promise.all([
      cashFlowsStore.fetchCashFlows({
        type: filterType.value || undefined,
        source: filterSource.value || undefined,
        label: filterLabel.value || undefined,
        start_date: filterStartDate.value || undefined,
        end_date: filterEndDate.value || undefined,
      }),
      cashFlowsStore.fetchLabels(),
      usersStore.fetchProfile(),
    ]);
  } catch {
    // Handled
  }
}

onMounted(() => {
  loadData();
});

function handleFilter() {
  loadData();
}

function handleResetFilter() {
  filterType.value = "";
  filterSource.value = "";
  filterLabel.value = "";
  filterStartDate.value = "";
  filterEndDate.value = "";
  loadData();
}

function openAddModal() {
  isAddModalOpen.value = true;
}

function openChangeModal(item) {
  selectedCashFlow.value = item;
  isChangeModalOpen.value = true;
}

async function handleDelete(id) {
  const result = await showConfirmDialog("Apakah Anda yakin ingin menghapus catatan transaksi ini?");
  if (result.isConfirmed) {
    try {
      await cashFlowsStore.deleteCashFlow(id);
      loadData();
    } catch {
      // Handled
    }
  }
}

async function handleDeleteAll() {
  const result = await showConfirmDialog("PERINGATAN: Apakah Anda yakin ingin MENGHAPUS SEMUA catatan transaksi Anda? Tindakan ini tidak dapat dibatalkan!");
  if (result.isConfirmed) {
    try {
      await cashFlowsStore.deleteAllCashFlows();
      loadData();
    } catch {
      // Handled
    }
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header banner -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Ringkasan Arus Kas</h1>
        <p class="text-sm text-slate-500 mt-1">Pantau dan kelola arus pemasukan serta pengeluaran Anda</p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <button
          @click="openAddModal"
          class="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium shadow-sm transition"
        >
          <Plus class="w-4 h-4" />
          <span>Catat Transaksi</span>
        </button>

        <button
          v-if="cashFlowsStore.cashFlows.length > 0"
          @click="handleDeleteAll"
          class="flex items-center space-x-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-sm font-medium transition"
        >
          <Trash2 class="w-4 h-4" />
          <span>Hapus Semua</span>
        </button>
      </div>
    </div>

    <!-- Stats Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Saldo Bersih</span>
          <div class="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <DollarSign class="w-4 h-4" />
          </div>
        </div>
        <p class="text-lg font-bold text-slate-900 mt-2 truncate">
          {{ formatRupiah(cashFlowsStore.stats?.balance || 0) }}
        </p>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pemasukan</span>
          <div class="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <TrendingUp class="w-4 h-4" />
          </div>
        </div>
        <p class="text-lg font-bold text-emerald-600 mt-2 truncate">
          {{ formatRupiah(cashFlowsStore.stats?.total_inflow || 0) }}
        </p>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pengeluaran</span>
          <div class="p-2 bg-rose-50 text-rose-600 rounded-xl">
            <TrendingDown class="w-4 h-4" />
          </div>
        </div>
        <p class="text-lg font-bold text-rose-600 mt-2 truncate">
          {{ formatRupiah(cashFlowsStore.stats?.total_outflow || 0) }}
        </p>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kas Tunai</span>
          <div class="p-2 bg-amber-50 text-amber-600 rounded-xl">
            <DollarSign class="w-4 h-4" />
          </div>
        </div>
        <p class="text-lg font-bold text-slate-900 mt-2 truncate">
          {{ formatRupiah(cashFlowsStore.stats?.cash || 0) }}
        </p>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tabungan</span>
          <div class="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <Building class="w-4 h-4" />
          </div>
        </div>
        <p class="text-lg font-bold text-slate-900 mt-2 truncate">
          {{ formatRupiah(cashFlowsStore.stats?.savings || 0) }}
        </p>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pinjaman</span>
          <div class="p-2 bg-purple-50 text-purple-600 rounded-xl">
            <CreditCard class="w-4 h-4" />
          </div>
        </div>
        <p class="text-lg font-bold text-slate-900 mt-2 truncate">
          {{ formatRupiah(cashFlowsStore.stats?.loans || 0) }}
        </p>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div class="flex items-center space-x-2 text-slate-700 font-semibold text-sm">
        <Filter class="w-4 h-4" />
        <span>Filter Transaksi</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        <select
          v-model="filterType"
          class="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
        >
          <option value="">Semua Tipe</option>
          <option value="inflow">Pemasukan (Inflow)</option>
          <option value="outflow">Pengeluaran (Outflow)</option>
        </select>

        <select
          v-model="filterSource"
          class="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
        >
          <option value="">Semua Sumber</option>
          <option value="cash">Tunai (Cash)</option>
          <option value="savings">Tabungan (Savings)</option>
          <option value="loans">Pinjaman (Loans)</option>
        </select>

        <input
          v-model="filterLabel"
          type="text"
          placeholder="Kategori / Label"
          class="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
        />

        <input
          v-model="filterStartDate"
          type="date"
          class="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
        />

        <input
          v-model="filterEndDate"
          type="date"
          class="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div class="flex justify-end space-x-2 pt-2">
        <button
          @click="handleResetFilter"
          class="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
        <button
          @click="handleFilter"
          class="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
        >
          <span>Terapkan Filter</span>
        </button>
      </div>
    </div>

    <!-- Transactions List / Table -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-5 border-b border-slate-100 flex items-center justify-between">
        <h2 class="text-base font-bold text-slate-900">Riwayat Catatan Arus Kas</h2>
        <span class="text-xs text-slate-500">Total: {{ cashFlowsStore.cashFlows.length }} Transaksi</span>
      </div>

      <div v-if="cashFlowsStore.isLoading" class="p-12 text-center text-slate-500">
        Memuat data arus kas...
      </div>

      <div v-else-if="cashFlowsStore.cashFlows.length === 0" class="p-12 text-center">
        <p class="text-slate-500">Tidak ada riwayat catatan transaksi yang ditemukan.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600">
          <thead class="bg-slate-50 text-xs font-semibold text-slate-500 uppercase border-b border-slate-100">
            <tr>
              <th class="px-6 py-4">Tipe</th>
              <th class="px-6 py-4">Label</th>
              <th class="px-6 py-4">Sumber</th>
              <th class="px-6 py-4">Nominal</th>
              <th class="px-6 py-4">Waktu</th>
              <th class="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="item in cashFlowsStore.cashFlows"
              :key="item.id"
              class="hover:bg-slate-50/80 transition"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold',
                    item.type === 'inflow'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-rose-50 text-rose-700',
                  ]"
                >
                  {{ item.type === 'inflow' ? 'Pemasukan' : 'Pengeluaran' }}
                </span>
              </td>
              <td class="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                {{ item.label }}
              </td>
              <td class="px-6 py-4 capitalize whitespace-nowrap">
                {{ item.source }}
              </td>
              <td
                :class="[
                  'px-6 py-4 font-bold whitespace-nowrap',
                  item.type === 'inflow' ? 'text-emerald-600' : 'text-rose-600',
                ]"
              >
                {{ item.type === 'inflow' ? '+' : '-' }} {{ formatRupiah(item.nominal) }}
              </td>
              <td class="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                {{ formatDate(item.created_at) }}
              </td>
              <td class="px-6 py-4 text-right whitespace-nowrap space-x-2">
                <button
                  @click="router.push(`/cash-flows/${item.id}`)"
                  class="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  title="Lihat Rincian"
                >
                  <Eye class="w-4 h-4" />
                </button>
                <button
                  @click="openChangeModal(item)"
                  class="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                  title="Ubah"
                >
                  <Edit2 class="w-4 h-4" />
                </button>
                <button
                  @click="handleDelete(item.id)"
                  class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Hapus"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modals -->
    <AddModal
      :is-open="isAddModalOpen"
      @close="isAddModalOpen = false"
      @success="loadData"
    />
    <ChangeModal
      :is-open="isChangeModalOpen"
      :cash-flow="selectedCashFlow"
      @close="isChangeModalOpen = false"
      @success="loadData"
    />
  </div>
</template>
