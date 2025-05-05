"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { StatusIuran } from "@prisma/client"
import { setIuranIkata } from "../utils/monitoring-service"
import { DelinquentPayment } from "../types"

interface SetIuranDialogProps {
  payment: DelinquentPayment
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SetIuranDialog({ payment, open, onOpenChange }: SetIuranDialogProps) {
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Masukkan jumlah iuran yang valid")
      return
    }

    setIsLoading(true)
    
    try {
      // Dapatkan tahun dari periode
      const tahun = parseInt(payment.periodeAwal.split('-')[0])
      
      // Konversi status aplikasi ke StatusIuran enum Prisma
      const statusIuran: StatusIuran = 
        payment.status === 'belum_lunas' 
          ? StatusIuran.LUNAS 
          : StatusIuran.LUNAS
      
      // Panggil server action
      await setIuranIkata(
        payment.keluargaId,
        tahun,
        parseFloat(amount),
        statusIuran
      )
      
      toast.success(`Iuran untuk ${payment.kepalaKeluarga} berhasil diupdate`)
      onOpenChange(false)
    } catch (error) {
      console.error("Error setting iuran:", error)
      toast.error("Gagal mengatur iuran. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Iuran IKATA</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Nama Kepala Keluarga</Label>
            <Input value={payment.kepalaKeluarga} disabled />
          </div>
          <div className="space-y-2">
            <Label>Periode</Label>
            <Input 
              value={`${payment.periodeAwal} - ${payment.periodeAkhir}`} 
              disabled 
            />
          </div>
          <div className="space-y-2">
            <Label>Jumlah Iuran</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Masukkan jumlah iuran"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Batal
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 