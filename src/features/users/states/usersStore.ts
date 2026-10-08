import { defineStore } from "pinia";
import {
  getUsersApi,
  getProfileApi,
  updateProfileApi,
  uploadPhotoApi,
  changePasswordApi,
} from "../api/userApi";
import { showSuccessDialog, showErrorDialog } from "@/helpers/toolsHelper";

export interface User {
  id: string | number;
  name: string;
  email: string;
  photo_url?: string;
  created_at?: string;
}

export interface UsersState {
  users: User[];
  user: User | null;
  profile: User | null;
  isLoading: boolean;
  isProfileUpdated: boolean;
  isPhotoUploaded: boolean;
  isPasswordChanged: boolean;
  error: string | null;
}

export const useUsersStore = defineStore("users", {
  state: (): UsersState => ({
    users: [],
    user: null,
    profile: null,
    isLoading: false,
    isProfileUpdated: false,
    isPhotoUploaded: false,
    isPasswordChanged: false,
    error: null,
  }),
  actions: {
    async fetchUsers(params = {}) {
      this.isLoading = true;
      this.error = null;
      try {
        const res = await getUsersApi(params);
        if (res?.data?.users) {
          this.users = res.data.users;
        }
        return res;
      } catch (err: any) {
        this.error = err.message;
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
    async fetchProfile() {
      this.isLoading = true;
      this.error = null;
      try {
        const res = await getProfileApi();
        if (res?.data?.user) {
          this.profile = res.data.user;
        }
        return res;
      } catch (err: any) {
        this.error = err.message;
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
    async updateProfile(payload: { name?: string }) {
      this.isProfileUpdated = false;
      try {
        const res = await updateProfileApi(payload);
        this.isProfileUpdated = true;
        if (this.profile && payload.name) {
          this.profile.name = payload.name;
        }
        await showSuccessDialog(res?.message || "Profil berhasil diperbarui!");
        return res;
      } catch (err: any) {
        await showErrorDialog(err.message || "Gagal memperbarui profil");
        throw err;
      } finally {
        this.isProfileUpdated = false;
      }
    },
    async uploadPhoto(file: File) {
      this.isPhotoUploaded = false;
      const formData = new FormData();
      formData.append("photo", file);
      try {
        const res = await uploadPhotoApi(formData);
        this.isPhotoUploaded = true;
        if (this.profile && res?.data?.photo_url) {
          this.profile.photo_url = res.data.photo_url;
        }
        await showSuccessDialog(res?.message || "Foto profil berhasil diunggah!");
        return res;
      } catch (err: any) {
        await showErrorDialog(err.message || "Gagal mengunggah foto");
        throw err;
      } finally {
        this.isPhotoUploaded = false;
      }
    },
    async changePassword(payload: { old_password?: string; new_password?: string }) {
      this.isPasswordChanged = false;
      try {
        const res = await changePasswordApi(payload);
        this.isPasswordChanged = true;
        await showSuccessDialog(res?.message || "Kata sandi berhasil diperbarui!");
        return res;
      } catch (err: any) {
        await showErrorDialog(err.message || "Gagal memperbarui kata sandi");
        throw err;
      } finally {
        this.isPasswordChanged = false;
      }
    },
  },
});
