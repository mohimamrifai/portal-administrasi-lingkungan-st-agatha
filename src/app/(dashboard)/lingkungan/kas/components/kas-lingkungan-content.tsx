"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

// Import types and schemas
import { 
  Transaction, 
  TransactionFormValues, 
  PrintPdfFormValues,
  transactionFormSchema, 
  printPdfSchema,
} from "../types"

// Import utilities
import {
  generateTransactions,
  calculateNextNotificationTime,
  getMonthDateRange,
  filterTransactionsByMonth,
  calculateTransactionSummary,
  generateTransactionDescription,
  handleIkataTransfer,
  showTransactionNotification,
  createNewTransaction,
  setupNotificationTimer
} from "../utils"

// Import components
import { SummaryCards } from "./summary-cards"
import { PeriodFilter } from "./period-filter"
import { PrintPdfDialog } from "./print-pdf-dialog"
import { CreateTransactionDialog, EditTransactionDialog } from "./transaction-form-dialog"
import { TransactionsTable } from "./transactions-table"

export default function KasLingkunganContent() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [transactions, setTransactions] = useState<Transaction[]>(generateTransactions())
  const [isEditing, setIsEditing] = useState<number | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(getMonthDateRange(currentMonth))
  const [nextNotificationTime, setNextNotificationTime] = useState<Date | null>(null);

  // Calculate summary values
  const initialBalance = 1500000 // Initial balance
  const { totalIncome, totalExpense, finalBalance } = calculateTransactionSummary(transactions, initialBalance)

  // Set up notification time when component mounts
  useEffect(() => {
    setNextNotificationTime(calculateNextNotificationTime());
  }, []);

  // Set up notification timer
  useEffect(() => {
    if (nextNotificationTime) {
      return setupNotificationTimer(
        nextNotificationTime,
        transactions,
        setNextNotificationTime
      );
    }
  }, [nextNotificationTime, transactions]);

  // Transaction forms
  const createForm = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      date: new Date(),
      description: "",
      type: "debit",
      subtype: "",
      amount: 0,
      fromIkata: false,
    },
  })

  const editForm = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      date: new Date(),
      description: "",
      type: "debit",
      subtype: "",
      amount: 0,
      fromIkata: false,
    },
  })

  // PDF form
  const pdfForm = useForm<PrintPdfFormValues>({
    resolver: zodResolver(printPdfSchema),
    defaultValues: {
      dateRange: getMonthDateRange(currentMonth),
    },
  })

  function onTransactionSubmit(values: TransactionFormValues) {
    // Generate description based on type and subtype
    const description = generateTransactionDescription(values);
    
    // Handle automatic transfers to IKATA if needed
    handleIkataTransfer(values);

    if (isEditing !== null) {
      // Edit mode
      const updatedTransactions = transactions.map(tx => 
        tx.id === isEditing 
          ? {
              ...tx,
              date: values.date,
              description: description,
              debit: values.type === "debit" ? values.amount : 0,
              credit: values.type === "credit" ? values.amount : 0,
              transactionType: values.type,
              transactionSubtype: values.subtype,
              familyHeadId: values.familyHeadId,
            }
          : tx
      )
      setTransactions(updatedTransactions)
      toast.success("Transaksi berhasil diperbarui")
      
      // Close edit dialog
      setEditDialogOpen(false)
    } else {
      // Add mode
      const newTransaction = createNewTransaction(values, description)
      setTransactions([...transactions, newTransaction])
      toast.success("Transaksi berhasil ditambahkan")

      // If from IKATA, we would send notification here
      if (values.fromIkata) {
        toast.info("Notifikasi dikirim ke pengurus IKATA")
      }
    }
    
    // Show notification to all users
    showTransactionNotification(values, description);
    
    // Reset forms based on which form was used
    if (isEditing !== null) {
      // Reset edit form
      editForm.reset({
        date: new Date(),
        description: "",
        type: "debit",
        subtype: "",
        amount: 0,
        fromIkata: false,
      });
    } else {
      // Reset create form
      createForm.reset({
        date: new Date(),
        description: "",
        type: "debit",
        subtype: "",
        amount: 0,
        fromIkata: false,
      });
    }
    
    setIsEditing(null)
  }

  function onPrintPdf(values: PrintPdfFormValues) {
    // In real app, this would trigger a PDF generation
    toast.success(`Mencetak laporan periode ${format(values.dateRange.from, "dd/MM/yyyy")} - ${format(values.dateRange.to, "dd/MM/yyyy")}`)
    
    // Mark transactions as locked
    const updatedTransactions = transactions.map(tx => {
      if (tx.date >= values.dateRange.from && tx.date <= values.dateRange.to) {
        return { ...tx, locked: true }
      }
      return tx
    })
    setTransactions(updatedTransactions)
  }

  function handleDeleteTransaction(id: number) {
    setTransactions(transactions.filter(tx => tx.id !== id))
    toast.success("Transaksi berhasil dihapus")
  }

  function handleEditTransaction(id: number) {
    const transaction = transactions.find(tx => tx.id === id)
    if (transaction) {
      setIsEditing(id)
      
      // Set form values
      editForm.reset({
        date: transaction.date,
        description: transaction.description,
        type: transaction.transactionType as "debit" | "credit" || (transaction.debit > 0 ? "debit" : "credit"),
        subtype: transaction.transactionSubtype || "",
        amount: transaction.debit > 0 ? transaction.debit : transaction.credit,
        fromIkata: transaction.description.includes("IKATA"),
        familyHeadId: transaction.familyHeadId,
      })
      
      // Open edit dialog
      setEditDialogOpen(true)
    }
  }

  function handleToggleLock(id: number) {
    const updatedTransactions = transactions.map(tx => 
      tx.id === id ? { ...tx, locked: !tx.locked } : tx
    )
    setTransactions(updatedTransactions)
    
    const tx = transactions.find(tx => tx.id === id)
    if (tx) {
      toast.success(`Transaksi ${tx.locked ? 'dibuka' : 'dikunci'}`)
    }
  }

  function handleMonthChange(date: DateRange | undefined) {
    if (date?.from) {
      setCurrentMonth(date.from)
      setDateRange(date)
    }
  }

  // Filter transactions for current month
  const filteredTransactions = filterTransactionsByMonth(transactions, currentMonth)

  return (
    <div className="space-y-6 p-2">
      {/* Data Cards */}
      <SummaryCards
        initialBalance={initialBalance}
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        finalBalance={finalBalance}
      />

      {/* Filter and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-3">
          <PeriodFilter
            dateRange={dateRange}
            onMonthChange={handleMonthChange}
          />
          
          {/* Print PDF Dialog */}
          <PrintPdfDialog
            form={pdfForm}
            onSubmit={onPrintPdf}
          />
        </div>
        
        {/* Create Transaction Dialog */}
        <CreateTransactionDialog
          form={createForm}
          onSubmit={onTransactionSubmit}
        />
      </div>

      {/* Transaction Table */}
      <TransactionsTable
        transactions={filteredTransactions}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
        onToggleLock={handleToggleLock}
      />
      
      {/* Edit Transaction Dialog */}
      <EditTransactionDialog
        form={editForm}
        onSubmit={onTransactionSubmit}
        isOpen={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </div>
  )
} 