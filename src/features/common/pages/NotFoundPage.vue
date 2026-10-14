<script setup>
import { useRouter } from "vue-router";
import { AlertCircle, ArrowLeft } from "lucide-vue-next";

const router = useRouter();
</script>

<template>
  <main class="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
    <div class="max-w-md w-full text-center bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
      <div class="inline-flex p-3 rounded-2xl bg-rose-50 text-rose-600 mb-2">
        <AlertCircle class="w-10 h-10" />
      </div>
      <h1 class="text-4xl font-extrabold text-slate-900 tracking-tight">404</h1>
      <h2 class="text-lg font-bold text-slate-800">Halaman Tidak Ditemukan</h2>
      <p class="text-sm text-slate-500">
        Maaf, halaman atau transaksi yang Anda cari tidak tersedia atau telah dipindahkan.
      </p>
      <div class="pt-2">
        <button
          type="button"
          @click="router.push('/')"
          class="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition"
        >
          <ArrowLeft class="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </button>
      </div>
    </div>
  </main>
</template>

