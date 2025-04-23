"use client";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { FamilyHeadFormDialog } from "./components/family-head-form-dialog"
import { FamilyHeadsTable } from "./components/family-heads-table"
import { FamilyHead, FamilyHeadFormValues } from "./types"
import { toast } from "sonner"

// Mock data - in a real app, this would come from an API
const mockFamilyHeads: FamilyHead[] = [
  {
    id: 1,
    name: "Budi Santoso",
    address: "Jl. Merdeka No. 123",
    phoneNumber: "081234567890",
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: "Ani Wijaya",
    address: "Jl. Sudirman No. 456",
    phoneNumber: "089876543210",
    status: "moved",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export default function DataUmatPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
  const [selectedFamilyHead, setSelectedFamilyHead] = useState<FamilyHead | undefined>()
  const [familyHeads, setFamilyHeads] = useState<FamilyHead[]>(mockFamilyHeads)

  const filteredFamilyHeads = familyHeads.filter((familyHead) =>
    familyHead.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddFamilyHead = async (values: FamilyHeadFormValues) => {
    // In a real app, this would be an API call
    const newFamilyHead: FamilyHead = {
      id: familyHeads.length + 1,
      ...values,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setFamilyHeads([...familyHeads, newFamilyHead])
  }

  const handleEditFamilyHead = async (values: FamilyHeadFormValues) => {
    if (!selectedFamilyHead) return

    // In a real app, this would be an API call
    const updatedFamilyHeads = familyHeads.map((familyHead) =>
      familyHead.id === selectedFamilyHead.id
        ? { ...familyHead, ...values, updatedAt: new Date() }
        : familyHead
    )
    setFamilyHeads(updatedFamilyHeads)
  }

  const handleDeleteFamilyHead = async (id: number) => {
    // In a real app, this would be an API call
    setFamilyHeads(familyHeads.filter((familyHead) => familyHead.id !== id))
  }

  const handleDownloadTemplate = () => {
    // In a real app, this would download a template file
    toast.info("Fitur download template akan segera tersedia")
  }

  const handleImportData = () => {
    // In a real app, this would open a file picker and process the imported data
    toast.info("Fitur impor data akan segera tersedia")
  }

  return (
    <div className="container mx-auto py-6 space-y-6 px-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Data Umat</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownloadTemplate}>
            Download Template
          </Button>
          <Button variant="outline" onClick={handleImportData}>
            Impor Data
          </Button>
          <Button
            onClick={() => {
              setSelectedFamilyHead(undefined)
              setIsFormDialogOpen(true)
            }}
          >
            Tambah Data
          </Button>
        </div>
      </div>

      <div className="flex justify-between">
        <Input
          placeholder="Cari nama kepala keluarga"
          className="w-64"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <FamilyHeadsTable
        familyHeads={filteredFamilyHeads}
        onEdit={(familyHead) => {
          setSelectedFamilyHead(familyHead)
          setIsFormDialogOpen(true)
        }}
        onDelete={handleDeleteFamilyHead}
      />

      <FamilyHeadFormDialog
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        familyHead={selectedFamilyHead}
        onSubmit={selectedFamilyHead ? handleEditFamilyHead : handleAddFamilyHead}
      />
    </div>
  )
} 