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
import { DetilDoling, JadwalDoling } from "../types"
import { format } from "date-fns"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { id } from "date-fns/locale"

interface DetilDolingFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  detil?: DetilDoling
  onSubmit: (values: Omit<DetilDoling, 'id' | 'createdAt' | 'updatedAt'>) => void
  jadwalDoling: JadwalDoling[]
}

export function DetilDolingFormDialog({
  open,
  onOpenChange,
  detil,
  onSubmit,
  jadwalDoling,
}: DetilDolingFormDialogProps) {
  const [selectedJadwal, setSelectedJadwal] = useState<string>(detil?.jadwalId?.toString() || "manual")
  const [tanggalValue, setTanggalValue] = useState<string>(detil ? format(detil.tanggal, 'yyyy-MM-dd') : "")
  const [tuanRumahValue, setTuanRumahValue] = useState<string>(detil?.tuanRumah || "")
  const [biayaValue, setBiayaValue] = useState<string>(detil?.biaya?.toString() || "0")
  const [koleksiValue, setKoleksiValue] = useState<string>(detil?.koleksi?.toString() || "0")
  
  useEffect(() => {
    if (selectedJadwal && jadwalDoling.length > 0) {
      const jadwal = jadwalDoling.find(j => j.id.toString() === selectedJadwal);
      if (jadwal) {
        setTanggalValue(format(jadwal.tanggal, 'yyyy-MM-dd'));
        setTuanRumahValue(jadwal.tuanRumah);
      }
    }
  }, [selectedJadwal, jadwalDoling]);
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    onSubmit({
      jadwalId: selectedJadwal && selectedJadwal !== "manual" ? parseInt(selectedJadwal) : undefined,
      tanggal: new Date(formData.get('tanggal') as string),
      tuanRumah: formData.get('tuanRumah') as string,
      jumlahHadir: parseInt(formData.get('jumlahHadir') as string),
      kegiatan: formData.get('kegiatan') as string,
      biaya: parseFloat(formData.get('biaya') as string) || 0,
      koleksi: parseFloat(formData.get('koleksi') as string) || 0,
      keterangan: formData.get('keterangan') as string || "",
      status: formData.get('status') as DetilDoling['status'],
      sudahDiapprove: false,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[550px] w-full mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {detil ? 'Edit Detil Doling' : 'Tambah Detil Doling'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="jadwalId">Pilih Jadwal Doling</Label>
              <Select 
                value={selectedJadwal} 
                onValueChange={setSelectedJadwal}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jadwal doa lingkungan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Input Manual</SelectItem>
                  {jadwalDoling
                    .filter(j => j.status === 'terjadwal')
                    .map((jadwal) => (
                      <SelectItem key={jadwal.id} value={jadwal.id.toString()}>
                        {format(jadwal.tanggal, "dd MMM yyyy", { locale: id })} - {jadwal.tuanRumah}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tanggal">Tanggal</Label>
              <Input
                id="tanggal"
                name="tanggal"
                type="date"
                value={tanggalValue}
                onChange={(e) => setTanggalValue(e.target.value)}
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
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="tuanRumah">Tuan Rumah</Label>
              <Input
                id="tuanRumah"
                name="tuanRumah"
                value={tuanRumahValue}
                onChange={(e) => setTuanRumahValue(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="kegiatan">Kegiatan</Label>
              <Input
                id="kegiatan"
                name="kegiatan"
                defaultValue={detil?.kegiatan}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="biaya">Biaya Kegiatan (Rp)</Label>
              <Input
                id="biaya"
                name="biaya"
                type="number"
                value={biayaValue}
                onChange={(e) => setBiayaValue(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="koleksi">Koleksi/Persembahan (Rp)</Label>
              <Input
                id="koleksi"
                name="koleksi"
                type="number"
                value={koleksiValue}
                onChange={(e) => setKoleksiValue(e.target.value)}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="keterangan">Keterangan</Label>
              <Textarea
                id="keterangan"
                name="keterangan"
                defaultValue={detil?.keterangan || ""}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={detil?.status || "selesai"}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="selesai">Selesai</SelectItem>
                  <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
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