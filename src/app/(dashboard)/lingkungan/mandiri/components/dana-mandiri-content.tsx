"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { 
  DanaMandiriTransaction, 
  DanaMandiriArrears,
  TransactionFormValues,
  PrintPdfFormValues,
  SetDuesValues,
  SendReminderValues,
  SubmitToParokiValues
} from "../types"
import { 
  generateTransactions, 
  generateArrears, 
  calculateSummary, 
  formatCurrency,
  createNewTransaction,
  showTransactionNotification,
  submitToParoki,
  sendReminderNotification,
  printPdf
} from "../utils"
import { SummaryCards } from "./summary-cards"
import { TransactionsTable } from "./transactions-table"
import { MonitoringTable } from "./monitoring-table"
import { TransactionFormDialog } from "./transaction-form-dialog"
import { PrintPdfDialog } from "./print-pdf-dialog"
import { PDFPreviewDialog } from "./pdf-preview-dialog"
import { SetDuesDialog } from "./set-dues-dialog"
import { ReminderDialog } from "./reminder-dialog"
import { SubmitToParokiDialog } from "./submit-to-paroki-dialog"
import SlipPenyetoranDialog from "./slip-penyetoran-dialog"

export default function DanaMandiriContent() {
  // State for transactions and arrears
  const [transactions, setTransactions] = useState<DanaMandiriTransaction[]>(generateTransactions())
  const [arrears, setArrears] = useState<DanaMandiriArrears[]>(generateArrears())
  
  // State for selection
  const [selectedTransactionIds, setSelectedTransactionIds] = useState<number[]>([])
  const [selectedFamilyIds, setSelectedFamilyIds] = useState<number[]>([])
  
  // State for dialogs
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [printDialogOpen, setPrintDialogOpen] = useState(false)
  const [setDuesDialogOpen, setSetDuesDialogOpen] = useState(false)
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false)
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false)
  
  // State for PDF preview
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false)
  const [pdfPreviewData, setPdfPreviewData] = useState<{
    documentType: string;
    documentCategory: "bukti_terima_uang" | "setor_ke_paroki";
    month?: number;
    year: number;
  }>({
    documentType: "payment_receipt",
    documentCategory: "bukti_terima_uang",
    year: new Date().getFullYear()
  })
  
  // State for edit transaction
  const [editingTransaction, setEditingTransaction] = useState<DanaMandiriTransaction | null>(null)
  
  // State untuk dialog slip penyetoran
  const [slipPenyetoranDialogOpen, setSlipPenyetoranDialogOpen] = useState(false)
  
  // Calculate summary statistics
  const { totalCollected, paidCount, unpaidCount } = calculateSummary(transactions)
  
  // Calculate total selected amount for submission to paroki
  const totalSelectedAmount = transactions
    .filter(tx => selectedTransactionIds.includes(tx.id))
    .reduce((sum, tx) => sum + tx.amount, 0)
  
  // Handle transaction selection
  const handleTransactionSelectChange = (idOrIds: number | number[], isChecked: boolean) => {
    if (Array.isArray(idOrIds)) {
      // Handle multiple IDs (for select all)
      setSelectedTransactionIds(idOrIds);
    } else {
      // Handle single ID
      if (isChecked) {
        setSelectedTransactionIds(prev => [...prev, idOrIds]);
      } else {
        setSelectedTransactionIds(prev => prev.filter(txId => txId !== idOrIds));
      }
    }
  }
  
  // Handle family selection for reminders
  const handleFamilySelectChange = (id: number, isChecked: boolean) => {
    if (isChecked) {
      setSelectedFamilyIds(prev => [...prev, id])
    } else {
      setSelectedFamilyIds(prev => prev.filter(fId => fId !== id))
    }
  }
  
  // Handle selecting all transactions
  const handleSelectAllTransactions = (isChecked: boolean) => {
    if (isChecked) {
      // Pilih semua transaksi yang tidak terkunci dan belum disetor ke Paroki
      const selectableIds = transactions
        .filter(tx => !tx.isLocked && tx.status !== "submitted")
        .map(tx => tx.id);
      
      // Update state dengan semua ID yang bisa dipilih
      setSelectedTransactionIds(selectableIds);
    } else {
      // Kosongkan pilihan
      setSelectedTransactionIds([]);
    }
  }
  
  // Handle selecting all families for reminders
  const handleSelectAllFamilies = (isChecked: boolean) => {
    if (isChecked) {
      // Pilih semua kepala keluarga yang memiliki tunggakan
      const selectableIds = arrears.map(a => a.familyHeadId);
      
      // Update state dengan semua ID kepala keluarga
      setSelectedFamilyIds(selectableIds);
    } else {
      // Kosongkan pilihan
      setSelectedFamilyIds([]);
    }
  }
  
  // Handle adding new transaction
  const handleAddTransaction = (values: TransactionFormValues) => {
    const newTransaction = createNewTransaction(values)
    
    setTransactions(prev => [...prev, newTransaction])
    
    // Show notification
    showTransactionNotification(newTransaction)
    
    // Close dialog
    setAddDialogOpen(false)
  }
  
  // Handle editing transaction
  const handleEditTransaction = (values: TransactionFormValues) => {
    if (!editingTransaction) return
    
    const updatedTransactions = transactions.map(tx => 
      tx.id === editingTransaction.id ? {
        ...tx,
        familyHeadId: values.familyHeadId,
        year: values.year,
        amount: values.amount,
        paymentDate: values.paymentDate,
        notes: values.notes,
        status: values.paymentStatus === "Belum Lunas" ? "pending" as const : "paid" as const,
        paymentStatus: values.paymentStatus,
      } : tx
    )
    
    setTransactions(updatedTransactions)
    
    // Show notification
    toast.success("Transaksi berhasil diperbarui")
    
    // Close dialog
    setEditDialogOpen(false)
    setEditingTransaction(null)
  }
  
  // Start editing a transaction
  const startEditTransaction = (id: number) => {
    const transaction = transactions.find(tx => tx.id === id)
    if (transaction) {
      setEditingTransaction(transaction)
      setEditDialogOpen(true)
    }
  }
  
  // Handle deleting a transaction
  const handleDeleteTransaction = (id: number) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id))
    toast.success("Transaksi berhasil dihapus")
  }
  
  // Handle toggling transaction lock
  const handleToggleLock = (id: number) => {
    const tx = transactions.find(tx => tx.id === id)
    const updatedTransactions = transactions.map(tx => 
      tx.id === id ? { ...tx, isLocked: !tx.isLocked } : tx
    )
    
    setTransactions(updatedTransactions)
    
    if (tx) {
      toast.success(`Transaksi berhasil ${tx.isLocked ? 'dibuka' : 'dikunci'}`)
    }
  }
  
  // Handle print PDF
  const handlePrintPdf = (values: PrintPdfFormValues) => {
    // Show PDF preview with selected data
    setPdfPreviewData({
      documentType: "payment_receipt",
      documentCategory: values.documentCategory as "bukti_terima_uang" | "setor_ke_paroki",
      month: values.month,
      year: values.year
    })
    
    // Open PDF preview
    setPdfPreviewOpen(true)
    
    // Notifikasi akan ditampilkan saat user mengunduh PDF dari preview
  }
  
  // Handle set dues
  const handleSetDues = (values: SetDuesValues) => {
    toast.success(`Iuran Dana Mandiri tahun ${values.year} berhasil ditetapkan sebesar ${formatCurrency(values.amount)}`)
    
    // In a real app, this would update a database setting
  }
  
  // Handle submit to paroki
  const handleSubmitToParoki = (values: SubmitToParokiValues) => {
    const updatedTransactions = submitToParoki(transactions, values.transactionIds)
    setTransactions(updatedTransactions)
    
    // Clear selection
    setSelectedTransactionIds([])
  }
  
  // Handle send reminder
  const handleSendReminder = (values: SendReminderValues) => {
    sendReminderNotification(values.familyHeadIds, values.message)
    
    // Update last notification date
    const updatedArrears = arrears.map(arrear => 
      values.familyHeadIds.includes(arrear.familyHeadId)
        ? { ...arrear, lastNotificationDate: new Date() }
        : arrear
    )
    
    setArrears(updatedArrears)
    
    // Clear selection
    setSelectedFamilyIds([])
  }

  return (
    <div className="space-y-6 p-2">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold md:block">Dana Mandiri</h2>
      </div>
      
      {/* Summary Cards */}
      <SummaryCards
        totalCollected={totalCollected}
        paidCount={paidCount}
        unpaidCount={unpaidCount}
      />
      
      {/* Tabs */}
      <Tabs defaultValue="tab1" className="w-full">
        <TabsList>
          <TabsTrigger value="tab1">Data Transaksi</TabsTrigger>
          <TabsTrigger value="tab2">Monitoring Penunggak</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tab1" className="space-y-4">
          <div className="flex flex-col gap-2 md:flex-row justify-between">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setPrintDialogOpen(true)}>
                Print PDF
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setSlipPenyetoranDialogOpen(true)}
              >
                Template Slip Penyetoran
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setSubmitDialogOpen(true)} disabled={selectedTransactionIds.length === 0}>
                Setor ke Paroki ({selectedTransactionIds.length})
              </Button>
              <Button onClick={() => setAddDialogOpen(true)}>
                Tambah Data
              </Button>
            </div>
          </div>
          
          <TransactionsTable
            transactions={transactions}
            selectedIds={selectedTransactionIds}
            onSelectChange={handleTransactionSelectChange}
            onSelectAll={handleSelectAllTransactions}
            onEdit={startEditTransaction}
            onDelete={handleDeleteTransaction}
            onToggleLock={handleToggleLock}
          />
        </TabsContent>
        
        <TabsContent value="tab2" className="space-y-4">
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setPrintDialogOpen(true)}>
                Print PDF
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setReminderDialogOpen(true)} disabled={selectedFamilyIds.length === 0}>
                Kirim Pengingat ({selectedFamilyIds.length})
              </Button>
            </div>
          </div>
          
          <MonitoringTable
            arrears={arrears}
            selectedFamilyIds={selectedFamilyIds}
            onSelectChange={handleFamilySelectChange}
            onSelectAll={handleSelectAllFamilies}
            onSendReminder={() => setReminderDialogOpen(true)}
            onSetDues={() => setSetDuesDialogOpen(true)}
          />
        </TabsContent>
      </Tabs>
      
      {/* Dialogs */}
      <TransactionFormDialog 
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={handleAddTransaction}
        mode="add"
      />
      
      <TransactionFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSubmit={handleEditTransaction}
        defaultValues={editingTransaction ? {
          familyHeadId: editingTransaction.familyHeadId,
          year: editingTransaction.year,
          amount: editingTransaction.amount,
          paymentDate: editingTransaction.paymentDate,
          notes: editingTransaction.notes || "",
          paymentStatus: editingTransaction.paymentStatus,
        } : undefined}
        mode="edit"
      />
      
      <PrintPdfDialog
        open={printDialogOpen}
        onOpenChange={setPrintDialogOpen}
        onSubmit={handlePrintPdf}
      />
      
      <PDFPreviewDialog
        open={pdfPreviewOpen}
        onOpenChange={setPdfPreviewOpen}
        documentType={pdfPreviewData.documentType}
        documentCategory={pdfPreviewData.documentCategory}
        transactions={transactions}
        month={pdfPreviewData.month}
        year={pdfPreviewData.year}
      />
      
      <SetDuesDialog
        open={setDuesDialogOpen}
        onOpenChange={setSetDuesDialogOpen}
        onSubmit={handleSetDues}
      />
      
      <ReminderDialog
        open={reminderDialogOpen}
        onOpenChange={setReminderDialogOpen}
        onSubmit={handleSendReminder}
        selectedFamilyIds={selectedFamilyIds}
      />
      
      <SubmitToParokiDialog
        open={submitDialogOpen}
        onOpenChange={setSubmitDialogOpen}
        onSubmit={handleSubmitToParoki}
        selectedTransactionIds={selectedTransactionIds}
        totalAmount={totalSelectedAmount}
      />
      
      <SlipPenyetoranDialog
        open={slipPenyetoranDialogOpen}
        onOpenChange={setSlipPenyetoranDialogOpen}
      />
    </div>
  )
} 