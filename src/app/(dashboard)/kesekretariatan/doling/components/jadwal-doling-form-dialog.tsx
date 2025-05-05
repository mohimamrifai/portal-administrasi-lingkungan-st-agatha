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
import { useEffect, useState } from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { JenisIbadat, SubIbadat } from "@prisma/client"
import { KeluargaForSelect } from "../actions"

// Fungsi untuk mendapatkan opsi sub ibadat yang sesuai berdasarkan jenis ibadat
const getSubIbadatOptions = (jenisIbadat: JenisIbadat) => {
  switch (jenisIbadat) {
    case JenisIbadat.DOA_LINGKUNGAN:
      return [
        SubIbadat.IBADAT_SABDA,
        SubIbadat.IBADAT_SABDA_TEMATIK,
        SubIbadat.PRAPASKAH,
        SubIbadat.BKSN,
        SubIbadat.BULAN_ROSARIO,
        SubIbadat.NOVENA_NATAL
      ];
    case JenisIbadat.MISA:
      return [
        SubIbadat.MISA_SYUKUR,
        SubIbadat.MISA_REQUEM,
        SubIbadat.MISA_ARWAH,
        SubIbadat.MISA_PELINDUNG
      ];
    default:
      return [];
  }
};

// Mapping untuk menampilkan sub ibadat dalam bahasa yang lebih mudah dibaca
const subIbadatMap: Record<SubIbadat, string> = {
  [SubIbadat.IBADAT_SABDA]: "Ibadat Sabda",
  [SubIbadat.IBADAT_SABDA_TEMATIK]: "Ibadat Sabda Tematik",
  [SubIbadat.PRAPASKAH]: "Prapaskah (APP)",
  [SubIbadat.BKSN]: "BKSN",
  [SubIbadat.BULAN_ROSARIO]: "Bulan Rosario",
  [SubIbadat.NOVENA_NATAL]: "Novena Natal",
  [SubIbadat.MISA_SYUKUR]: "Misa Syukur",
  [SubIbadat.MISA_REQUEM]: "Misa Requem",
  [SubIbadat.MISA_ARWAH]: "Misa Arwah",
  [SubIbadat.MISA_PELINDUNG]: "Misa Pelindung"
};

interface JadwalDolingFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jadwal?: JadwalDoling;
  kepalaKeluarga: KeluargaForSelect[];
  onSubmit: (values: {
    tanggal: Date;
    tuanRumahId: string;
    jenisIbadat: JenisIbadat;
    subIbadat?: SubIbadat | null;
    temaIbadat?: string | null;
  }) => void;
}

export function JadwalDolingFormDialog({
  open,
  onOpenChange,
  jadwal,
  onSubmit,
  kepalaKeluarga
}: JadwalDolingFormDialogProps) {
  const [selectedFamilyHead, setSelectedFamilyHead] = useState<string>(jadwal?.tuanRumahId || "");
  const [alamat, setAlamat] = useState<string>(jadwal?.alamat || "");
  const [tuanRumah, setTuanRumah] = useState<string>(jadwal?.tuanRumah || "");
  const [manualInput, setManualInput] = useState<boolean>(false);
  const [jenisIbadat, setJenisIbadat] = useState<JenisIbadat>(jadwal?.jenisIbadat || JenisIbadat.DOA_LINGKUNGAN);
  const [subIbadat, setSubIbadat] = useState<SubIbadat | null>(jadwal?.subIbadat || null);
  const [temaIbadat, setTemaIbadat] = useState<string | null>(jadwal?.temaIbadat || null);
  const [openCombobox, setOpenCombobox] = useState(false);

  // Update alamat when family head is selected
  useEffect(() => {
    if (selectedFamilyHead && !manualInput) {
      const family = kepalaKeluarga.find(f => f.id === selectedFamilyHead);
      if (family) {
        setAlamat(family.alamat);
        setTuanRumah(family.nama);
      }
    }
  }, [selectedFamilyHead, manualInput, kepalaKeluarga]);

  // Mengatur ulang sub ibadat saat jenis ibadat berubah
  useEffect(() => {
    setSubIbadat(null);
  }, [jenisIbadat]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    onSubmit({
      tanggal: new Date(e.currentTarget.tanggal.value),
      tuanRumahId: selectedFamilyHead,
      jenisIbadat,
      subIbadat,
      temaIbadat
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[550px] lg:max-w-[600px] w-full mx-auto">
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
              type="datetime-local"
              defaultValue={jadwal ? format(new Date(jadwal.tanggal), 'yyyy-MM-dd\'T\'HH:mm') : undefined}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="jenisIbadat">Jenis Ibadat</Label>
            <Select 
              value={jenisIbadat}
              onValueChange={(value) => setJenisIbadat(value as JenisIbadat)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Jenis Ibadat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={JenisIbadat.DOA_LINGKUNGAN}>Doa Lingkungan</SelectItem>
                <SelectItem value={JenisIbadat.MISA}>Misa</SelectItem>
                <SelectItem value={JenisIbadat.PERTEMUAN}>Pertemuan</SelectItem>
                <SelectItem value={JenisIbadat.BAKTI_SOSIAL}>Bakti Sosial</SelectItem>
                <SelectItem value={JenisIbadat.KEGIATAN_LAIN}>Kegiatan Lain</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subIbadat">Sub Ibadat (Opsional)</Label>
            <Select 
              value={subIbadat ? subIbadat : "NONE"} 
              onValueChange={(value) => setSubIbadat(value === "NONE" ? null : value as SubIbadat)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Sub Ibadat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NONE">Tidak Ada</SelectItem>
                {getSubIbadatOptions(jenisIbadat).map((subIbadat) => (
                  <SelectItem key={subIbadat} value={subIbadat}>
                    {subIbadatMap[subIbadat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="temaIbadat">Tema Ibadat (Opsional)</Label>
            <Input
              id="temaIbadat"
              value={temaIbadat || ""}
              onChange={(e) => setTemaIbadat(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="tuanRumahSelection">Tuan Rumah</Label>
            </div>
            
            <div className="relative">
              <input type="hidden" name="tuanRumahId" value={selectedFamilyHead} />
              <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCombobox}
                    className="w-full justify-between"
                  >
                    {selectedFamilyHead
                      ? kepalaKeluarga.find((head) => head.id === selectedFamilyHead)?.nama || "Pilih Tuan Rumah..."
                      : "Pilih Tuan Rumah..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Cari Tuan Rumah..." />
                    <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                    <CommandGroup className="max-h-60 overflow-y-auto">
                      {kepalaKeluarga.map((head) => (
                        <CommandItem
                          key={head.id}
                          value={head.nama}
                          onSelect={() => {
                            setSelectedFamilyHead(head.id);
                            setOpenCombobox(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedFamilyHead === head.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {head.nama} {head.sudahTerpilih && <span className="ml-2 text-xs text-yellow-600">(Baru dipilih)</span>}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="alamat">Alamat</Label>
            <Input
              id="alamat"
              name="alamat"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              readOnly={!manualInput && !!selectedFamilyHead}
              className={!manualInput && !!selectedFamilyHead ? "bg-muted" : ""}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit">
              {jadwal ? 'Simpan Perubahan' : 'Tambah Jadwal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 