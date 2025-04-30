"use client"

import * as React from "react"
import { useState } from "react"
import { DateRange } from "react-day-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus, PlusCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import BuatPublikasi from "./buat-publikasi"
import { dummyPublikasi } from "../utils/data"
import { SummaryCards } from "./summary-cards"
import { PublikasiTable } from "./publikasi-table"
import { SearchInput } from "./search-input"
import { StatusFilter } from "./status-filter"
import { KategoriFilter } from "./kategori-filter"
import { PeriodFilter } from "./period-filter"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import BuatLaporanDialog from "./buat-laporan-dialog"
import BuatPublikasiDialog from "./buat-publikasi-dialog"
import { useAuth } from "@/contexts/auth-context"

export default function PublikasiContent() {
  const { userRole } = useAuth()
  const [activeTab, setActiveTab] = useState("pengumuman")
  const [data] = useState(dummyPublikasi)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [kategoriFilter, setKategoriFilter] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  
  // Cek apakah pengguna memiliki akses untuk membuat publikasi
  const canCreatePublication = [
    'SuperUser', 
    'sekretaris', 
    'wakilSekretaris'
  ].includes(userRole)
  
  // Setup table
  const filteredData = React.useMemo(() => {
    let filtered = [...data]
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.judul.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter(item => item.status === statusFilter)
    }
    
    // Filter by kategori
    if (kategoriFilter) {
      filtered = filtered.filter(item => item.kategori === kategoriFilter)
    }
    
    // Filter by date range
    if (dateRange?.from) {
      const fromDate = new Date(dateRange.from)
      fromDate.setHours(0, 0, 0, 0)
      
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.tanggal)
        if (dateRange.to) {
          const toDate = new Date(dateRange.to)
          toDate.setHours(23, 59, 59, 999)
          return itemDate >= fromDate && itemDate <= toDate
        }
        return itemDate >= fromDate
      })
    }
    
    return filtered
  }, [data, searchTerm, statusFilter, kategoriFilter, dateRange])
  
  // Reset all filters
  const resetAllFilters = () => {
    setSearchTerm("")
    setStatusFilter(null)
    setKategoriFilter(null)
    setDateRange(undefined)
  }

  return (
    <div className="space-y-6 p-2">
      {/* Summary Cards */}
      <SummaryCards data={data} />

      {/* Tabs */}
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-4 bg-muted/60">
          <TabsTrigger value="pengumuman">Pengumuman</TabsTrigger>
          {canCreatePublication && (
            <TabsTrigger 
              value="buat-publikasi" 
              className="flex items-center"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Buat Publikasi
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="pengumuman" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Pengumuman</CardTitle>
              <CardDescription>
                Kelola semua pengumuman yang tersedia dalam sistem
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters Section - Ditata ulang agar benar-benar sejajar */}
              <div className="flex flex-wrap gap-4 items-center mb-4">
                <div className="inline-flex">
                  <SearchInput 
                    table={{
                      getColumn: () => ({
                        setFilterValue: () => {},
                      }),
                    } as any} 
                    searchTerm={searchTerm} 
                    setSearchTerm={setSearchTerm}
                    placeholder="Cari pengumuman..."
                  />
                </div>
                
                <div className="inline-flex">
                  <StatusFilter 
                    table={{
                      getColumn: () => ({
                        setFilterValue: () => {},
                      }),
                    } as any} 
                    statusFilter={statusFilter} 
                    setStatusFilter={setStatusFilter} 
                  />
                </div>
                
                <div className="inline-flex">
                  <KategoriFilter 
                    table={{
                      getColumn: () => ({
                        setFilterValue: () => {},
                      }),
                    } as any} 
                    kategoriFilter={kategoriFilter} 
                    setKategoriFilter={setKategoriFilter} 
                  />
                </div>
                
                <div className="inline-flex">
                  <PeriodFilter 
                    dateRange={dateRange} 
                    setDateRange={setDateRange} 
                  />
                </div>
                
                <div className="flex flex-col md:flex-row gap-2 md:justify-end w-full">
                  <BuatLaporanDialog />
                </div>
              </div>

              {/* Active Filters Summary */}
              {(searchTerm || statusFilter || kategoriFilter || dateRange) && (
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
                  <span>Filter aktif:</span>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-auto h-7 text-xs"
                    onClick={resetAllFilters}
                  >
                    Reset Semua
                  </Button>
                </div>
              )}

              {/* Table Section */}
              <PublikasiTable data={filteredData} />
            </CardContent>
          </Card>
        </TabsContent>
        
        {canCreatePublication && (
          <TabsContent value="buat-publikasi" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Buat Publikasi Baru</CardTitle>
                <CardDescription>
                  Buat publikasi baru untuk disebarkan kepada umat
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BuatPublikasiDialog />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
} 