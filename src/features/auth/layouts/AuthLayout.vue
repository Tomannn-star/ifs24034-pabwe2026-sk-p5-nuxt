<script setup>
</script>

<template>
  <main class="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
      <div class="text-center">
        <img :src="'/logo.svg'" alt="Logo Delcom Cash Flow" class="mx-auto h-12 w-auto mb-3" />
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Delcom Cash Flow</h1>
        <p class="text-sm text-slate-500 mt-1">Kelola transaksi dan pantau arus kas Anda secara rapi</p>
      </div>
      <router-view />
    </div>
  </main>
</template>

