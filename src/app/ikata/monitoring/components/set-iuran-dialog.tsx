"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { DelinquentPayment } from "../types"

interface SetIuranDialogProps {
  payment: DelinquentPayment
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SetIuranDialog({ payment, open, onOpenChange }: SetIuranDialogProps) {
  const [amount, setAmount] = useState("")

  const handleSubmit = () => {
    // TODO: Implement API call to update payment
    toast.success(`Iuran untuk ${payment.kepalaKeluarga} berhasil diupdate`)
    onOpenChange(false)
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
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button onClick={handleSubmit}>
              Simpan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 