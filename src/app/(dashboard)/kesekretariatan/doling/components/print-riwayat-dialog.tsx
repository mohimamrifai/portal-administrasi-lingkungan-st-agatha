"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RiwayatDolingPDF } from "./riwayat-doling-pdf";
import { DetilDoling, AbsensiDoling } from "../types";
import { format } from "date-fns";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface PrintRiwayatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  detilDolingData: DetilDoling[];
  absensiDolingData: AbsensiDoling[];
}

export function PrintRiwayatDialog({
  open,
  onOpenChange,
  detilDolingData,
  absensiDolingData
}: PrintRiwayatDialogProps) {
  const [selectedDetilId, setSelectedDetilId] = useState<string>("");
  const [showPDF, setShowPDF] = useState(false);
  const [openCombobox, setOpenCombobox] = useState(false);

  // Reset state when dialog opens/closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setShowPDF(false);
      setSelectedDetilId("");
    }
    onOpenChange(open);
  };

  // Handle generation of PDF
  const handleShowPDF = () => {
    if (selectedDetilId) {
      setShowPDF(true);
    }
  };

  // Pilih detil doling yang tersedia untuk dicetak (yang berstatus 'selesai')
  const availableDetilDoling = detilDolingData.filter(item => item.status === 'selesai');

  // Ambil data detil yang dipilih
  const selectedDetil = selectedDetilId 
    ? detilDolingData.find(item => item.id === parseInt(selectedDetilId)) 
    : null;

  // Buat data untuk PDF berdasarkan detil yang dipilih
  const getPDFData = () => {
    if (!selectedDetil) return null;

    // Filter absensi yang terkait dengan jadwal yang dipilih (asumsikan ada relasi jadwalId)
    // Ini hanya mock data untuk contoh
    const kepalaKeluarga = [
      { nama: "Budi Santoso", status: 'hadir' as const },
      { nama: "Ahmad Wijaya", status: 'hanya_suami' as const },
      { nama: "Siti Rahayu", status: 'hanya_istri' as const },
      { nama: "Hendra Gunawan", status: 'tidak_hadir' as const },
      { nama: "Dewi Lestari", status: 'hadir' as const },
    ];

    return {
      tanggal: selectedDetil.tanggal,
      jenisIbadat: selectedDetil.jenisIbadat || "Doa Rosario",
      subIbadat: selectedDetil.subIbadat || "Devosi",
      temaIbadat: selectedDetil.temaIbadat || "Kasih & Persaudaraan",
      tuanRumah: selectedDetil.tuanRumah,
      // Statistik kehadiran
      jumlahKK: selectedDetil.jumlahHadir || 0,
      jumlahBapak: selectedDetil.jumlahBapak || 0,
      jumlahIbu: selectedDetil.jumlahIbu || 0,
      jumlahOMK: selectedDetil.jumlahOMK || 0,
      jumlahBIR: selectedDetil.jumlahBIR || 0,
      jumlahBIA: selectedDetil.jumlahBIA || 0,
      jumlahBIA713: 0, // Data ini tidak ada di model DetilDoling
      // Penerimaan
      kolekte1: selectedDetil.kolekte1 || 0,
      kolekte2: selectedDetil.kolekte2 || 0,
      ucapanSyukur: selectedDetil.ucapanSyukur || 0,
      // Kehadiran KK
      kepalaKeluarga: kepalaKeluarga,
    };
  };

  const pdfData = getPDFData();

  // Format jadwal untuk display pada combobox
  const formatJadwalDisplay = (item: DetilDoling) => {
    return `${format(new Date(item.tanggal), 'dd MMMM yyyy')} - ${item.tuanRumah}`;
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden pb-5">
        <DialogHeader>
          <DialogTitle>Cetak Riwayat Doa Lingkungan</DialogTitle>
        </DialogHeader>

        {!showPDF ? (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="detail-doling">Pilih Jadwal Doa Lingkungan</Label>
              
              <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCombobox}
                    className="w-full justify-between"
                  >
                    {selectedDetilId
                      ? availableDetilDoling.find((item) => item.id.toString() === selectedDetilId)
                        ? formatJadwalDisplay(availableDetilDoling.find((item) => item.id.toString() === selectedDetilId)!)
                        : "Pilih jadwal..."
                      : "Pilih jadwal..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[calc(100%-2rem)] p-0" align="start" side="bottom" alignOffset={0} sideOffset={5}>
                  <Command>
                    <CommandInput placeholder="Cari jadwal..." className="h-9" />
                    <CommandEmpty>Tidak ada jadwal yang ditemukan</CommandEmpty>
                    <CommandGroup className="max-h-[200px] overflow-auto">
                      {availableDetilDoling.length > 0 ? (
                        availableDetilDoling.map((item) => (
                          <CommandItem
                            key={item.id}
                            value={formatJadwalDisplay(item)}
                            onSelect={() => {
                              setSelectedDetilId(item.id.toString() === selectedDetilId ? "" : item.id.toString());
                              setOpenCombobox(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedDetilId === item.id.toString() ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {formatJadwalDisplay(item)}
                          </CommandItem>
                        ))
                      ) : (
                        <CommandItem disabled>Tidak ada data yang tersedia</CommandItem>
                      )}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <DialogFooter>
              <Button
                type="button"
                onClick={handleShowPDF}
                disabled={!selectedDetilId}
              >
                Tampilkan PDF
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="h-[600px] overflow-auto">
            {pdfData && <RiwayatDolingPDF data={pdfData} />}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 