"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FilterIcon } from "lucide-react";
import { tahunOptions, bulanOptions } from "../utils/constants";

interface FilterSectionProps {
  searchTerm: string;
  selectedTahun: string;
  selectedBulan: string;
  showSudahTerpilih: boolean;
  onSearchTermChange: (value: string) => void;
  onTahunChange: (value: string) => void;
  onBulanChange: (value: string) => void;
  onShowSudahTerpilihChange: (checked: boolean) => void;
}

export function FilterSection({
  searchTerm,
  selectedTahun,
  selectedBulan,
  showSudahTerpilih,
  onSearchTermChange,
  onTahunChange,
  onBulanChange,
  onShowSudahTerpilihChange,
}: FilterSectionProps) {
  return (
    <Card className="gap-0">
      <CardHeader>
        <CardTitle className="text-md font-medium">Filter & Pencarian</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-1 md:col-span-2">
            <div className="relative">
              <Input
                placeholder="Cari jadwal..."
                value={searchTerm}
                onChange={(e) => onSearchTermChange(e.target.value)}
                className="pl-10"
              />
              <div className="absolute left-3 top-2.5 text-muted-foreground">
                <FilterIcon className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div>
            <Select value={selectedBulan} onValueChange={onBulanChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Bulan" />
              </SelectTrigger>
              <SelectContent>
                {bulanOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={selectedTahun} onValueChange={onTahunChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Tahun" />
              </SelectTrigger>
              <SelectContent>
                {tahunOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 flex items-center">
          <Checkbox
            id="showTerpilih"
            checked={showSudahTerpilih}
            onCheckedChange={(checked) => onShowSudahTerpilihChange(checked === true)}
            className="mr-2"
          />
          <Label htmlFor="showTerpilih" className="text-sm text-muted-foreground">
            Tampilkan kepala keluarga yang sudah terpilih
          </Label>
        </div>
      </CardContent>
    </Card>
  );
} 