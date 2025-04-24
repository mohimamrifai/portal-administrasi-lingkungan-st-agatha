"use client"

import { useState, useEffect } from "react"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

interface YearFilterProps {
  availableYears: number[]
  selectedYear?: number
  onChange: (year?: number) => void
}

export function YearFilter({ 
  availableYears, 
  selectedYear, 
  onChange 
}: YearFilterProps) {
  const [value, setValue] = useState<string>(selectedYear?.toString() || "all")
  
  // Update value when selectedYear prop changes
  useEffect(() => {
    setValue(selectedYear?.toString() || "all")
  }, [selectedYear])
  
  // Handle value change
  const handleValueChange = (newValue: string) => {
    setValue(newValue)
    if (newValue === "all") {
      onChange(undefined)
    } else {
      onChange(Number(newValue))
    }
  }
  
  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Pilih Tahun" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Semua Tahun</SelectItem>
        {availableYears.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
} 