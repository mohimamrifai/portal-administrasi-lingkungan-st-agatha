"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { DelinquentPayment } from "../types"

interface SendNotificationDialogProps {
  delinquentPayments: DelinquentPayment[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SendNotificationDialog({ 
  delinquentPayments, 
  open, 
  onOpenChange 
}: SendNotificationDialogProps) {
  const [message, setMessage] = useState("")

  const handleSend = () => {
    // TODO: Implement API call to send notifications
    toast.success("Notifikasi pengingat berhasil dikirim")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Kirim Notifikasi Pengingat</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Jumlah penerima: {delinquentPayments.length} kepala keluarga
            </p>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tulis pesan notifikasi..."
              className="min-h-[100px]"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button onClick={handleSend}>
              Kirim
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 