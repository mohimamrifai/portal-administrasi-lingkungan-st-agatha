"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { Input } from "@/components/ui/input"
import { SearchIcon, X } from "lucide-react"

import { YearFilter } from "./year-filter"
import { PaymentHistoryTable } from "./payment-history-table"
import { SummaryCards } from "./summary-cards"
import { PaymentHistory, PaymentStatus } from "../types"
import { 
  generatePaymentHistoryData, 
  filterPaymentHistory, 
  getUniqueYears,
  filterPaymentsByUserAndType 
} from "../utils/index"

export default function HistoriPembayaranContent() {
  const { userRole } = useAuth()
  const isSuperUser = userRole === "SuperUser"
  
  // State untuk menyimpan data histori pembayaran
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([])
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>(undefined)
  
  // Fetch data saat komponen di-mount
  useEffect(() => {
    // Simulasi pemanggilan API
    const fetchData = async () => {
      try {
        setIsLoading(true)
        // Simulasi delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        // Gunakan data dummy
        const data = generatePaymentHistoryData()
        setPaymentHistory(data)
      } catch (error) {
        toast.error("Gagal memuat data histori pembayaran")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])
  
  // Data untuk tabel, difilter berdasarkan role dan search term
  const getFilteredData = (type: "Dana Mandiri" | "IKATA") => {
    let data = filterPaymentsByUserAndType(
      paymentHistory, 
      type, 
      isSuperUser ? selectedUserId : 1, // Umat ID 1 untuk role Umat, opsional untuk SuperUser
      isSuperUser // Flag untuk menentukan apakah menampilkan semua data atau hanya milik pengguna
    )
    
    // Filter berdasarkan tahun
    if (selectedYear) {
      data = data.filter(payment => payment.year === selectedYear)
    }
    
    // Untuk SuperUser, tambahkan filter berdasarkan search term
    if (isSuperUser && searchTerm) {
      const lowercaseSearchTerm = searchTerm.toLowerCase()
      data = data.filter(payment => {
        return payment.familyHeadName?.toLowerCase().includes(lowercaseSearchTerm) ||
               payment.description?.toLowerCase().includes(lowercaseSearchTerm)
      })
    }
    
    return data
  }
  
  // Data yang sudah difilter
  const danaMandiriData = getFilteredData("Dana Mandiri")
  const ikataData = getFilteredData("IKATA")
  
  // Mendapatkan daftar tahun untuk filter
  const availableYears = getUniqueYears(paymentHistory)
  
  // Hitung ringkasan untuk data cards
  const danaMandiriTotal = danaMandiriData.reduce((sum, payment) => {
    if (payment.status === "Lunas") {
      return sum + payment.amount
    }
    return sum
  }, 0)
  
  const ikataTotal = ikataData.reduce((sum, payment) => {
    if (payment.status === "Lunas") {
      return sum + payment.amount
    }
    return sum
  }, 0)
  
  // Handler untuk mengubah tahun yang dipilih
  const handleYearChange = (year?: number) => {
    setSelectedYear(year)
  }
  
  // Handler untuk mencari berdasarkan nama (hanya untuk SuperUser)
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }
  
  // Handler untuk mencetak PDF
  const handlePrintPdf = (type: "Dana Mandiri" | "IKATA") => {
    const yearLabel = selectedYear ? ` ${selectedYear}` : " semua tahun"
    toast.success(`Mencetak data ${type}${yearLabel}`)
  }
  
  // Handler untuk mengubah status pembayaran
  const handleStatusChange = (payment: PaymentHistory, newStatus: string, newPaymentDate: Date | null) => {
    const updatedData = paymentHistory.map((item) => {
      if (item.id === payment.id) {
        return {
          ...item,
          status: newStatus as PaymentStatus,
          paymentDate: newPaymentDate
        }
      }
      return item
    })
    
    setPaymentHistory(updatedData)
    toast.success("Status pembayaran berhasil diperbarui")
  }
  
  // Handler untuk menghapus pembayaran
  const handleDeletePayment = (payment: PaymentHistory) => {
    // Konfirmasi penghapusan
    const confirm = window.confirm(`Apakah Anda yakin ingin menghapus pembayaran ${payment.type} tahun ${payment.year}?`)
    
    if (confirm) {
      const updatedData = paymentHistory.filter(item => item.id !== payment.id)
      setPaymentHistory(updatedData)
      toast.success("Pembayaran berhasil dihapus")
    }
  }
  
  // Handler untuk export PDF
  const handleExportPdf = (payment: PaymentHistory) => {
    toast.success(`Ekspor PDF untuk ${payment.type} tahun ${payment.year}`)
  }
  
  // Jika masih loading, tampilkan pesan loading
  if (isLoading) {
    return <div className="text-center py-6">Memuat data...</div>
  }

  return (
    <div className="space-y-6 p-2">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold hidden md:block">Histori Pembayaran</h2>
      </div>
      
      {/* Summary Cards */}
      <SummaryCards
        danaMandiriTotal={danaMandiriTotal}
        danaMandiriCount={danaMandiriData.filter(payment => payment.status === "Lunas").length}
        ikataTotal={ikataTotal}
        ikataCount={ikataData.filter(payment => payment.status === "Lunas").length}
      />
      
      {/* Tabs */}
      <Tabs defaultValue="dana-mandiri" className="w-full">
        <TabsList>
          <TabsTrigger value="dana-mandiri">Dana Mandiri</TabsTrigger>
          <TabsTrigger value="ikata">IKATA</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dana-mandiri" className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2 items-center">
              <YearFilter 
                availableYears={availableYears} 
                selectedYear={selectedYear}
                onChange={handleYearChange}
              />
              
              {/* Search input (hanya untuk SuperUser) */}
              {isSuperUser && (
                <div className="relative w-full md:w-64">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari nama umat..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      className="absolute right-0 top-0 h-9 w-9 p-0"
                      onClick={() => setSearchTerm("")}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Clear search</span>
                    </Button>
                  )}
                </div>
              )}
            </div>
            
            <Button 
              variant="outline"
              onClick={() => handlePrintPdf("Dana Mandiri")}
            >
              Print PDF
            </Button>
          </div>
          <div className="rounded-md border">
            <PaymentHistoryTable 
              data={danaMandiriData} 
              showUserColumn={isSuperUser}
              onStatusChange={handleStatusChange}
              onDelete={handleDeletePayment}
              onExport={handleExportPdf}
            />
          </div>
        </TabsContent>

        <TabsContent value="ikata" className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2 items-center">
              <YearFilter 
                availableYears={availableYears} 
                selectedYear={selectedYear}
                onChange={handleYearChange}
              />
              
              {/* Search input (hanya untuk SuperUser) */}
              {isSuperUser && (
                <div className="relative w-full md:w-64">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari nama umat..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      className="absolute right-0 top-0 h-9 w-9 p-0"
                      onClick={() => setSearchTerm("")}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Clear search</span>
                    </Button>
                  )}
                </div>
              )}
            </div>
            
            <Button 
              variant="outline"
              onClick={() => handlePrintPdf("IKATA")}
            >
              Print PDF
            </Button>
          </div>
          <div className="rounded-md border">
            <PaymentHistoryTable 
              data={ikataData} 
              showUserColumn={isSuperUser}
              onStatusChange={handleStatusChange}
              onDelete={handleDeletePayment}
              onExport={handleExportPdf}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 