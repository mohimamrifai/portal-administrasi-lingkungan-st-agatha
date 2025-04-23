"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { DelinquentPayment } from "./types"
import { Search, Bell, Plus } from "lucide-react"
import { SetIuranDialog } from "./components/set-iuran-dialog"
import { SendNotificationDialog } from "./components/send-notification-dialog"

// Mock data - replace with actual API call
const mockData: DelinquentPayment[] = [
  {
    id: "1",
    kepalaKeluarga: "Budi Santoso",
    periodeAwal: "2024-01",
    periodeAkhir: "2024-03",
    jumlahTunggakan: 150000,
    status: "belum_lunas",
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01"
  },
  {
    id: "2",
    kepalaKeluarga: "Ani Wijaya",
    periodeAwal: "2024-02",
    periodeAkhir: "2024-03",
    jumlahTunggakan: 100000,
    status: "belum_lunas",
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01"
  }
]

export default function MonitoringPenunggakPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPayment, setSelectedPayment] = useState<DelinquentPayment | null>(null)
  const [showSetIuranDialog, setShowSetIuranDialog] = useState(false)
  const [showNotificationDialog, setShowNotificationDialog] = useState(false)

  const filteredData = mockData.filter(payment =>
    payment.kepalaKeluarga.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSetIuran = (payment: DelinquentPayment) => {
    setSelectedPayment(payment)
    setShowSetIuranDialog(true)
  }

  const handleSendNotification = () => {
    setShowNotificationDialog(true)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR"
    }).format(amount)
  }

  const formatPeriod = (awal: string, akhir: string) => {
    const formatDate = (dateStr: string) => {
      const [year, month] = dateStr.split("-")
      return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric"
      })
    }
    return `${formatDate(awal)} - ${formatDate(akhir)}`
  }

  return (
    <div className="container mx-auto py-6 space-y-6 px-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Monitoring Penunggak</h1>
        <Button onClick={handleSendNotification}>
          <Bell className="mr-2 h-4 w-4" />
          Kirim Notifikasi
        </Button>
      </div>

      <div className="flex justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama kepala keluarga"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Kepala Keluarga</TableHead>
              <TableHead>Periode Tunggakan</TableHead>
              <TableHead>Jumlah Tunggakan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.kepalaKeluarga}</TableCell>
                <TableCell>{formatPeriod(payment.periodeAwal, payment.periodeAkhir)}</TableCell>
                <TableCell>{formatCurrency(payment.jumlahTunggakan)}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    payment.status === "belum_lunas" 
                      ? "bg-red-100 text-red-800" 
                      : "bg-green-100 text-green-800"
                  }`}>
                    {payment.status === "belum_lunas" ? "Belum Lunas" : "Lunas"}
                  </span>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleSetIuran(payment)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Set Iuran
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {showSetIuranDialog && selectedPayment && (
        <SetIuranDialog
          payment={selectedPayment}
          open={showSetIuranDialog}
          onOpenChange={setShowSetIuranDialog}
        />
      )}

      {showNotificationDialog && (
        <SendNotificationDialog
          open={showNotificationDialog}
          onOpenChange={setShowNotificationDialog}
          delinquentPayments={filteredData}
        />
      )}
    </div>
  )
} 