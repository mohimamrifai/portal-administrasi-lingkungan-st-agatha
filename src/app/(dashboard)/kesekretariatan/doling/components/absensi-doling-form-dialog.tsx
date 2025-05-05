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
import { AbsensiDoling, DetilDoling, JadwalDoling } from "../types"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { id } from "date-fns/locale"

interface AbsensiDolingFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  absensi?: AbsensiDoling
  onSubmit: (values: { doaLingkunganId: string, absensiData: { keluargaId: string, hadir: boolean }[] }) => void
  detilDoling?: DetilDoling[]
  jadwalDoling?: JadwalDoling[]
}

export function AbsensiDolingFormDialog({
  open,
  onOpenChange,
  absensi,
  onSubmit,
  detilDoling = [],
  jadwalDoling = [],
}: AbsensiDolingFormDialogProps) {
  const [selectedDolingId, setSelectedDolingId] = useState<string>(absensi?.doaLingkunganId || "");
  const [keluargaId, setKeluargaId] = useState<string>(absensi?.keluargaId || "");
  const [hadir, setHadir] = useState<boolean>(absensi?.hadir || false);
  
  // Filter jadwal yang sudah selesai atau terjadwal
  const availableJadwal = jadwalDoling.filter(jadwal => 
    jadwal.status === 'selesai' || jadwal.status === 'terjadwal' || jadwal.status === 'menunggu'
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedDolingId) {
      toast.error("Silakan pilih jadwal doa lingkungan terlebih dahulu.");
      return;
    }
    
    if (!keluargaId) {
      toast.error("Silakan isi ID keluarga terlebih dahulu.");
      return;
    }
    
    onSubmit({
      doaLingkunganId: selectedDolingId,
      absensiData: [
        {
          keluargaId: keluargaId,
          hadir: hadir
        }
      ]
    });
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
          {/* Jadwal Doling */}
          <div className="space-y-2">
            <Label htmlFor="doaLingkunganId">Jadwal Doa Lingkungan</Label>
            <Select 
              name="doaLingkunganId" 
              value={selectedDolingId} 
              onValueChange={setSelectedDolingId}
              disabled={Boolean(absensi)} // Disable jika edit mode
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jadwal doling" />
              </SelectTrigger>
              <SelectContent>
                {availableJadwal.length > 0 ? (
                  availableJadwal.map((jadwal) => (
                    <SelectItem key={jadwal.id} value={jadwal.id}>
                      {jadwal.tanggal && jadwal.tanggal instanceof Date && !isNaN(new Date(jadwal.tanggal).getTime())
                        ? format(new Date(jadwal.tanggal), "dd MMM yyyy", { locale: id })
                        : "Tanggal tidak valid"} - {jadwal.tuanRumah}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    Tidak ada jadwal doling tersedia
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="keluargaId">ID Keluarga</Label>
            <Input
              id="keluargaId"
              name="keluargaId"
              value={keluargaId}
              onChange={(e) => setKeluargaId(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="hadir">Kehadiran</Label>
              <Switch
                id="hadir"
                name="hadir"
                checked={hadir}
                onCheckedChange={setHadir}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {hadir ? "Hadir" : "Tidak Hadir"}
            </p>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit">
              {absensi ? 'Simpan Perubahan' : 'Tambah Absensi'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 