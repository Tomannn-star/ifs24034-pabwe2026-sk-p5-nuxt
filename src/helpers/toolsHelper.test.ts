import { describe, it, expect, vi } from "vitest";
import Swal from "sweetalert2";
import { showSuccessDialog, showErrorDialog, showConfirmDialog, formatDate, formatRupiah } from "./toolsHelper";

describe("toolsHelper", () => {
  it("should trigger Swal.fire for showSuccessDialog", async () => {
    await showSuccessDialog("Operasi sukses");
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: "success",
        title: "Berhasil!",
        text: "Operasi sukses",
      })
    );
  });

  it("should trigger Swal.fire for showErrorDialog", async () => {
    await showErrorDialog("Terjadi kesalahan");
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: "error",
        title: "Gagal!",
        text: "Terjadi kesalahan",
      })
    );
  });

  it("should trigger Swal.fire for showConfirmDialog", async () => {
    await showConfirmDialog("Apakah anda yakin?");
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: "warning",
        title: "Konfirmasi",
        text: "Apakah anda yakin?",
      })
    );
  });

  it("should format valid and invalid dates properly", () => {
    expect(formatDate(null)).toBe("-");
    expect(formatDate("invalid-date")).toBe("-");
    const formatted = formatDate("2026-03-15T10:00:00Z");
    expect(formatted).not.toBe("-");
    expect(formatted).toContain("2026");
  });

  it("should handle error in formatDate catch block", () => {
    const originalDate = global.Date;
    (global as any).Date = function () {
      throw new Error("Date error");
    };
    expect(formatDate("2026-01-01")).toBe("-");
    global.Date = originalDate;
  });

  it("should format Rupiah currency properly", () => {
    expect(formatRupiah(100000)).toMatch(/Rp\s*100\.000/);
    expect(formatRupiah(0)).toMatch(/Rp\s*0/);
    expect(formatRupiah(null)).toMatch(/Rp\s*0/);
  });
});

