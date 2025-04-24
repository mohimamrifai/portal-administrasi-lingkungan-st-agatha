import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Publikasi } from "../types/publikasi"

interface SummaryCardsProps {
  data: Publikasi[]
}

export function SummaryCards({ data }: SummaryCardsProps) {
  // Hitung total publikasi bulan ini
  const today = new Date()
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  
  const publikasiBulanIni = data.filter(item => {
    const tanggal = new Date(item.tanggal)
    return tanggal >= firstDayOfMonth && tanggal <= lastDayOfMonth
  })
  
  // Hitung publikasi aktif
  const publikasiAktif = data.filter(item => item.status === "aktif")
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="gap-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Publikasi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{publikasiBulanIni.length}</div>
          <p className="text-xs text-muted-foreground">Bulan ini</p>
        </CardContent>
      </Card>
      <Card className="gap-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Publikasi Aktif</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{publikasiAktif.length}</div>
          <p className="text-xs text-muted-foreground">Belum melewati deadline</p>
        </CardContent>
      </Card>
    </div>
  )
} 