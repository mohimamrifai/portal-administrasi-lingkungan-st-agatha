"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Trash2, Camera } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Dependent, DependentType, Gender } from "../types"

interface DependentItemProps {
  dependent: Dependent
  onEdit: (dependent: Dependent) => void
  onDelete: (dependent: Dependent) => void
  onImageUpload: (entityType: 'familyHead' | 'spouse' | 'dependent', id?: number) => void
  readOnly?: boolean
}

export function DependentItem({ 
  dependent, 
  onEdit, 
  onDelete, 
  onImageUpload,
  readOnly = false
}: DependentItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
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
    <div className="flex items-start gap-3 p-4 border rounded-md hover:bg-muted/30 transition-colors">
      <div className="relative">
        <Avatar className="h-16 w-16 border border-primary/10">
          {dependent.imageUrl ? (
            <AvatarImage src={dependent.imageUrl} alt={dependent.name} />
          ) : (
            <AvatarFallback className="text-xl">{getInitials(dependent.name)}</AvatarFallback>
          )}
        </Avatar>
        {!readOnly && (
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute -bottom-1 -right-1 rounded-full h-6 w-6 bg-background"
            onClick={() => onImageUpload('dependent', dependent.id)}
          >
            <Camera className="h-3 w-3" />
            <span className="sr-only">Upload foto</span>
          </Button>
        )}
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium text-base">{dependent.name}</h4>
            <p className="text-sm text-muted-foreground mt-1">{dependent.dependentType}</p>
          </div>
          
          {!readOnly && (
            <div className="flex space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onEdit(dependent)}
                className="h-8 w-8"
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onDelete(dependent)}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Hapus</span>
              </Button>
            </div>
          )}
        </div>
        
        <div className="mt-2 text-sm grid gap-2 grid-cols-2">
          <div>
            <span className="text-muted-foreground">Tanggal Lahir: </span>
            <span>
              {format(new Date(dependent.birthDate), "dd MMM yyyy", { locale: id })}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Jenis Kelamin: </span>
            <span>{dependent.gender}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Tempat Lahir: </span>
            <span>{dependent.birthPlace || "-"}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Pendidikan: </span>
            <span>{dependent.education || "-"}</span>
          </div>
        </div>
      </div>
    </div>
  )
} 