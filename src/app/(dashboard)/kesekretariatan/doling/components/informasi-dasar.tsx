"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { JenisIbadat, jenisIbadatOptions, subIbadatOptions } from "../types/form-types";
import { JadwalDoling } from "../types";

interface InformasiDasarSectionProps {
  selectedJadwal: string;
  tanggalValue: string;
  tuanRumahValue: string;
  jenisIbadat: JenisIbadat;
  subIbadat: string;
  temaIbadat?: string;
  jadwalDoling: JadwalDoling[];
  onSelectedJadwalChange: (value: string) => void;
  onTanggalValueChange: (value: string) => void;
  onTuanRumahValueChange: (value: string) => void;
  onJenisIbadatChange: (value: JenisIbadat) => void;
  onSubIbadatChange: (value: string) => void;
}

export function InformasiDasarSection({
  selectedJadwal,
  tanggalValue,
  tuanRumahValue,
  jenisIbadat,
  subIbadat,
  temaIbadat,
  jadwalDoling,
  onSelectedJadwalChange,
  onTanggalValueChange,
  onTuanRumahValueChange,
  onJenisIbadatChange,
  onSubIbadatChange,
}: InformasiDasarSectionProps) {
  return (
    <div className="space-y-2 rounded-lg border p-4">
      <h3 className="text-md font-medium mb-2">Informasi Dasar</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="jadwalId">Pilih Jadwal Doling</Label>
          <Select 
            value={selectedJadwal} 
            onValueChange={onSelectedJadwalChange}
            name="jadwalId"
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
            onChange={(e) => onTanggalValueChange(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="tuanRumah">Tuan Rumah</Label>
          <Input
            id="tuanRumah"
            name="tuanRumah"
            value={tuanRumahValue}
            onChange={(e) => onTuanRumahValueChange(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="jenisIbadat">Jenis Ibadat</Label>
          <Select 
            name="jenisIbadat" 
            value={jenisIbadat} 
            onValueChange={(value: string) => onJenisIbadatChange(value as JenisIbadat)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih jenis ibadat" />
            </SelectTrigger>
            <SelectContent>
              {jenisIbadatOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="subIbadat">Sub Ibadat</Label>
          <Select 
            name="subIbadat" 
            value={subIbadat} 
            onValueChange={onSubIbadatChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih sub ibadat" />
            </SelectTrigger>
            <SelectContent>
              {subIbadatOptions[jenisIbadat]?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Tema ibadat (hanya untuk doa lingkungan) */}
        {jenisIbadat === "doa-lingkungan" && (
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="temaIbadat">Tema Ibadat</Label>
            <Input
              id="temaIbadat"
              name="temaIbadat"
              defaultValue={temaIbadat || ""}
            />
          </div>
        )}
      </div>
    </div>
  );
} 