"use client"

import { useState } from "react"
import { format } from "date-fns"
import { DanaMandiriArrears } from "../types"
import { formatCurrency, getFamilyHeadName } from "../utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { 
  BellIcon, 
  EditIcon, 
  SearchIcon, 
  X,
  ChevronLeftIcon, 
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon 
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface MonitoringTableProps {
  arrears: DanaMandiriArrears[]
  selectedFamilyIds: number[]
  onSelectChange: (id: number, isChecked: boolean) => void
  onSelectAll: (isChecked: boolean) => void
  onSendReminder: () => void
  onSetDues: () => void
}

export function MonitoringTable({
  arrears,
  selectedFamilyIds,
  onSelectChange,
  onSelectAll,
  onSendReminder,
  onSetDues,
}: MonitoringTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [reminderFilter, setReminderFilter] = useState<string | null>(null)
  
  // Filter arrears by search term and reminder status
  const filteredArrears = arrears.filter(arrear => {
    const familyHeadName = getFamilyHeadName(arrear.familyHeadId).toLowerCase()
    
    const matchesSearch = 
      searchTerm === "" || 
      familyHeadName.includes(searchTerm.toLowerCase())
    
    const matchesReminderStatus = 
      reminderFilter === null ||
      (reminderFilter === "reminded" && arrear.lastNotificationDate) ||
      (reminderFilter === "not_reminded" && !arrear.lastNotificationDate)
    
    return matchesSearch && matchesReminderStatus
  })
  
  // Calculate pagination values
  const totalItems = filteredArrears.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  
  // Get current page data
  const currentArrears = filteredArrears
    .sort((a, b) => b.totalAmount - a.totalAmount) // Sort by highest amount first
    .slice(startIndex, endIndex)
  
  // Check if all visible arrears are selected
  const allSelected = 
    currentArrears.length > 0 && 
    currentArrears.every(arrear => selectedFamilyIds.includes(arrear.familyHeadId))
  
  // Handle select all for current page only
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const ids = currentArrears.map(arrear => arrear.familyHeadId)
      const newSelected = [...selectedFamilyIds]
      
      ids.forEach(id => {
        if (!newSelected.includes(id)) {
          newSelected.push(id)
        }
      })
      
      onSelectAll(true)
    } else {
      onSelectAll(false)
    }
  }
  
  // Format period text
  const formatPeriods = (periods: number[]): string => {
    if (periods.length === 1) {
      return periods[0].toString()
    }
    
    if (periods.length === 2) {
      return periods.join(" dan ")
    }
    
    const sortedPeriods = [...periods].sort()
    return `${sortedPeriods[0]} - ${sortedPeriods[sortedPeriods.length - 1]}`
  }
  
  // Get last notification status
  const getNotificationStatus = (lastNotificationDate?: Date) => {
    if (!lastNotificationDate) {
      return <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">Belum diingatkan</Badge>
    }
    
    return (
      <div className="flex flex-col">
        <Badge className="bg-green-100 text-green-700 border-green-300">Sudah diingatkan</Badge>
        <span className="text-xs text-gray-500 mt-1">{format(lastNotificationDate, "dd MMM yyyy")}</span>
      </div>
    )
  }
  
  // Pagination functions
  const goToPage = (page: number) => {
    setCurrentPage(page)
  }
  
  const goToFirstPage = () => setCurrentPage(1)
  const goToLastPage = () => setCurrentPage(totalPages)
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(1, prev - 1))
  const goToNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1))
  
  // Handle page size change
  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value))
    setCurrentPage(1) // Reset to first page when changing page size
  }
  
  // Reminder filter options
  const reminderOptions = [
    { value: null, label: "Semua Status" },
    { value: "reminded", label: "Sudah Diingatkan" },
    { value: "not_reminded", label: "Belum Diingatkan" }
  ]
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-64">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari kepala keluarga..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              className="absolute right-0 top-0 h-9 w-9 p-0"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select
            value={reminderFilter === null ? "all" : reminderFilter}
            onValueChange={(value) => setReminderFilter(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Status Pengingat" />
            </SelectTrigger>
            <SelectContent>
              {reminderOptions.map(option => (
                <SelectItem 
                  key={option.value || "all"} 
                  value={option.value === null ? "all" : option.value}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={onSetDues} className="whitespace-nowrap">
            <EditIcon className="h-4 w-4 mr-2" />
            Set Iuran
          </Button>
          
          <Button 
            onClick={onSendReminder} 
            disabled={selectedFamilyIds.length === 0}
            className="whitespace-nowrap"
          >
            <BellIcon className="h-4 w-4 mr-2" />
            Kirim Pengingat
          </Button>
        </div>
      </div>
      
      {/* Active Filters */}
      {(searchTerm || reminderFilter) && (
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>Filter aktif:</span>
          {searchTerm && (
            <Badge variant="outline" className="gap-1 px-2 py-1">
              <span>Pencarian: {searchTerm}</span>
              <Button
                variant="ghost"
                size="icon"
                className="ml-1 h-4 w-4 p-0"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Clear search</span>
              </Button>
            </Badge>
          )}
          
          {reminderFilter && (
            <Badge variant="outline" className="gap-1 px-2 py-1">
              <span>Status: {reminderOptions.find(o => o.value === reminderFilter)?.label}</span>
              <Button
                variant="ghost"
                size="icon"
                className="ml-1 h-4 w-4 p-0"
                onClick={() => setReminderFilter(null)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Clear filter</span>
              </Button>
            </Badge>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-auto h-7 text-xs"
            onClick={() => {
              setSearchTerm("")
              setReminderFilter(null)
            }}
          >
            Reset Semua
          </Button>
        </div>
      )}

      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox 
                    checked={allSelected}
                    onCheckedChange={(checked) => handleSelectAll(!!checked)}
                  />
                </TableHead>
                <TableHead className="min-w-[180px]">Nama Kepala Keluarga</TableHead>
                <TableHead className="w-[150px]">Periode Tunggakan</TableHead>
                <TableHead className="text-right w-[150px]">Jumlah Tunggakan (Rp)</TableHead>
                <TableHead className="w-[150px]">Status Pengingat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentArrears.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      {filteredArrears.length === 0 ? (
                        arrears.length > 0 ? (
                          <>
                            <p className="text-muted-foreground">Tidak ada data tunggakan yang sesuai dengan filter</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSearchTerm("")
                                setReminderFilter(null)
                              }}
                            >
                              Reset Filter
                            </Button>
                          </>
                        ) : (
                          <p className="text-muted-foreground">Tidak ada data tunggakan tersedia</p>
                        )
                      ) : (
                        <p className="text-muted-foreground">Tidak ada data tunggakan pada halaman ini</p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                currentArrears.map((arrear) => (
                  <TableRow key={arrear.id} className="group">
                    <TableCell>
                      <Checkbox 
                        checked={selectedFamilyIds.includes(arrear.familyHeadId)}
                        onCheckedChange={(checked) => onSelectChange(arrear.familyHeadId, !!checked)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{getFamilyHeadName(arrear.familyHeadId)}</TableCell>
                    <TableCell>{formatPeriods(arrear.periods)}</TableCell>
                    <TableCell className="text-right font-medium text-red-600">{formatCurrency(arrear.totalAmount)}</TableCell>
                    <TableCell>{getNotificationStatus(arrear.lastNotificationDate)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Pagination Controls */}
      {arrears.length > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-2">
          <div className="flex flex-col md:flex-row items-center gap-2 md:space-x-2 w-full md:w-auto text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              Menampilkan {totalItems > 0 ? startIndex + 1 : 0}-{endIndex} dari {totalItems} tunggakan
              {(searchTerm || reminderFilter) && 
                ` (difilter dari ${arrears.length} total)`}
            </p>
            <div className="flex items-center gap-2 mt-2 md:mt-0">
              <p className="text-sm text-muted-foreground">Tampilkan</p>
              <Select 
                value={pageSize.toString()} 
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={pageSize.toString()} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">per halaman</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center mt-4 md:mt-0 w-full md:w-auto">
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={goToFirstPage} 
                disabled={currentPage === 1}
                className="h-8 w-8"
              >
                <ChevronsLeftIcon className="h-4 w-4" />
                <span className="sr-only">First Page</span>
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={goToPreviousPage} 
                disabled={currentPage === 1}
                className="h-8 w-8"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                <span className="sr-only">Previous Page</span>
              </Button>
              
              <span className="text-sm mx-2 min-w-[90px] text-center">
                Halaman {currentPage} dari {totalPages}
              </span>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={goToNextPage} 
                disabled={currentPage === totalPages}
                className="h-8 w-8"
              >
                <ChevronRightIcon className="h-4 w-4" />
                <span className="sr-only">Next Page</span>
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={goToLastPage} 
                disabled={currentPage === totalPages}
                className="h-8 w-8"
              >
                <ChevronsRightIcon className="h-4 w-4" />
                <span className="sr-only">Last Page</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 