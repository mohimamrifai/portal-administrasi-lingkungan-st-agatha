'use server'

import { getKasLingkungan } from "../utils/kas-service";
import { StatusApproval } from "@prisma/client";
import { TransactionData } from "../types/schema";

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
      isPending: transaction.approval?.status === StatusApproval.PENDING || !transaction.approval
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
    
    // Asumsikan saldo awal 0, namun pada implementasi lengkap
    // bisa mengambil dari pengaturan sistem atau transaksi pertama
    const initialBalance = 0;
    
    const totalIncome = transactions.reduce((sum, tx) => sum + tx.debit, 0);
    const totalExpense = transactions.reduce((sum, tx) => sum + tx.kredit, 0);
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