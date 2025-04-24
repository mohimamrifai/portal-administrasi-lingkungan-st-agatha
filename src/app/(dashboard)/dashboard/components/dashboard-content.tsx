"use client"

import * as React from "react"
import { useState } from "react"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"

// Import types
import { 
  KeuanganLingkunganSummary,
  KeuanganIkataSummary,
  KesekretariatanSummary,
  PenunggakDanaMandiri,
  PenunggakIkata
} from "../types"

// Import utilities
import {
  getMonthDateRange,
  generateKeuanganLingkunganData,
  generateKeuanganIkataData,
  generateKesekretariatanData,
  generatePenunggakDanaMandiriData,
  generatePenunggakIkataData
} from "../utils"

// Import components
import { PeriodFilter } from "./period-filter"
import { KeuanganLingkunganCards } from "./keuangan-lingkungan-cards"
import { KeuanganIkataCards } from "./keuangan-ikata-cards"
import { KesekretariatanCards } from "./kesekretariatan-cards"
import { PenunggakDanaMandiriTable } from "./penunggak-table"
import { PenunggakIkataTable } from "./penunggak-table"

export default function DashboardContent() {
  // Mengambil role pengguna dari konteks auth
  const { userRole } = useAuth()
  
  // Cek apakah user memiliki akses ke komponen tertentu
  // Asumsikan role yang dapat melihat data keuangan: PengurusLingkungan, BendaharaLingkungan, SuperUser
  // Asumsikan role yang dapat melihat data ikata: PengurusIKATA, BendaharaIKATA, SuperUser
  // Asumsikan role yang dapat melihat data kesekretariatan: SekretarisLingkungan, KetuaLingkungan, SuperUser
  const canViewKeuanganLingkungan = ["PengurusLingkungan", "BendaharaLingkungan", "KetuaLingkungan", "SuperUser"].includes(userRole)
  const canViewKeuanganIkata = ["PengurusIKATA", "BendaharaIKATA", "KetuaIKATA", "SuperUser"].includes(userRole)
  const canViewKesekretariatan = ["SekretarisLingkungan", "KetuaLingkungan", "SuperUser"].includes(userRole)
  
  // Umat biasa juga bisa melihat daftar penunggak
  const canViewPenunggak = ["Umat", "PengurusLingkungan", "BendaharaLingkungan", "KetuaLingkungan", "PengurusIKATA", "BendaharaIKATA", "KetuaIKATA", "SekretarisLingkungan", "SuperUser"].includes(userRole)
  
  // State untuk filter periode
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [dateRange, setDateRange] = useState<DateRange | undefined>(getMonthDateRange(currentMonth))
  
  // Generate data berdasarkan bulan yang dipilih
  const keuanganLingkunganData: KeuanganLingkunganSummary = generateKeuanganLingkunganData(currentMonth)
  const keuanganIkataData: KeuanganIkataSummary = generateKeuanganIkataData(currentMonth)
  const kesekretariatanData: KesekretariatanSummary = generateKesekretariatanData(currentMonth)
  
  // Data penunggak (tidak tergantung bulan)
  const penunggakDanaMandiri: PenunggakDanaMandiri[] = generatePenunggakDanaMandiriData()
  const penunggakIkata: PenunggakIkata[] = generatePenunggakIkataData()

  // Fungsi untuk mengubah bulan
  function handleMonthChange(date: DateRange | undefined) {
    if (date?.from) {
      setCurrentMonth(date.from)
      setDateRange(date)
    }
  }

  return (
    <div className="space-y-8 p-2">
      {/* Filter Periode */}
      <div className="w-full">
        <PeriodFilter 
          dateRange={dateRange} 
          onMonthChange={handleMonthChange} 
        />
      </div>
      
      {/* Resume Keuangan Lingkungan */}
      {canViewKeuanganLingkungan && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Resume Keuangan Lingkungan</h2>
          <KeuanganLingkunganCards data={keuanganLingkunganData} />
        </div>
      )}
      
      {/* Resume Keuangan IKATA */}
      {canViewKeuanganIkata && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Resume Keuangan IKATA</h2>
          <KeuanganIkataCards data={keuanganIkataData} />
        </div>
      )}
      
      {/* Resume Kesekretariatan */}
      {canViewKesekretariatan && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Resume Kesekretariatan</h2>
          <KesekretariatanCards data={kesekretariatanData} />
        </div>
      )}
      
      {/* Daftar Penunggak */}
      {canViewPenunggak && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Daftar Kepala Keluarga Penunggak</h2>
          
          <Tabs defaultValue="dana-mandiri" className="w-full">
            <div className="mb-4">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger 
                  value="dana-mandiri" 
                  className="flex-1 sm:flex-initial"
                >
                  Dana Mandiri
                </TabsTrigger>
                <TabsTrigger 
                  value="ikata" 
                  className="flex-1 sm:flex-initial"
                >
                  IKATA
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="dana-mandiri" className="mt-0">
              <PenunggakDanaMandiriTable data={penunggakDanaMandiri} />
            </TabsContent>
            
            <TabsContent value="ikata" className="mt-0">
              <PenunggakIkataTable data={penunggakIkata} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
} 