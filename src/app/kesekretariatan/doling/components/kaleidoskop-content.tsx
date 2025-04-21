"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { KaleidoskopData } from "../types"

interface KaleidoskopContentProps {
  data: KaleidoskopData
}

export function KaleidoskopContent({ data }: KaleidoskopContentProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Kegiatan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{data.totalKegiatan}</div>
          <p className="text-sm text-muted-foreground">Kegiatan dalam setahun</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Rata-rata Kehadiran</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{data.rataRataKehadiran}%</div>
          <p className="text-sm text-muted-foreground">Kehadiran rata-rata per kegiatan</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total KK Aktif</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{data.totalKKAktif}</div>
          <p className="text-sm text-muted-foreground">Kepala Keluarga yang aktif</p>
        </CardContent>
      </Card>
    </div>
  )
} 