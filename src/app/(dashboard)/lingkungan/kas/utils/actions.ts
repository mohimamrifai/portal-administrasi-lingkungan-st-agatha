'use server'

import { revalidatePath } from 'next/cache';
import { 
  createKasTransaction, 
  updateKasTransaction, 
  deleteKasTransaction,
  updateApprovalStatus,
  getKeluargaList
} from './kas-service';
import { JenisTransaksi, TipeTransaksiLingkungan, Role } from '@prisma/client';
import { prisma } from '@/lib/db';
import { KeluargaOption } from '../types';

// Fungsi utilitas untuk membuat notifikasi
async function createNotification(pesan: string, targetRoles: Role[] = []) {
  try {
    // Jika tidak ada role target, buat notifikasi untuk semua user
    if (targetRoles.length === 0) {
      const users = await prisma.user.findMany();
      await prisma.notification.createMany({
        data: users.map(user => ({
          pesan,
          userId: user.id
        }))
      });
    } else {
      // Buat notifikasi hanya untuk user dengan role tertentu
      const users = await prisma.user.findMany({
        where: {
          role: {
            in: targetRoles
          }
        }
      });
      await prisma.notification.createMany({
        data: users.map(user => ({
          pesan,
          userId: user.id
        }))
      });
    }
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
}

// Fungsi untuk mengambil data keluarga (sebagai server action)
export async function fetchKeluargaOptions(): Promise<{ success: boolean; data: KeluargaOption[]; error?: string }> {
  try {
    const keluargaData = await getKeluargaList();
    return {
      success: true,
      data: keluargaData
    };
  } catch (error) {
    console.error('Failed to fetch keluarga options:', error);
    return {
      success: false,
      data: [],
      error: 'Gagal mengambil data keluarga'
    };
  }
}

// Create transaction
export async function createTransaction(data: {
  tanggal: Date;
  jenisTranasksi: JenisTransaksi;
  tipeTransaksi: TipeTransaksiLingkungan;
  keterangan?: string;
  jumlah: number;
  keluargaId?: string;
}) {
  try {
    // Tentukan debit dan kredit berdasarkan jenis transaksi
    const debit = data.jenisTranasksi === JenisTransaksi.UANG_MASUK ? data.jumlah : 0;
    const kredit = data.jenisTranasksi === JenisTransaksi.UANG_KELUAR ? data.jumlah : 0;
    
    // Buat transaksi baru
    const transaction = await createKasTransaction({
      tanggal: data.tanggal,
      jenisTranasksi: data.jenisTranasksi,
      tipeTransaksi: data.tipeTransaksi,
      keterangan: data.keterangan,
      debit,
      kredit,
      keluargaId: data.keluargaId
    });
    
    // Buat notifikasi untuk semua pengguna tentang transaksi baru
    let notificationMessage = `Transaksi ${data.jenisTranasksi === JenisTransaksi.UANG_MASUK ? 'pemasukan' : 'pengeluaran'} baru sebesar Rp ${data.jumlah.toLocaleString('id-ID')} telah dibuat.`;
    
    // Jika ini adalah transaksi sumbangan umat, tambahkan info tentang keluarga
    if (data.tipeTransaksi === TipeTransaksiLingkungan.SUMBANGAN_UMAT && data.keluargaId) {
      const keluarga = await prisma.keluargaUmat.findUnique({
        where: { id: data.keluargaId },
        select: { namaKepalaKeluarga: true }
      });
      
      if (keluarga) {
        notificationMessage = `Sumbangan dari keluarga ${keluarga.namaKepalaKeluarga} sebesar Rp ${data.jumlah.toLocaleString('id-ID')} telah diterima.`;
      }
    }
    
    // Buat notifikasi khusus untuk transaksi Transfer Dana ke IKATA
    if (data.tipeTransaksi === TipeTransaksiLingkungan.TRANSFER_DANA_KE_IKATA) {
      notificationMessage = `Dana sebesar Rp ${data.jumlah.toLocaleString('id-ID')} telah ditransfer dari Kas Lingkungan ke IKATA.`;
    }
    
    await createNotification(notificationMessage);
    
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
  keluargaId?: string;
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
      kredit,
      keluargaId: data.keluargaId
    });
    
    // Buat notifikasi untuk perubahan transaksi
    const notificationMessage = `Transaksi kas lingkungan ID: ${id} telah diperbarui.`;
    await createNotification(notificationMessage);
    
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
    
    // Buat notifikasi untuk penghapusan transaksi
    const notificationMessage = `Transaksi kas lingkungan ID: ${id} telah dihapus.`;
    await createNotification(notificationMessage, [Role.SUPER_USER, Role.KETUA, Role.WAKIL_KETUA, Role.BENDAHARA, Role.WAKIL_BENDAHARA]);
    
    // Revalidasi path agar data tersebut diperbarui
    revalidatePath('/lingkungan/kas');
    
    return { success: true };
  } catch (error) {
    console.error('Failed to delete transaction:', error);
    return { success: false, error: 'Gagal menghapus transaksi' };
  }
}

// Update approval status
export async function approveTransaction(id: string, status: 'APPROVED' | 'REJECTED' | 'PENDING') {
  try {
    await updateApprovalStatus(id, status);
    
    // Ambil data transaksi untuk detail notifikasi
    const transaction = await prisma.kasLingkungan.findUnique({
      where: { id },
      include: { approval: true }
    });
    
    if (transaction) {
      // Buat notifikasi tentang perubahan status approval
      const amount = transaction.jenisTranasksi === JenisTransaksi.UANG_MASUK 
        ? transaction.debit 
        : transaction.kredit;
        
      let notificationMessage = "";
      
      if (status === 'APPROVED') {
        notificationMessage = `Transaksi ${transaction.jenisTranasksi === JenisTransaksi.UANG_MASUK ? 'pemasukan' : 'pengeluaran'} sebesar Rp ${amount.toLocaleString('id-ID')} telah disetujui.`;
      } else if (status === 'REJECTED') {
        notificationMessage = `Transaksi ${transaction.jenisTranasksi === JenisTransaksi.UANG_MASUK ? 'pemasukan' : 'pengeluaran'} sebesar Rp ${amount.toLocaleString('id-ID')} telah ditolak.`;
      } else if (status === 'PENDING') {
        notificationMessage = `Transaksi ${transaction.jenisTranasksi === JenisTransaksi.UANG_MASUK ? 'pemasukan' : 'pengeluaran'} sebesar Rp ${amount.toLocaleString('id-ID')} telah dibuka kembali dan menunggu persetujuan.`;
      }
      
      await createNotification(notificationMessage);
    }
    
    // Revalidasi path agar data tersebut diperbarui
    revalidatePath('/lingkungan/kas');
    
    return { success: true };
  } catch (error) {
    console.error('Failed to update approval status:', error);
    return { success: false, error: 'Gagal memperbarui status approval' };
  }
} 