import { Transaction, TransactionFormValues, familyHeads } from "../types"
import { toast } from "sonner"
import { format } from "date-fns"

/**
 * Calculate transaction summary values
 * @param transactions List of transactions
 * @param initialBalance Initial balance amount
 * @returns Object containing summary values
 */
export function calculateTransactionSummary(transactions: Transaction[], initialBalance = 0) {
  const totalIncome = transactions.reduce((sum, tx) => sum + tx.debit, 0)
  const totalExpense = transactions.reduce((sum, tx) => sum + tx.credit, 0)
  const finalBalance = initialBalance + totalIncome - totalExpense

  return {
    initialBalance,
    totalIncome,
    totalExpense,
    finalBalance
  }
}

/**
 * Get family head name by ID
 * @param id Family head ID
 * @returns Family head name or empty string if not found
 */
export function getFamilyHeadName(id: number | undefined) {
  if (!id) return "";
  const familyHead = familyHeads.find(head => head.id === id);
  return familyHead ? familyHead.name : "";
}

/**
 * Generate description based on transaction type and subtype
 * @param values Transaction form values
 * @returns Generated description
 */
export function generateTransactionDescription(values: TransactionFormValues) {
  let description = values.description;
  
  // Generate automatic description for donations from family heads
  if (values.type === "debit" && values.subtype === "sumbangan_umat" && values.familyHeadId) {
    description = `Sumbangan dari ${getFamilyHeadName(values.familyHeadId)}`;
  }
  
  return description;
}

/**
 * Handle IKATA transfer if needed
 * @param values Transaction form values
 */
export function handleIkataTransfer(values: TransactionFormValues) {
  if (values.type === "credit" && values.subtype === "transfer_ikata" && values.confirmIkataTransfer) {
    // In a real application, this would involve an API call to the IKATA service
    toast.success("Dana berhasil ditransfer ke kas IKATA", {
      description: `Rp ${values.amount.toLocaleString('id-ID')} telah dicatat di kas IKATA sebagai pemasukan.`
    });
  }
}

/**
 * Show transaction notification to users
 * @param values Transaction form values
 * @param description Transaction description
 */
export function showTransactionNotification(values: TransactionFormValues, description: string) {
  toast.info(
    `Transaksi Baru Terekam: ${description} - Rp ${values.amount.toLocaleString('id-ID')}`,
    {
      description: `Tanggal: ${format(values.date, "dd/MM/yyyy")}
Tipe: ${values.type === "debit" ? "Pemasukan" : "Pengeluaran"}
Nominal: Rp ${values.amount.toLocaleString('id-ID')}`,
      duration: 5000,
    }
  );
}

/**
 * Create a new transaction object from form values
 * @param values Transaction form values
 * @param description Transaction description
 * @returns New transaction object
 */
export function createNewTransaction(values: TransactionFormValues, description: string): Transaction {
  return {
    id: Date.now(),
    date: values.date,
    description: description,
    debit: values.type === "debit" ? values.amount : 0,
    credit: values.type === "credit" ? values.amount : 0,
    locked: false,
    transactionType: values.type,
    transactionSubtype: values.subtype,
    familyHeadId: values.familyHeadId,
  }
}

/**
 * Generate a weekly transaction report notification
 * @param transactions List of transactions for the week
 */
export function generateWeeklyReport(transactions: Transaction[]) {
  if (transactions.length > 0) {
    const reportContent = transactions.map(tx => 
      `${format(tx.date, "dd/MM/yyyy")} - ${tx.description}: Rp ${(tx.debit > 0 ? tx.debit : tx.credit).toLocaleString('id-ID')}`
    ).join('\n');
    
    toast.info(
      "Laporan Transaksi Mingguan",
      {
        description: reportContent,
        duration: 10000,
      }
    );
  }
} 