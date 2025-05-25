'use server';

import { revalidatePath } from "next/cache";
import { createKasIkataTransaction, updateKasIkataTransaction, deleteKasIkataTransaction } from "./kas-ikata-service";
import { JenisTransaksi, TipeTransaksiIkata } from "@prisma/client";

// Create transaction
export async function createTransaction(data: {
  tanggal: Date;
  jenisTranasksi: JenisTransaksi;
  tipeTransaksi: TipeTransaksiIkata;
  keterangan?: string;
  jumlah: number;
  keluargaId?: string;
  totalIuran?: number;
}) {
  try {
    console.log("[createTransaction] Processing request:", data);
    
    // Tentukan debit dan kredit berdasarkan jenis transaksi
    const debit = data.jenisTranasksi === JenisTransaksi.UANG_MASUK ? data.jumlah : 0;
    const kredit = data.jenisTranasksi === JenisTransaksi.UANG_KELUAR ? data.jumlah : 0;
    
    // Buat transaksi baru
    const transaction = await createKasIkataTransaction({
      tanggal: data.tanggal,
      jenisTranasksi: data.jenisTranasksi,
      tipeTransaksi: data.tipeTransaksi,
      keterangan: data.keterangan,
      debit,
      kredit,
      keluargaId: data.keluargaId,
      totalIuran: data.totalIuran
    });
    
    console.log("[createTransaction] Transaction created:", transaction);
    
    return transaction;
  } catch (error) {
    console.error("[createTransaction] Error:", error);
    throw new Error("Gagal membuat transaksi kas IKATA");
  }
}

// Update transaction
export async function updateTransaction(id: string, data: {
  tanggal: Date;
  jenisTranasksi: JenisTransaksi;
  tipeTransaksi: TipeTransaksiIkata;
  keterangan?: string;
  jumlah: number;
  keluargaId?: string;
  totalIuran?: number;
}) {
  try {
    // Tentukan debit dan kredit berdasarkan jenis transaksi
    const debit = data.jenisTranasksi === JenisTransaksi.UANG_MASUK ? data.jumlah : 0;
    const kredit = data.jenisTranasksi === JenisTransaksi.UANG_KELUAR ? data.jumlah : 0;
    
    // Update transaksi
    const transaction = await updateKasIkataTransaction(id, {
      tanggal: data.tanggal,
      jenisTranasksi: data.jenisTranasksi,
      tipeTransaksi: data.tipeTransaksi,
      keterangan: data.keterangan,
      debit,
      kredit,
      keluargaId: data.keluargaId,
      totalIuran: data.totalIuran
    });
    
    return transaction;
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw new Error("Gagal memperbarui transaksi kas IKATA");
  }
}

// Delete transaction
export async function deleteTransaction(id: string) {
  try {
    const transaction = await deleteKasIkataTransaction(id);
    
    return transaction;
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw new Error("Gagal menghapus transaksi kas IKATA");
  }
} 