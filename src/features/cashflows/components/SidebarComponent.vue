<script setup>
import { useRoute } from "vue-router";
import { LayoutDashboard, Users, User, X } from "lucide-vue-next";

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["close"]);

const route = useRoute();

const navigation = [
  { name: "Ringkasan Arus Kas", href: "/", icon: LayoutDashboard },
  { name: "Direktori Pengguna", href: "/users", icon: Users },
  { name: "Profil Saya", href: "/profile", icon: User },
];

function isActive(href) {
  if (href === "/") return route.path === "/";
  return route.path.startsWith(href);
}
</script>

<template>
  <div>
    <!-- Mobile backdrop -->
    <div
      v-if="isOpen"
      @click="$emit('close')"
      class="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
    ></div>

    <!-- Sidebar content -->
    <aside
      :class="[
        'fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto',
        isOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <div class="h-16 flex items-center justify-between px-6 border-b border-slate-100 lg:hidden">
        <span class="font-bold text-slate-900">Menu Navigasi</span>
        <button
          type="button"
          @click="$emit('close')"
          aria-label="Tutup navigasi sidebar"
          class="p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <nav class="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <router-link
          v-for="item in navigation"
          :key="item.name"
          :to="item.href"
          @click="$emit('close')"
          :class="[
            'flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-sm transition',
            isActive(item.href)
              ? 'bg-blue-50 text-blue-600'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
          ]"
        >
          <component :is="item.icon" class="w-5 h-5 shrink-0" />
          <span>{{ item.name }}</span>
        </router-link>
      </nav>

      <div class="p-4 border-t border-slate-100 text-xs text-slate-500 text-center">
        &copy; 2026 Delcom Cash Flow
      </div>
    </aside>
  </div>
</template>

