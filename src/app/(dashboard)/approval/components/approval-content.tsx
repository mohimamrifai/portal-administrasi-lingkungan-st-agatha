"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ApprovalFilter } from "./approval-filter"
import { ApprovalTable } from "./approval-table"
import { ConfirmationDialog } from "./confirmation-dialog"
import { ApprovalStats } from "./approval-stats"
import { ApprovalHistory } from "./approval-history"
import LoadingSkeleton from "./loading-skeleton"
import { StatusApproval } from "@prisma/client"
import { ExtendedApproval, ApprovalStats as ApprovalStatsType } from "../types"
import { getApprovals, approveApproval, rejectApproval, getFilteredApprovals, getApprovalStats } from "../utils/actions"

export default function ApprovalContent() {
  const [activeTab, setActiveTab] = useState("daftar")
  const [selectedMonth, setSelectedMonth] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [approvalData, setApprovalData] = useState<ExtendedApproval[]>([])
  const [filteredData, setFilteredData] = useState<ExtendedApproval[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<ApprovalStatsType>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    totalAmount: 0,
    thisMonthApproved: 0,
    thisMonthAmount: 0
  })
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ExtendedApproval | null>(null)
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Fetch data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        // Ambil data approval
        const approvalsResponse = await getApprovals()
        if (approvalsResponse.success && approvalsResponse.data) {
          setApprovalData(approvalsResponse.data as ExtendedApproval[])
        } else {
          throw new Error(approvalsResponse.error || "Gagal memuat data approval")
        }

        // Ambil statistik
        const statsResponse = await getApprovalStats()
        if (statsResponse.success && statsResponse.data) {
          setStats(statsResponse.data)
        }
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
    const filterData = async () => {
      if (approvalData.length === 0) return

      try {
        const filteredResponse = await getFilteredApprovals(selectedMonth, statusFilter)
        if (filteredResponse.success && filteredResponse.data) {
          setFilteredData(filteredResponse.data as ExtendedApproval[])
        } else {
          throw new Error(filteredResponse.error || "Gagal memfilter data")
        }
      } catch (error) {
        console.error("Error filtering data:", error)
        toast.error("Gagal memfilter data. Menggunakan data yang tersedia.")
        // Fallback ke filter lokal jika server action gagal
        let filtered = [...approvalData]
        
        if (statusFilter !== "all") {
          const statusEnum = statusFilter.toUpperCase() as StatusApproval
          filtered = filtered.filter(item => item.status === statusEnum)
        }
        
        if (selectedMonth !== 'all') {
          const [year, month] = selectedMonth.split('-').map(n => parseInt(n))
          filtered = filtered.filter(item => {
            let itemDate: Date | null = null
            
            if (item.doaLingkungan) {
              itemDate = new Date(item.doaLingkungan.tanggal)
            } else if (item.kasLingkungan) {
              itemDate = new Date(item.kasLingkungan.tanggal)
            }
            
            if (!itemDate) return false
            
            const itemYear = itemDate.getFullYear()
            const itemMonth = itemDate.getMonth() + 1
            return itemYear === year && itemMonth === month
          })
        }
        
        setFilteredData(filtered)
      }
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
  const handleOpenApproveDialog = (item: ExtendedApproval) => {
    setSelectedItem(item)
    setConfirmAction('approve')
    setIsDialogOpen(true)
  }
  
  // Membuka dialog konfirmasi untuk reject
  const handleOpenRejectDialog = (item: ExtendedApproval) => {
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
        const success = await approveApproval(selectedItem.id)
        
        if (success) {
          // Reload data untuk mendapatkan perubahan terbaru
          const approvalsResponse = await getApprovals()
          if (approvalsResponse.success && approvalsResponse.data) {
            setApprovalData(approvalsResponse.data as ExtendedApproval[])
          }
          
          // Reload statistik
          const statsResponse = await getApprovalStats()
          if (statsResponse.success && statsResponse.data) {
            setStats(statsResponse.data)
          }
          
          toast.success(`Persetujuan berhasil. Data telah diintegrasikan ke Kas Lingkungan.`)
          toast.info(`Notifikasi telah dikirim ke pengurus.`)
        } else {
          toast.error("Gagal mengintegrasikan data ke Kas Lingkungan. Silakan coba lagi.")
        }
      } else {
        const success = await rejectApproval(selectedItem.id, reason)
        
        if (success) {
          // Reload data untuk mendapatkan perubahan terbaru
          const approvalsResponse = await getApprovals()
          if (approvalsResponse.success && approvalsResponse.data) {
            setApprovalData(approvalsResponse.data as ExtendedApproval[])
          }
          
          // Reload statistik
          const statsResponse = await getApprovalStats()
          if (statsResponse.success && statsResponse.data) {
            setStats(statsResponse.data)
          }
          
          toast.info(`Permohonan ditolak. Notifikasi telah dikirim ke pengurus.`)
        } else {
          toast.error("Gagal menolak permohonan. Silakan coba lagi.")
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
      <ApprovalStats stats={stats} />

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-4 bg-muted/60 w-full sm:w-auto grid grid-cols-2 sm:flex">
          <TabsTrigger value="daftar" className="flex-1 px-4">Daftar Approval</TabsTrigger>
          <TabsTrigger value="riwayat" className="flex-1 px-4">Riwayat Approval</TabsTrigger>
        </TabsList>

        <TabsContent value="daftar" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-col space-y-1.5 p-4 sm:p-6">
              <CardTitle>Daftar Persetujuan</CardTitle>
              <CardDescription>
                Kelola semua permohonan yang memerlukan persetujuan
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
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
            <CardContent className="p-4 sm:p-6">
              <ApprovalHistory selectedMonth={selectedMonth} approvalData={approvalData} />
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