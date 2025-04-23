"use client";

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DetilDoling } from "../types"
import { format } from "date-fns"

interface DetilDolingFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  detil?: DetilDoling
  onSubmit: (values: Omit<DetilDoling, 'id' | 'createdAt' | 'updatedAt'>) => void
}

export function DetilDolingFormDialog({
  open,
  onOpenChange,
  detil,
  onSubmit,
}: DetilDolingFormDialogProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    onSubmit({
      tanggal: new Date(formData.get('tanggal') as string),
      tuanRumah: formData.get('tuanRumah') as string,
      jumlahHadir: parseInt(formData.get('jumlahHadir') as string),
      kegiatan: formData.get('kegiatan') as string,
      status: formData.get('status') as DetilDoling['status'],
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {detil ? 'Edit Detil Doling' : 'Tambah Detil Doling'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tanggal">Tanggal</Label>
            <Input
              id="tanggal"
              name="tanggal"
              type="date"
              defaultValue={detil ? format(detil.tanggal, 'yyyy-MM-dd') : undefined}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tuanRumah">Tuan Rumah</Label>
            <Input
              id="tuanRumah"
              name="tuanRumah"
              defaultValue={detil?.tuanRumah}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jumlahHadir">Jumlah Hadir</Label>
            <Input
              id="jumlahHadir"
              name="jumlahHadir"
              type="number"
              defaultValue={detil?.jumlahHadir}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="kegiatan">Kegiatan</Label>
            <Input
              id="kegiatan"
              name="kegiatan"
              defaultValue={detil?.kegiatan}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue={detil?.status}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="selesai">Selesai</SelectItem>
                <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit">
              {detil ? 'Simpan Perubahan' : 'Tambah'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 