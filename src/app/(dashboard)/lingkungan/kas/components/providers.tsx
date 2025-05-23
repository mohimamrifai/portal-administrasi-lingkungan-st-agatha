'use server'

import { getKasLingkungan } from "../utils/kas-service";
import { StatusApproval } from "@prisma/client";
import { TransactionData } from "../types";

// Transformasi data dari database ke format yang digunakan UI
export async function getTransactionsData(): Promise<TransactionData[]> {
  try {
    const kasData = await getKasLingkungan();
    
    return kasData.map(transaction => ({
      id: transaction.id,
      tanggal: transaction.tanggal,
      keterangan: transaction.keterangan,
      jenisTransaksi: transaction.jenisTranasksi,
      tipeTransaksi: transaction.tipeTransaksi,
      debit: transaction.debit,
      kredit: transaction.kredit,
      status: transaction.approval?.status || StatusApproval.PENDING,
      isApproved: transaction.approval?.status === StatusApproval.APPROVED,
      isRejected: transaction.approval?.status === StatusApproval.REJECTED,
      isPending: transaction.approval?.status === StatusApproval.PENDING || !transaction.approval,
      // Tambahkan data keluarga jika ada
      keluarga: transaction.keluarga ? {
        id: transaction.keluarga.id,
        namaKepalaKeluarga: transaction.keluarga.namaKepalaKeluarga
      } : undefined
    }));
  } catch (error) {
    console.error("Error transforming transaction data:", error);
    throw new Error("Gagal memproses data transaksi");
  }
}

// Menghitung saldo awal, total pendapatan, pengeluaran, dan saldo akhir
export async function getTransactionSummary() {
  try {
    const transactions = await getKasLingkungan();
    
    // Cek apakah ada transaksi saldo awal
    const initialBalanceTransaction = transactions.find(tx => 
      tx.tipeTransaksi === 'LAIN_LAIN' && 
      tx.keterangan === 'SALDO AWAL'
    );
    
    // Gunakan saldo awal dari database jika ada, atau default ke 0
    const initialBalance = initialBalanceTransaction ? initialBalanceTransaction.debit : 0;
    
    // Hitung total pendapatan dan pengeluaran (tanpa menyertakan saldo awal)
    const filteredTransactions = transactions.filter(tx => 
      !(tx.tipeTransaksi === 'LAIN_LAIN' && tx.keterangan === 'SALDO AWAL')
    );
    
    const totalIncome = filteredTransactions.reduce((sum, tx) => sum + tx.debit, 0);
    const totalExpense = filteredTransactions.reduce((sum, tx) => sum + tx.kredit, 0);
    const finalBalance = initialBalance + totalIncome - totalExpense;
    
    return {
      initialBalance,
      totalIncome,
      totalExpense,
      finalBalance
    };
  } catch (error) {
    console.error("Error calculating transaction summary:", error);
    throw new Error("Gagal menghitung ringkasan transaksi");
  }
} 