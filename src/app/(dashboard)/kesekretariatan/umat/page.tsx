"use client";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, Suspense, useEffect } from "react"
import { FamilyHeadFormDialog } from "./components/family-head-form-dialog"
import { FamilyHeadsTable } from "./components/family-heads-table"
import { FamilyHead, FamilyHeadFormValues } from "./types"
import { toast } from "sonner"
import LoadingSkeleton from "./components/loading-skeleton";
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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

function DataUmatContent() {
  const { userRole } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
  const [selectedFamilyHead, setSelectedFamilyHead] = useState<FamilyHead | undefined>()
  const [familyHeads, setFamilyHeads] = useState<FamilyHead[]>(mockFamilyHeads)

  // Cek apakah pengguna memiliki hak akses
  const hasAccess = [
    'SuperUser',
    'ketuaLingkungan',
    'sekretaris',
    'wakilSekretaris',
    'adminLingkungan'
  ].includes(userRole)

  // Redirect jika tidak memiliki akses
  useEffect(() => {
    if (!hasAccess) {
      toast.error("Anda tidak memiliki akses ke halaman ini")
      router.push("/dashboard")
    }
  }, [hasAccess, router])

  // Cek akses untuk edit dan hapus data
  const canModifyData = [
    'SuperUser',
    'sekretaris',
    'wakilSekretaris',
    'adminLingkungan'
  ].includes(userRole)

  const filteredFamilyHeads = familyHeads.filter((familyHead) =>
    familyHead.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddFamilyHead = async (values: FamilyHeadFormValues) => {
    if (!canModifyData) {
      toast.error("Anda tidak memiliki izin untuk menambah data")
      return
    }

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
    if (!selectedFamilyHead || !canModifyData) {
      if (!canModifyData) toast.error("Anda tidak memiliki izin untuk mengubah data")
      return
    }

    // In a real app, this would be an API call
    const updatedFamilyHeads = familyHeads.map((familyHead) =>
      familyHead.id === selectedFamilyHead.id
        ? { ...familyHead, ...values, updatedAt: new Date() }
        : familyHead
    )
    setFamilyHeads(updatedFamilyHeads)
  }

  const handleDeleteFamilyHead = async (id: number) => {
    if (!canModifyData) {
      toast.error("Anda tidak memiliki izin untuk menghapus data")
      return
    }
    
    // In a real app, this would be an API call
    setFamilyHeads(familyHeads.filter((familyHead) => familyHead.id !== id))
  }

  const handleDownloadTemplate = () => {
    if (!canModifyData) {
      toast.error("Anda tidak memiliki izin untuk mengunduh template")
      return
    }
    
    // In a real app, this would download a template file
    toast.info("Fitur download template akan segera tersedia")
  }

  const handleImportData = () => {
    if (!canModifyData) {
      toast.error("Anda tidak memiliki izin untuk mengimpor data")
      return
    }
    
    // In a real app, this would open a file picker and process the imported data
    toast.info("Fitur impor data akan segera tersedia")
  }

  if (!hasAccess) {
    return <div className="flex justify-center items-center h-64">Memeriksa akses...</div>
  }

  return (
    <div className="space-y-6">
      {!canModifyData && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Mode Hanya Baca</AlertTitle>
          <AlertDescription>
            Anda hanya dapat melihat data umat. Untuk menambah, mengubah, atau menghapus data, hubungi Sekretaris atau Wakil Sekretaris.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Data Umat</h2>
        <div className="flex flex-wrap gap-2">
          {canModifyData && (
            <>
              <Button variant="outline" onClick={handleDownloadTemplate} size="sm">
                Download Template
              </Button>
              <Button variant="outline" onClick={handleImportData} size="sm">
                Impor Data
              </Button>
              <Button
                onClick={() => {
                  setSelectedFamilyHead(undefined)
                  setIsFormDialogOpen(true)
                }}
                size="sm"
              >
                Tambah Data
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="w-full sm:max-w-xs">
        <Input
          placeholder="Cari nama kepala keluarga"
          className="w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <FamilyHeadsTable
        familyHeads={filteredFamilyHeads}
        onEdit={(familyHead) => {
          if (!canModifyData) {
            toast.error("Anda tidak memiliki izin untuk mengubah data")
            return
          }
          setSelectedFamilyHead(familyHead)
          setIsFormDialogOpen(true)
        }}
        onDelete={handleDeleteFamilyHead}
        canModifyData={canModifyData}
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

export default function DataUmatPage() {
  return (
    <div className="p-2">
      <Suspense fallback={<LoadingSkeleton />}>
        <DataUmatContent />
      </Suspense>
    </div>
  )
} 