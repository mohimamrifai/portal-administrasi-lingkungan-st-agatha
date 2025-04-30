"use client";

import { useState } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronRight } from "lucide-react";

interface PeriodeSelectorProps {
  bulanAwal: string;
  setBulanAwal: (value: string) => void;
  tahunAwal: string;
  setTahunAwal: (value: string) => void;
  bulanAkhir: string;
  setBulanAkhir: (value: string) => void;
  tahunAkhir: string;
  setTahunAkhir: (value: string) => void;
  onFilter: () => void;
}

export function PeriodeSelector({
  bulanAwal,
  setBulanAwal,
  tahunAwal,
  setTahunAwal,
  bulanAkhir,
  setBulanAkhir,
  tahunAkhir,
  setTahunAkhir,
  onFilter,
}: PeriodeSelectorProps) {
  const namaBulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  // Mendapatkan tahun saat ini dan 10 tahun sebelumnya
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => (currentYear - 9 + i).toString());

  return (
    <div className="grid gap-4 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Filter Awal */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Periode Awal</label>
          <div className="flex gap-2">
            <Select value={bulanAwal} onValueChange={setBulanAwal}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Bulan" />
              </SelectTrigger>
              <SelectContent>
                {namaBulan.map((bulan, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {bulan}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={tahunAwal} onValueChange={setTahunAwal}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Tahun" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filter Akhir */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Periode Akhir</label>
          <div className="flex gap-2">
            <Select value={bulanAkhir} onValueChange={setBulanAkhir}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Bulan" />
              </SelectTrigger>
              <SelectContent>
                {namaBulan.map((bulan, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {bulan}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={tahunAkhir} onValueChange={setTahunAkhir}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Tahun" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={onFilter} className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          Terapkan Filter
        </Button>
      </div>
    </div>
  );
} 