import * as React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const bulanList = [
  "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"
];
const bulanLabel = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];
const tahunList = Array.from({ length: 11 }, (_, i) => (2020 + i).toString());

export function DropdownBulanTahun({ value, onChange, className }: {
  value: string;
  onChange: (val: string) => void;
  className?: string;
}) {
  const [bulan, setBulan] = React.useState<string>(value === 'all' ? 'all' : value.split("-")[1] || "01");
  const [tahun, setTahun] = React.useState<string>(value === 'all' ? new Date().getFullYear().toString() : value.split("-")[0] || new Date().getFullYear().toString());

  React.useEffect(() => {
    if (value === 'all') {
      setBulan('all');
    } else {
      setBulan(value.split("-")[1] || "01");
      setTahun(value.split("-")[0] || new Date().getFullYear().toString());
    }
  }, [value]);

  const handleBulanChange = (val: string) => {
    if (val === 'all') {
      setBulan('all');
      onChange('all');
    } else {
      setBulan(val);
      onChange(`${tahun}-${val}`);
    }
  };
  const handleTahunChange = (val: string) => {
    setTahun(val);
    onChange(`${val}-${bulan}`);
  };

  return (
    <div className={`flex gap-2 ${className || ""}`}>
      <Select value={bulan} onValueChange={handleBulanChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue>{bulan === 'all' ? 'Semua Bulan' : bulanLabel[parseInt(bulan, 10) - 1]}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Bulan</SelectItem>
          {bulanList.map((b, i) => (
            <SelectItem key={b} value={b}>{bulanLabel[i]}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={tahun} onValueChange={handleTahunChange}>
        <SelectTrigger className="w-[90px]">
          <SelectValue>{tahun}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {tahunList.map((t) => (
            <SelectItem key={t} value={t}>{t}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 