'use server'

import { revalidatePath } from 'next/cache';
import { 
  createKasTransaction, 
  updateKasTransaction, 
  deleteKasTransaction,
  updateApprovalStatus
} from './kas-service';
import { JenisTransaksi, TipeTransaksiLingkungan } from '@prisma/client';

// Create transaction
export async function createTransaction(data: {
  tanggal: Date;
  jenisTranasksi: JenisTransaksi;
  tipeTransaksi: TipeTransaksiLingkungan;
  keterangan?: string;
  jumlah: number;
}) {
  try {
    // Tentukan debit dan kredit berdasarkan jenis transaksi
    const debit = data.jenisTranasksi === JenisTransaksi.UANG_MASUK ? data.jumlah : 0;
    const kredit = data.jenisTranasksi === JenisTransaksi.UANG_KELUAR ? data.jumlah : 0;
    
    // Buat transaksi baru
    await createKasTransaction({
      tanggal: data.tanggal,
      jenisTranasksi: data.jenisTranasksi,
      tipeTransaksi: data.tipeTransaksi,
      keterangan: data.keterangan,
      debit,
      kredit
    });
    
    // Revalidasi path agar data tersebut diperbarui
    revalidatePath('/lingkungan/kas');
    
    return { success: true };
  } catch (error) {
    console.error('Failed to create transaction:', error);
    return { success: false, error: 'Gagal membuat transaksi' };
  }
}

// Update transaction
export async function updateTransaction(id: string, data: {
  tanggal: Date;
  jenisTranasksi: JenisTransaksi;
  tipeTransaksi: TipeTransaksiLingkungan;
  keterangan?: string;
  jumlah: number;
}) {
  try {
    // Tentukan debit dan kredit berdasarkan jenis transaksi
    const debit = data.jenisTranasksi === JenisTransaksi.UANG_MASUK ? data.jumlah : 0;
    const kredit = data.jenisTranasksi === JenisTransaksi.UANG_KELUAR ? data.jumlah : 0;
    
    // Update transaksi
    await updateKasTransaction(id, {
      tanggal: data.tanggal,
      jenisTranasksi: data.jenisTranasksi,
      tipeTransaksi: data.tipeTransaksi,
      keterangan: data.keterangan,
      debit,
      kredit
    });
    
    // Revalidasi path agar data tersebut diperbarui
    revalidatePath('/lingkungan/kas');
    
    return { success: true };
  } catch (error) {
    console.error('Failed to update transaction:', error);
    return { success: false, error: 'Gagal memperbarui transaksi' };
  }
}

// Delete transaction
export async function deleteTransaction(id: string) {
  try {
    await deleteKasTransaction(id);
    
    // Revalidasi path agar data tersebut diperbarui
    revalidatePath('/lingkungan/kas');
    
    return { success: true };
  } catch (error) {
    console.error('Failed to delete transaction:', error);
    return { success: false, error: 'Gagal menghapus transaksi' };
  }
}

// Update approval status
export async function approveTransaction(id: string, status: 'APPROVED' | 'REJECTED') {
  try {
    await updateApprovalStatus(id, status);
    
    // Revalidasi path agar data tersebut diperbarui
    revalidatePath('/lingkungan/kas');
    
    return { success: true };
  } catch (error) {
    console.error('Failed to update approval status:', error);
    return { success: false, error: 'Gagal memperbarui status approval' };
  }
} 