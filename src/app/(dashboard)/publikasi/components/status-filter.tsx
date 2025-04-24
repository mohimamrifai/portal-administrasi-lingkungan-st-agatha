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

interface StatusOption {
  value: string | null
  label: string
  key: string
}

interface StatusFilterProps {
  table: Table<Publikasi>
  statusFilter: string | null
  setStatusFilter: (status: string | null) => void
}

export function StatusFilter({ table, statusFilter, setStatusFilter }: StatusFilterProps) {
  // Status filter options
  const statusOptions: StatusOption[] = [
    { value: null, label: "Semua Status", key: "all" },
    { value: "aktif", label: "Aktif", key: "aktif" },
    { value: "kedaluwarsa", label: "Kedaluwarsa", key: "kedaluwarsa" }
  ]

  return (
    <div className="flex flex-col space-y-2">
      <Select
        value={statusFilter || "all"}
        onValueChange={(value) => {
          const filter = value === "all" ? null : value
          setStatusFilter(filter)
          if (filter) {
            table.getColumn("status")?.setFilterValue(filter)
          } else {
            table.getColumn("status")?.setFilterValue(undefined)
          }
        }}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
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
      {statusFilter && (
        <Badge variant="outline" className="gap-1 px-2 py-1 w-fit">
          <span>Status: {statusOptions.find(t => t.value === statusFilter)?.label}</span>
          <Button
            variant="ghost"
            size="icon"
            className="ml-1 h-4 w-4 p-0"
            onClick={() => {
              setStatusFilter(null)
              table.getColumn("status")?.setFilterValue(undefined)
            }}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Clear status</span>
          </Button>
        </Badge>
      )}
    </div>
  )
} 