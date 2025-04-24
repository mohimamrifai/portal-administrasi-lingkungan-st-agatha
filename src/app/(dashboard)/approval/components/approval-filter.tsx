"use client"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ApprovalFilterProps {
  selectedMonth: string
  onMonthChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onStatusFilterChange: (value: string) => void
  statusFilter: string
}

export function ApprovalFilter({
  selectedMonth,
  onMonthChange,
  onStatusFilterChange,
  statusFilter,
}: ApprovalFilterProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
      <Input 
        type="month" 
        className="w-full md:w-[200px]" 
        value={selectedMonth}
        onChange={onMonthChange}
      />
      <Select onValueChange={onStatusFilterChange} value={statusFilter} defaultValue="all">
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Filter Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Status</SelectItem>
          <SelectItem value="pending">Menunggu Persetujuan</SelectItem>
          <SelectItem value="approved">Disetujui</SelectItem>
          <SelectItem value="rejected">Ditolak</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
} 