<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "../states/authStore";
import { useInput } from "@/hooks/useInput";
import { showErrorDialog } from "@/helpers/toolsHelper";

const router = useRouter();
const authStore = useAuthStore();

const [name, onNameChange] = useInput("");
const [email, onEmailChange] = useInput("");
const [password, onPasswordChange] = useInput("");
const [confirmPassword, onConfirmPasswordChange] = useInput("");

async function handleSubmit() {
  if (!name.value || !email.value || !password.value) {
    await showErrorDialog("Semua kolom formulir pendaftaran wajib diisi!");
    return;
  }

  if (password.value !== confirmPassword.value) {
    await showErrorDialog("Konfirmasi kata sandi tidak cocok!");
    return;
  }

  try {
    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
    });
    router.push("/auth/login");
  } catch {
    // Handled by store dialog
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="mt-6 space-y-4">
    <div>
      <label for="register-name-input" class="block text-sm font-medium text-slate-700">Nama Lengkap</label>
      <input
        id="register-name-input"
        name="name"
        data-testid="register-name-input"
        type="text"
        :value="name"
        @input="onNameChange"
        required
        class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
        placeholder="Toman Sihombing"
      />
    </div>

    <div>
      <label for="register-email-input" class="block text-sm font-medium text-slate-700">Email</label>
      <input
        id="register-email-input"
        name="email"
        data-testid="register-email-input"
        type="email"
        :value="email"
        @input="onEmailChange"
        required
        class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
        placeholder="nama@email.com"
      />
    </div>

    <div>
      <label for="register-password-input" class="block text-sm font-medium text-slate-700">Kata Sandi</label>
      <input
        id="register-password-input"
        name="password"
        data-testid="register-password-input"
        type="password"
        :value="password"
        @input="onPasswordChange"
        required
        class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
        placeholder="••••••••"
      />
    </div>

    <div>
      <label for="register-confirm-password-input" class="block text-sm font-medium text-slate-700">Konfirmasi Kata Sandi</label>
      <input
        id="register-confirm-password-input"
        name="confirmPassword"
        data-testid="register-confirm-password-input"
        type="password"
        :value="confirmPassword"
        @input="onConfirmPasswordChange"
        required
        class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
        placeholder="••••••••"
      />
    </div>

    <button
      id="register-submit-button"
      data-testid="register-submit-button"
      type="submit"
      :disabled="authStore.isAuthRegister"
      class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition"
    >
      {{ authStore.isAuthRegister ? "Memproses..." : "Daftar Akun" }}
    </button>

    <div class="text-center text-sm text-slate-600 pt-2">
      Sudah memiliki akun?
      <router-link to="/auth/login" class="font-medium text-blue-600 hover:text-blue-500 ml-1">
        Masuk di sini
      </router-link>
    </div>
  </form>
</template>
