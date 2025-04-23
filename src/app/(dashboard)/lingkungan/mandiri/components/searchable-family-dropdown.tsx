"use client"

import { useState, useEffect, useRef } from "react"
import { Check, ChevronsUpDown, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { FamilyHead } from "../types"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SearchableFamilyDropdownProps {
  value: number | null;
  onValueChange: (value: number | null) => void;
  familyHeads: FamilyHead[];
  placeholder?: string;
  disabled?: boolean;
}

export function SearchableFamilyDropdown({
  value,
  onValueChange,
  familyHeads,
  placeholder = "Pilih kepala keluarga",
  disabled = false
}: SearchableFamilyDropdownProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Focus input when popover opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    } else {
      setSearchQuery("")
    }
  }, [open])
  
  // Get the selected family head name
  const selectedFamilyHead = value !== null 
    ? familyHeads.find(head => head.id === value) 
    : null
  
  // Filter family heads based on search term
  const filteredFamilyHeads = familyHeads.filter(head => {
    const search = searchQuery.toLowerCase()
    return (
      head.name.toLowerCase().includes(search) ||
      (head.address && head.address.toLowerCase().includes(search)) ||
      (head.phoneNumber && head.phoneNumber.includes(search))
    )
  })
  
  // Handle command select
  const handleSelect = (selectedId: string) => {
    const id = parseInt(selectedId)
    onValueChange(id)
    setOpen(false)
  }
  
  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between text-left",
              !value && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            {selectedFamilyHead ? (
              <span className="flex items-center truncate">
                <span className="truncate">{selectedFamilyHead.name}</span>
                {selectedFamilyHead.address && (
                  <span className="ml-1 text-xs text-muted-foreground truncate hidden sm:inline">
                    ({selectedFamilyHead.address.split(",")[0]})
                  </span>
                )}
              </span>
            ) : (
              placeholder
            )}
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[300px]" align="start">
          <Command shouldFilter={false}>
            <CommandInput 
              ref={inputRef}
              value={searchQuery}
              onValueChange={setSearchQuery}
              placeholder="Cari nama, alamat..." 
              className="h-9"
            />
            <CommandList>
              <ScrollArea className="h-60">
                {filteredFamilyHeads.length === 0 && (
                  <CommandEmpty>Tidak ditemukan</CommandEmpty>
                )}
                <CommandGroup>
                  {filteredFamilyHeads.map((head) => (
                    <CommandItem
                      key={head.id}
                      value={head.id.toString()}
                      onSelect={handleSelect}
                      className="flex items-start py-2"
                    >
                      <div className="flex flex-col flex-1 min-w-0">
                        <div className="font-medium">{head.name}</div>
                        <div className="flex flex-col text-xs text-muted-foreground">
                          {head.address && (
                            <span className="truncate">{head.address}</span>
                          )}
                          {head.phoneNumber && (
                            <span>{head.phoneNumber}</span>
                          )}
                        </div>
                      </div>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4 flex-shrink-0",
                          value === head.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </ScrollArea>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {value !== null && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-9 top-1/2 -translate-y-1/2 h-4 w-4 p-0 opacity-70 hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation()
            onValueChange(null)
          }}
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Clear</span>
        </Button>
      )}
    </div>
  )
} 