import Swal, { type SweetAlertResult } from "sweetalert2";

export function showSuccessDialog(message: string): Promise<SweetAlertResult> {
  return Swal.fire({
    icon: "success",
    title: "Berhasil!",
    text: message,
    confirmButtonColor: "#2563eb",
  });
}

export function showErrorDialog(message: string): Promise<SweetAlertResult> {
  return Swal.fire({
    icon: "error",
    title: "Gagal!",
    text: message,
    confirmButtonColor: "#ef4444",
  });
}

export function showConfirmDialog(message: string): Promise<SweetAlertResult> {
  return Swal.fire({
    icon: "warning",
    title: "Konfirmasi",
    text: message,
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#64748b",
    confirmButtonText: "Ya, lanjutkan!",
    cancelButtonText: "Batal",
  });
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  } catch {
    return "-";
  }
}

export function formatRupiah(amount: number | string | null | undefined): string {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

