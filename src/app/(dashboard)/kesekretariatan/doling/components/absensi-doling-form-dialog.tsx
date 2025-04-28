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
import { Switch } from "@/components/ui/switch"
import { AbsensiDoling } from "../types"

interface AbsensiDolingFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  absensi?: AbsensiDoling
  onSubmit: (values: Omit<AbsensiDoling, 'id' | 'createdAt' | 'updatedAt'>) => void
}

export function AbsensiDolingFormDialog({
  open,
  onOpenChange,
  absensi,
  onSubmit,
}: AbsensiDolingFormDialogProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    onSubmit({
      nama: formData.get('nama') as string,
      kepalaKeluarga: formData.get('kepalaKeluarga') === 'true',
      kehadiran: formData.get('kehadiran') as AbsensiDoling['kehadiran'],
      keterangan: formData.get('keterangan') as string,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[550px] w-full mx-auto">
        <DialogHeader>
          <DialogTitle>
            {absensi ? 'Edit Absensi' : 'Tambah Absensi'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nama">Nama</Label>
            <Input
              id="nama"
              name="nama"
              defaultValue={absensi?.nama}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="kepalaKeluarga">Kepala Keluarga</Label>
            <Switch
              id="kepalaKeluarga"
              name="kepalaKeluarga"
              defaultChecked={absensi?.kepalaKeluarga}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="kehadiran">Kehadiran</Label>
            <Select name="kehadiran" defaultValue={absensi?.kehadiran}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kehadiran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hadir">Hadir</SelectItem>
                <SelectItem value="tidak-hadir">Tidak Hadir</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="keterangan">Keterangan</Label>
            <Input
              id="keterangan"
              name="keterangan"
              defaultValue={absensi?.keterangan}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit">
              {absensi ? 'Simpan Perubahan' : 'Tambah'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 