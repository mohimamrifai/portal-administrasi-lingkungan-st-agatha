"use client";

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { AbsensiDoling, DetilDoling } from "../types"
import { toast } from "sonner"
import { useState, useEffect } from "react"

interface AbsensiDolingFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  absensi?: AbsensiDoling
  onSubmit: (values: Omit<AbsensiDoling, 'id' | 'createdAt' | 'updatedAt'>) => void
  detilDoling?: DetilDoling[]
}

export function AbsensiDolingFormDialog({
  open,
  onOpenChange,
  absensi,
  onSubmit,
  detilDoling = [],
}: AbsensiDolingFormDialogProps) {
  const [formDisabled, setFormDisabled] = useState(false);
  
  useEffect(() => {
    if (detilDoling.length > 0) {
      const latestDetil = [...detilDoling].sort((a, b) => 
        b.tanggal.getTime() - a.tanggal.getTime()
      )[0];
      
      if (latestDetil && (latestDetil.jenisIbadat === "bakti-sosial" || latestDetil.jenisIbadat === "kegiatan-lainnya")) {
        setFormDisabled(true);
        
        if (open) {
          toast.info("Absensi dinonaktifkan untuk jenis ibadat Bakti Sosial atau Kegiatan Lainnya.");
        }
      } else {
        setFormDisabled(false);
      }
    }
  }, [detilDoling, open]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (formDisabled) {
      toast.error("Form absensi dinonaktifkan untuk jenis ibadat ini.");
      return;
    }
    
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
          {formDisabled && (
            <DialogDescription className="text-orange-500">
              Perhatian: Form absensi dinonaktifkan untuk jenis ibadat Bakti Sosial atau Kegiatan Lainnya.
            </DialogDescription>
          )}
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nama">Nama</Label>
            <Input
              id="nama"
              name="nama"
              defaultValue={absensi?.nama}
              required
              disabled={formDisabled}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="kepalaKeluarga">Kepala Keluarga</Label>
              <Switch
                id="kepalaKeluarga"
                name="kepalaKeluarga"
                defaultChecked={absensi?.kepalaKeluarga}
                disabled={formDisabled}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="kehadiran">Kehadiran</Label>
            <Select name="kehadiran" defaultValue={absensi?.kehadiran} disabled={formDisabled}>
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
              disabled={formDisabled}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={formDisabled}>
              {absensi ? 'Simpan Perubahan' : 'Tambah'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 