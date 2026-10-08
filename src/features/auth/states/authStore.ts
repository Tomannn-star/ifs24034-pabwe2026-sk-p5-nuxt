import { defineStore } from "pinia";
import { getAccessToken, putAccessToken } from "@/helpers/apiHelper";
import { showSuccessDialog, showErrorDialog } from "@/helpers/toolsHelper";
import { loginApi, registerApi } from "../api/authApi";

export interface AuthState {
  token: string | null;
  isAuthLogin: boolean;
  isAuthRegister: boolean;
  isAuthLogout: boolean;
  error: string | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    token: getAccessToken(),
    isAuthLogin: false,
    isAuthRegister: false,
    isAuthLogout: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token),
  },
  actions: {
    async login(payload: { email?: string; password?: string }) {
      this.isAuthLogin = true;
      this.error = null;
      try {
        const response = await loginApi(payload);
        const token = response?.data?.token || response?.token;
        if (token) {
          this.token = token;
          putAccessToken(token);
        }
        await showSuccessDialog(response?.message || "Login berhasil!");
        return response;
      } catch (err: any) {
        this.error = err.message;
        await showErrorDialog(err.message || "Login gagal");
        throw err;
      } finally {
        this.isAuthLogin = false;
      }
    },
    async register(payload: { name?: string; email?: string; password?: string }) {
      this.isAuthRegister = true;
      this.error = null;
      try {
        const response = await registerApi(payload);
        await showSuccessDialog(response?.message || "Registrasi berhasil! Silakan login.");
        return response;
      } catch (err: any) {
        this.error = err.message;
        await showErrorDialog(err.message || "Registrasi gagal");
        throw err;
      } finally {
        this.isAuthRegister = false;
      }
    },
    logout() {
      this.isAuthLogout = true;
      this.token = null;
      putAccessToken(null);
      this.isAuthLogout = false;
    },
  },
});
