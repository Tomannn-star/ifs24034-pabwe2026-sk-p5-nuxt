<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/features/auth/states/authStore";
import { useUsersStore } from "@/features/users/states/usersStore";
import { Menu, LogOut, Wallet } from "lucide-vue-next";

defineEmits(["toggleSidebar"]);

const router = useRouter();
const authStore = useAuthStore();
const usersStore = useUsersStore();

const userName = computed(() => usersStore.profile?.name || "Pengguna");

function handleLogout() {
  authStore.logout();
  router.push("/auth/login");
}
</script>

<template>
  <header class="bg-white border-b border-slate-200 sticky top-0 z-30">
    <div class="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <button
          type="button"
          @click="$emit('toggleSidebar')"
          class="p-2 rounded-lg text-slate-500 hover:text-slate-600 hover:bg-slate-100 lg:hidden focus:outline-none"
        >
          <Menu class="w-6 h-6" />
        </button>
        <div class="flex items-center space-x-2">
          <Wallet class="w-6 h-6 text-blue-600" />
          <span class="font-bold text-slate-900 text-lg hidden sm:inline">Delcom Cash Flow</span>
        </div>
      </div>

      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-3 text-right">
          <div class="hidden sm:block">
            <p class="text-sm font-semibold text-slate-900">{{ userName }}</p>
            <p class="text-xs text-slate-500">Akun Aktif</p>
          </div>
          <div class="h-9 w-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-200">
            {{ userName.charAt(0).toUpperCase() }}
          </div>
        </div>

        <button
          type="button"
          @click="handleLogout"
          class="flex items-center space-x-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
        >
          <LogOut class="w-4 h-4" />
          <span class="hidden sm:inline">Keluar</span>
        </button>
      </div>
    </div>
  </header>
</template>

