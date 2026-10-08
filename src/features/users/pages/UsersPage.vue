<script setup>
import { onMounted } from "vue";
import { useUsersStore } from "../states/usersStore";
import { formatDate } from "@/helpers/toolsHelper";
import { UserCheck } from "lucide-vue-next";

const usersStore = useUsersStore();

onMounted(async () => {
  await usersStore.fetchUsers();
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Daftar Pengguna</h1>
        <p class="text-sm text-slate-500 mt-1">Pengguna yang terdaftar dalam sistem Delcom Cash Flow</p>
      </div>
    </div>

    <div v-if="usersStore.isLoading" class="text-center py-12 text-slate-500">
      Memuat daftar pengguna...
    </div>

    <div v-else-if="usersStore.users.length === 0" class="text-center py-12 bg-white rounded-xl border border-slate-200">
      <UserCheck class="w-12 h-12 text-slate-400 mx-auto mb-3" />
      <p class="text-slate-600 font-medium">Belum ada pengguna lain terdaftar.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="user in usersStore.users"
        :key="user.id"
        class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex items-center space-x-4"
      >
        <div class="h-12 w-12 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
          <img
            v-if="user.photo_url"
            :src="user.photo_url"
            :alt="user.name"
            class="h-full w-full object-cover"
          />
          <span v-else class="text-blue-600 font-semibold text-lg">
            {{ user.name?.charAt(0)?.toUpperCase() || "U" }}
          </span>
        </div>
        <div class="min-w-0 flex-1">
          <h3 class="text-base font-semibold text-slate-900 truncate">{{ user.name }}</h3>
          <p class="text-sm text-slate-500 truncate">{{ user.email }}</p>
          <p class="text-xs text-slate-400 mt-1">Bergabung: {{ formatDate(user.created_at) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

