<script setup>
import { onMounted, ref } from "vue";
import { useUsersStore } from "../states/usersStore";
import { useInput } from "@/hooks/useInput";
import { showErrorDialog } from "@/helpers/toolsHelper";
import { Camera, User as UserIcon } from "lucide-vue-next";

const usersStore = useUsersStore();

const [name, onNameChange, setName] = useInput("");
const [oldPassword, onOldPasswordChange, setOldPassword] = useInput("");
const [newPassword, onNewPasswordChange, setNewPassword] = useInput("");
const [confirmNewPassword, onConfirmNewPasswordChange, setConfirmNewPassword] = useInput("");

const fileInput = ref(null);

onMounted(async () => {
  try {
    await usersStore.fetchProfile();
    if (usersStore.profile?.name) {
      setName(usersStore.profile.name);
    }
  } catch {
    // Handled
  }
});

async function handleUpdateProfile() {
  if (!name.value) {
    await showErrorDialog("Nama tidak boleh kosong!");
    return;
  }
  try {
    await usersStore.updateProfile({ name: name.value });
  } catch {
    // Handled
  }
}

async function handleFileChange(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    await usersStore.uploadPhoto(file);
  } catch {
    // Handled
  }
}

async function handleChangePassword() {
  if (!oldPassword.value || !newPassword.value || !confirmNewPassword.value) {
    await showErrorDialog("Semua kolom kata sandi wajib diisi!");
    return;
  }
  if (newPassword.value !== confirmNewPassword.value) {
    await showErrorDialog("Konfirmasi kata sandi baru tidak sesuai!");
    return;
  }

  try {
    await usersStore.changePassword({
      old_password: oldPassword.value,
      new_password: newPassword.value,
    });
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  } catch {
    // Handled
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-8">
    <div>
      <h1 class="text-2xl font-bold text-slate-900">Pengaturan Profil</h1>
      <p class="text-sm text-slate-500 mt-1">Kelola data profil akun dan keamanan Anda</p>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
      <div class="relative group">
        <div class="h-24 w-24 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center border-2 border-slate-200">
          <img
            v-if="usersStore.profile?.photo_url"
            :src="usersStore.profile.photo_url"
            :alt="usersStore.profile?.name"
            class="h-full w-full object-cover"
          />
          <UserIcon v-else class="h-10 w-10 text-slate-400" />
        </div>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleFileChange"
        />
        <button
          type="button"
          @click="$refs.fileInput?.click()"
          class="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-md transition"
          title="Ubah Foto Profil"
          aria-label="Ubah Foto Profil"
        >
          <Camera class="w-4 h-4" />
        </button>
      </div>

      <div class="text-center sm:text-left flex-1">
        <h2 class="text-lg font-bold text-slate-900">{{ usersStore.profile?.name || "Memuat..." }}</h2>
        <p class="text-sm text-slate-500">{{ usersStore.profile?.email || "-" }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 class="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-3">Informasi Akun</h2>
        <form @submit.prevent="handleUpdateProfile" class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-slate-700">Nama Lengkap</label>
            <input
              id="name"
              type="text"
              :value="name"
              @input="onNameChange"
              class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            />
          </div>

          <button
            type="submit"
            class="w-full py-2 px-4 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition"
          >
            Simpan Perubahan
          </button>
        </form>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 class="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-3">Ganti Kata Sandi</h2>
        <form @submit.prevent="handleChangePassword" class="space-y-4">
          <div>
            <label for="oldPassword" class="block text-sm font-medium text-slate-700">Kata Sandi Lama</label>
            <input
              id="oldPassword"
              type="password"
              :value="oldPassword"
              @input="onOldPasswordChange"
              class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label for="newPassword" class="block text-sm font-medium text-slate-700">Kata Sandi Baru</label>
            <input
              id="newPassword"
              type="password"
              :value="newPassword"
              @input="onNewPasswordChange"
              class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label for="confirmNewPassword" class="block text-sm font-medium text-slate-700">Konfirmasi Kata Sandi Baru</label>
            <input
              id="confirmNewPassword"
              type="password"
              :value="confirmNewPassword"
              @input="onConfirmNewPasswordChange"
              class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            class="w-full py-2 px-4 rounded-lg text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 transition"
          >
            Perbarui Kata Sandi
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
