"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ApprovalItem } from "../types"
import { ApprovalFilter } from "./approval-filter"
import { ApprovalTable } from "./approval-table"
import { ConfirmationDialog } from "./confirmation-dialog"
import { ApprovalStats } from "./approval-stats"
import { ApprovalHistory } from "./approval-history"
import { fetchApprovalData, approveItem, rejectItem } from "../utils/service"
import LoadingSkeleton from "./loading-skeleton"

export default function ApprovalContent() {
  const [activeTab, setActiveTab] = useState("daftar")
  const [selectedMonth, setSelectedMonth] = useState<string>(
    `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`
  )
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [approvalData, setApprovalData] = useState<ApprovalItem[]>([])
  const [filteredData, setFilteredData] = useState<ApprovalItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null)
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Fetch data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const data = await fetchApprovalData()
        setApprovalData(data)
      } catch (error) {
        console.error("Error fetching approval data:", error)
        toast.error("Gagal memuat data. Silakan coba lagi.")
      } finally {
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [])

  // Filter data berdasarkan bulan dan status
  useEffect(() => {
    if (approvalData.length === 0) return
    
    const filterData = () => {
      const [year, month] = selectedMonth.split('-').map(n => parseInt(n))
      
      let filtered = approvalData.filter(item => {
        const itemYear = item.tanggal.getFullYear()
        const itemMonth = item.tanggal.getMonth() + 1
        return itemYear === year && itemMonth === month
      })
      
      if (statusFilter !== "all") {
        filtered = filtered.filter(item => item.status === statusFilter as 'pending' | 'approved' | 'rejected')
      }
      
      setFilteredData(filtered)
    }
    
    filterData()
  }, [selectedMonth, statusFilter, approvalData])

  // Menangani perubahan bulan
  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMonth(e.target.value)
  }

  // Menangani perubahan filter status
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
  }

  // Membuka dialog konfirmasi untuk approve
  const handleOpenApproveDialog = (item: ApprovalItem) => {
    setSelectedItem(item)
    setConfirmAction('approve')
    setIsDialogOpen(true)
  }
  
  // Membuka dialog konfirmasi untuk reject
  const handleOpenRejectDialog = (item: ApprovalItem) => {
    setSelectedItem(item)
    setConfirmAction('reject')
    setIsDialogOpen(true)
  }

  // Menangani aksi persetujuan atau penolakan
  const handleConfirmAction = async (reason?: string, message?: string) => {
    if (!selectedItem || !confirmAction) return
    
    setIsProcessing(true)
    
    try {
      if (confirmAction === 'approve') {
        const success = await approveItem(selectedItem, message)
        
        if (success) {
          // Update approval data
          const updatedData = approvalData.map(item => 
            item.id === selectedItem.id
              ? { ...item, status: 'approved' as const, message }
              : item
          )
          setApprovalData(updatedData)
          
          toast.success(`Persetujuan berhasil. Data telah diintegrasikan ke Kas Lingkungan.`)
          toast.info(`Notifikasi telah dikirim ke pengurus.`)
        } else {
          toast.error("Gagal mengintegrasikan data ke Kas Lingkungan. Silakan coba lagi.")
        }
      } else {
        const success = await rejectItem(selectedItem, reason, message)
        
        if (success) {
          // Update approval data
          const updatedData = approvalData.map(item => 
            item.id === selectedItem.id
              ? { ...item, status: 'rejected' as const, reason, message }
              : item
          )
          setApprovalData(updatedData)
          
          toast.info(`Permohonan diedit. Notifikasi telah dikirim ke pengurus.`)
        } else {
          toast.error("Gagal mengedit permohonan. Silakan coba lagi.")
        }
      }
      
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saat memproses persetujuan:", error)
      toast.error("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <ApprovalStats items={approvalData} />

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-4 bg-muted/60">
          <TabsTrigger value="daftar">Daftar Approval</TabsTrigger>
          <TabsTrigger value="riwayat">Riwayat Approval</TabsTrigger>
        </TabsList>

        <TabsContent value="daftar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Persetujuan</CardTitle>
              <CardDescription>
                Kelola semua permohonan yang memerlukan persetujuan
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filter */}
              <div className="mb-6">
                <ApprovalFilter
                  selectedMonth={selectedMonth}
                  onMonthChange={handleMonthChange}
                  statusFilter={statusFilter}
                  onStatusFilterChange={handleStatusFilterChange}
                />
              </div>

              {/* Table */}
              <ApprovalTable
                items={filteredData}
                onApprove={handleOpenApproveDialog}
                onReject={handleOpenRejectDialog}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="riwayat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Persetujuan</CardTitle>
              <CardDescription>
                Daftar permohonan yang telah disetujui atau ditolak
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filter Bulan untuk Riwayat */}
              <div className="mb-6">
                <div className="flex items-center space-x-2">
                  <label htmlFor="historyMonth" className="text-sm font-medium">
                    Pilih Bulan:
                  </label>
                  <input
                    id="historyMonth"
                    type="month"
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    className="p-2 border rounded"
                  />
                </div>
              </div>

              {/* History Component */}
              <ApprovalHistory selectedMonth={selectedMonth} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedItem={selectedItem}
        confirmAction={confirmAction}
        onConfirm={handleConfirmAction}
        isLoading={isProcessing}
      />
    </div>
  );
} 