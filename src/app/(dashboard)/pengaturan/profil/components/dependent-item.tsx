"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Pencil, Trash2, Camera } from "lucide-react"
import { Dependent } from "../types"
import { formatDate } from "../utils"

interface DependentItemProps {
  dependent: Dependent
  onEdit: (dependent: Dependent) => void
  onDelete: (dependent: Dependent) => void
  onImageUpload: () => void
}

export function DependentItem({ dependent, onEdit, onDelete, onImageUpload }: DependentItemProps) {
  // Helper untuk mendapatkan inisial nama
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  
  return (
    <div className="border p-4 rounded-md mb-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-primary/10">
              <AvatarImage src={dependent.imageUrl} alt={dependent.fullName} />
              <AvatarFallback>{getInitials(dependent.fullName)}</AvatarFallback>
            </Avatar>
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute bottom-0 right-0 rounded-full h-5 w-5 bg-background"
              onClick={onImageUpload}
            >
              <Camera className="h-2.5 w-2.5" />
              <span className="sr-only">Upload foto</span>
            </Button>
          </div>
          <div>
            <h3 className="font-medium">{dependent.fullName}</h3>
            <p className="text-sm text-muted-foreground">
              {dependent.relationship} • {dependent.gender} • {formatDate(dependent.birthDate)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(dependent)}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(dependent)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Hapus</span>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-2 text-sm ml-[60px]">
        <div>
          <span className="text-muted-foreground">NIK:</span> {dependent.nik}
        </div>
        <div>
          <span className="text-muted-foreground">Pekerjaan/Aktivitas:</span> {dependent.occupation || "-"}
        </div>
      </div>
    </div>
  )
} 