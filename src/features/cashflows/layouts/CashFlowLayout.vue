<script setup>
import { ref } from "vue";
import NavbarComponent from "../components/NavbarComponent.vue";
import SidebarComponent from "../components/SidebarComponent.vue";

const isSidebarOpen = ref(false);

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
}

function closeSidebar() {
  isSidebarOpen.value = false;
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50">
    <NavbarComponent @toggle-sidebar="toggleSidebar" />
    <div class="flex-1 flex overflow-hidden">
      <SidebarComponent :is-open="isSidebarOpen" @close="closeSidebar" />
      <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <router-view />
      </main>
    </div>
  </div>
</template>

