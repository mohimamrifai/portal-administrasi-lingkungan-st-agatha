"use client"

import { useState } from "react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ApprovalItem } from "../types"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface ConfirmationDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedItem: ApprovalItem | null
  confirmAction: 'approve' | 'reject' | null
  onConfirm: (reason?: string, message?: string) => void
  isLoading: boolean
}

export function ConfirmationDialog({
  isOpen,
  onOpenChange,
  selectedItem,
  confirmAction,
  onConfirm,
  isLoading,
}: ConfirmationDialogProps) {
  const [rejectionReason, setRejectionReason] = useState<string>("")
  const [message, setMessage] = useState<string>("")

  const handleConfirm = () => {
    onConfirm(
      confirmAction === 'reject' ? rejectionReason : undefined,
      message || undefined
    )
  }

  // Reset reason when dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setRejectionReason("")
      setMessage("")
    }
    if (!isLoading) {
      onOpenChange(open)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {confirmAction === 'approve' ? 'Konfirmasi Persetujuan' : 'Konfirmasi Penolakan'}
          </DialogTitle>
          <DialogDescription>
            {confirmAction === 'approve'
              ? 'Anda yakin ingin menyetujui permohonan ini? Data akan diintegrasikan ke Kas Lingkungan.'
              : 'Anda yakin ingin menolak permohonan ini?'}
          </DialogDescription>
        </DialogHeader>
        
        {selectedItem && (
          <div className="py-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="font-semibold">Tanggal:</div>
              <div>{format(selectedItem.tanggal, "dd/MM/yyyy", { locale: id })}</div>
              
              <div className="font-semibold">Tuan Rumah:</div>
              <div>{selectedItem.tuanRumah}</div>
              
              <div className="font-semibold">Jumlah Hadir:</div>
              <div>{selectedItem.jumlahHadir} orang</div>
              
              <div className="font-semibold">Biaya:</div>
              <div>Rp {selectedItem.biaya.toLocaleString('id-ID')}</div>
            </div>
            
            {confirmAction === 'reject' && (
              <div className="mt-4">
                <Label htmlFor="rejection-reason" className="font-semibold mb-2">Alasan Penolakan:</Label>
                <Textarea
                  id="rejection-reason"
                  className="w-full"
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Masukkan alasan penolakan..."
                />
              </div>
            )}

            <div className="mt-4">
              <Label htmlFor="message" className="font-semibold mb-2">Pesan (opsional):</Label>
              <Textarea
                id="message"
                className="w-full"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tambahkan pesan atau catatan (opsional)..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                Pesan ini akan dapat dilihat oleh pengurus lingkungan
              </p>
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Batal
          </Button>
          <Button 
            variant={confirmAction === 'approve' ? 'default' : 'destructive'}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading 
              ? 'Memproses...' 
              : confirmAction === 'approve' 
                ? 'Setujui' 
                : 'Tolak'
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 