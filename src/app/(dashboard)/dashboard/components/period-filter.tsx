"use client"

import * as React from "react"
import { useState } from "react"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { getMonthDateRange } from "../utils"

interface PeriodFilterProps {
  dateRange: DateRange | undefined
  onMonthChange: (date: DateRange | undefined) => void
}

export function PeriodFilter({ dateRange, onMonthChange }: PeriodFilterProps) {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i)
  const months = [
    { value: "all", label: "Semua Data" },
    { value: "0", label: "Januari" },
    { value: "1", label: "Februari" },
    { value: "2", label: "Maret" },
    { value: "3", label: "April" },
    { value: "4", label: "Mei" },
    { value: "5", label: "Juni" },
    { value: "6", label: "Juli" },
    { value: "7", label: "Agustus" },
    { value: "8", label: "September" },
    { value: "9", label: "Oktober" },
    { value: "10", label: "November" },
    { value: "11", label: "Desember" }
  ]

  const selectedMonth = dateRange === undefined ? "all" : (dateRange?.from ? dateRange.from.getMonth().toString() : new Date().getMonth().toString())
  const selectedYear = dateRange === undefined ? new Date().getFullYear().toString() : (dateRange?.from ? dateRange.from.getFullYear().toString() : new Date().getFullYear().toString())

  const handleMonthChange = (month: string) => {
    if (month === "all") {
      onMonthChange(undefined)
    } else {
      const newDate = new Date(parseInt(selectedYear), parseInt(month), 1)
      onMonthChange(getMonthDateRange(newDate))
    }
  }

  const handleYearChange = (year: string) => {
    const newDate = new Date(parseInt(year), parseInt(selectedMonth), 1)
    onMonthChange(getMonthDateRange(newDate))
  }

  return (
    <div className="space-y-4 w-full md:w-auto bg-gray-50 p-4 rounded-lg border">
      <div className="flex items-center gap-2">
        <CalendarIcon className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-medium text-sm">Filter Periode</h3>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="month-select">Bulan</Label>
          <Select 
            value={selectedMonth} 
            onValueChange={handleMonthChange}
          >
            <SelectTrigger id="month-select" className="w-full sm:w-[140px]">
              <SelectValue placeholder="Pilih Bulan" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-1.5">
          <Label htmlFor="year-select">Tahun</Label>
          <Select 
            value={selectedYear} 
            onValueChange={handleYearChange}
          >
            <SelectTrigger id="year-select" className="w-full sm:w-[120px]">
              <SelectValue placeholder="Pilih Tahun" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="text-xs text-muted-foreground mt-2">
        {dateRange === undefined ? (
          <p>Menampilkan semua data</p>
        ) : dateRange?.from && (
          <p>Menampilkan data untuk {format(dateRange.from, "MMMM yyyy", { locale: id })}</p>
        )}
      </div>
    </div>
  )
} 