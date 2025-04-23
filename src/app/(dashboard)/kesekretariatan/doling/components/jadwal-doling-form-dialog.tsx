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
import { JadwalDoling } from "../types"
import { format } from "date-fns"
import { id } from "date-fns/locale"

interface JadwalDolingFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  jadwal?: JadwalDoling
  onSubmit: (values: Omit<JadwalDoling, 'id' | 'createdAt' | 'updatedAt'>) => void
}

export function JadwalDolingFormDialog({
  open,
  onOpenChange,
  jadwal,
  onSubmit,
}: JadwalDolingFormDialogProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    onSubmit({
      tanggal: new Date(formData.get('tanggal') as string),
      waktu: formData.get('waktu') as string,
      tuanRumah: formData.get('tuanRumah') as string,
      alamat: formData.get('alamat') as string,
      status: formData.get('status') as JadwalDoling['status'],
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {jadwal ? 'Edit Jadwal Doling' : 'Tambah Jadwal Doling'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tanggal">Tanggal</Label>
            <Input
              id="tanggal"
              name="tanggal"
              type="date"
              defaultValue={jadwal ? format(jadwal.tanggal, 'yyyy-MM-dd') : undefined}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="waktu">Waktu</Label>
            <Input
              id="waktu"
              name="waktu"
              type="time"
              defaultValue={jadwal?.waktu}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tuanRumah">Tuan Rumah</Label>
            <Input
              id="tuanRumah"
              name="tuanRumah"
              defaultValue={jadwal?.tuanRumah}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="alamat">Alamat</Label>
            <Input
              id="alamat"
              name="alamat"
              defaultValue={jadwal?.alamat}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue={jadwal?.status}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="terjadwal">Terjadwal</SelectItem>
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
              {jadwal ? 'Simpan Perubahan' : 'Tambah'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 