import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { Table } from "@tanstack/react-table"
import { Publikasi } from "../types/publikasi"

interface KategoriOption {
  value: string | null
  label: string
  key: string
}

interface KategoriFilterProps {
  table: Table<Publikasi>
  kategoriFilter: string | null
  setKategoriFilter: (kategori: string | null) => void
}

export function KategoriFilter({ table, kategoriFilter, setKategoriFilter }: KategoriFilterProps) {
  // Kategori filter options
  const kategoriOptions: KategoriOption[] = [
    { value: null, label: "Semua Kategori", key: "all" },
    { value: "Penting", label: "Penting", key: "penting" },
    { value: "Umum", label: "Umum", key: "umum" },
    { value: "Rahasia", label: "Rahasia", key: "rahasia" },
    { value: "Segera", label: "Segera", key: "segera" }
  ]

  return (
    <div className="flex flex-col space-y-2">
      <Select
        value={kategoriFilter || "all"}
        onValueChange={(value) => {
          const filter = value === "all" ? null : value
          setKategoriFilter(filter)
          if (filter) {
            table.getColumn("kategori")?.setFilterValue(filter)
          } else {
            table.getColumn("kategori")?.setFilterValue(undefined)
          }
        }}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Kategori" />
        </SelectTrigger>
        <SelectContent>
          {kategoriOptions.map((option) => (
            <SelectItem 
              key={option.key} 
              value={option.value === null ? "all" : option.value}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Display active filter */}
      {kategoriFilter && (
        <Badge variant="outline" className="gap-1 px-2 py-1 w-fit">
          <span>Kategori: {kategoriOptions.find(t => t.value === kategoriFilter)?.label}</span>
          <Button
            variant="ghost"
            size="icon"
            className="ml-1 h-4 w-4 p-0"
            onClick={() => {
              setKategoriFilter(null)
              table.getColumn("kategori")?.setFilterValue(undefined)
            }}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Clear kategori</span>
          </Button>
        </Badge>
      )}
    </div>
  )
} 