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
import { SetDuesDialog } from "./set-dues-dialog"
import { ReminderDialog } from "./reminder-dialog"
import { SubmitToParokiDialog } from "./submit-to-paroki-dialog"

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
  
  // State for edit transaction
  const [editingTransaction, setEditingTransaction] = useState<DanaMandiriTransaction | null>(null)
  
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
      const selectableIds = transactions
        .filter(tx => !tx.isLocked && tx.status !== "submitted")
        .map(tx => tx.id)
      setSelectedTransactionIds(selectableIds)
    } else {
      setSelectedTransactionIds([])
    }
  }
  
  // Handle selecting all families for reminders
  const handleSelectAllFamilies = (isChecked: boolean) => {
    if (isChecked) {
      const selectableIds = arrears.map(a => a.familyHeadId)
      setSelectedFamilyIds(selectableIds)
    } else {
      setSelectedFamilyIds([])
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
    printPdf(values.documentType, values.year, values.fileFormat)
    
    // Mark related transactions as locked if yearly report
    if (values.documentType === "yearly_report" && values.year) {
      const updatedTransactions = transactions.map(tx => 
        tx.year === values.year ? { ...tx, isLocked: true } : tx
      )
      setTransactions(updatedTransactions)
    }
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
        <h2 className="text-xl font-bold hidden md:block">Dana Mandiri</h2>
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
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setPrintDialogOpen(true)}>
                Print PDF
              </Button>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => setSubmitDialogOpen(true)}
                disabled={selectedTransactionIds.length === 0}
                className="mr-2"
              >
                Setor ke Paroki
              </Button>
              <Button onClick={() => setAddDialogOpen(true)}>
                Tambah Data
              </Button>
            </div>
          </div>
          
          <TransactionsTable
            transactions={transactions}
            onEdit={startEditTransaction}
            onDelete={handleDeleteTransaction}
            onToggleLock={handleToggleLock}
            selectedIds={selectedTransactionIds}
            onSelectChange={handleTransactionSelectChange}
            onSelectAll={handleSelectAllTransactions}
          />
        </TabsContent>
        
        <TabsContent value="tab2">
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
      
      {editingTransaction && (
        <TransactionFormDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSubmit={handleEditTransaction}
          defaultValues={{
            familyHeadId: editingTransaction.familyHeadId,
            year: editingTransaction.year,
            amount: editingTransaction.amount,
            paymentDate: editingTransaction.paymentDate,
            notes: editingTransaction.notes || "",
            paymentStatus: editingTransaction.paymentStatus,
          }}
          mode="edit"
        />
      )}
      
      <PrintPdfDialog
        open={printDialogOpen}
        onOpenChange={setPrintDialogOpen}
        onSubmit={handlePrintPdf}
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
    </div>
  )
} 