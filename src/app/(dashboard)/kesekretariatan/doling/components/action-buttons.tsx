"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon, PrinterIcon, RefreshCwIcon } from "lucide-react";

interface JadwalActionButtonsProps {
  onAddJadwal: () => void;
  onResetKepalaKeluarga: () => void;
  onPrintJadwal: () => void;
}

export function JadwalActionButtons({
  onAddJadwal,
  onResetKepalaKeluarga,
  onPrintJadwal,
}: JadwalActionButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={onResetKepalaKeluarga} variant="outline" size="sm">
        <RefreshCwIcon className="h-4 w-4 mr-2" />
        Reset KK
      </Button>
      <Button onClick={onPrintJadwal} variant="outline" size="sm">
        <PrinterIcon className="h-4 w-4 mr-2" />
        Cetak PDF
      </Button>
      <Button onClick={onAddJadwal} variant="default" size="sm">
        <PlusIcon className="h-4 w-4 mr-2" />
        Tambah Jadwal
      </Button>
    </div>
  );
}

interface DetilActionButtonsProps {
  onAddDetil: () => void;
}

export function DetilActionButtons({ onAddDetil }: DetilActionButtonsProps) {
  return (
    <Button onClick={onAddDetil} variant="default" size="sm">
      <PlusIcon className="h-4 w-4 mr-2" />
      Tambah Detail
    </Button>
  );
}

interface AbsensiActionButtonsProps {
  onAddAbsensi: () => void;
}

export function AbsensiActionButtons({ onAddAbsensi }: AbsensiActionButtonsProps) {
  return (
    <Button onClick={onAddAbsensi} variant="default" size="sm">
      <PlusIcon className="h-4 w-4 mr-2" />
      Tambah Absensi
    </Button>
  );
} 