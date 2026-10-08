<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "../states/authStore";
import { useInput } from "@/hooks/useInput";
import { showErrorDialog } from "@/helpers/toolsHelper";

const router = useRouter();
const authStore = useAuthStore();

const [email, onEmailChange] = useInput("");
const [password, onPasswordChange] = useInput("");

async function handleSubmit() {
  if (!email.value || !password.value) {
    await showErrorDialog("Email dan kata sandi wajib diisi!");
    return;
  }

  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    });
    router.push("/");
  } catch {
    // Handled by store dialog
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="mt-6 space-y-4">
    <div>
      <label for="email" class="block text-sm font-medium text-slate-700">Email</label>
      <input
        id="email"
        type="email"
        :value="email"
        @input="onEmailChange"
        required
        class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
        placeholder="nama@email.com"
      />
    </div>

    <div>
      <label for="password" class="block text-sm font-medium text-slate-700">Kata Sandi</label>
      <input
        id="password"
        type="password"
        :value="password"
        @input="onPasswordChange"
        required
        class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
        placeholder="••••••••"
      />
    </div>

    <button
      type="submit"
      :disabled="authStore.isAuthLogin"
      class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition"
    >
      {{ authStore.isAuthLogin ? "Memproses..." : "Masuk" }}
    </button>

    <div class="text-center text-sm text-slate-600 pt-2">
      Belum memiliki akun?
      <router-link to="/auth/register" class="font-medium text-blue-600 hover:text-blue-500 ml-1">
        Daftar sekarang
      </router-link>
    </div>
  </form>
</template>
