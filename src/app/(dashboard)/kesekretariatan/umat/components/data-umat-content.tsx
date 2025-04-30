"use client";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { FamilyHeadFormDialog } from "./family-head-form-dialog"
import { FamilyHeadsTable } from "./family-heads-table"
import { ImportDialog } from "./import-dialog"
import { FamilyHead, FamilyHeadFormValues } from "../types"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { AlertCircle, PlusIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { exportFamilyHeadTemplate } from "../utils/export-template"

// Mock data - in a real app, this would come from an API
const mockFamilyHeads: FamilyHead[] = [
    {
        id: 1,
        name: "Budi Santoso",
        address: "Jl. Merdeka No. 123",
        phoneNumber: "081234567890",
        joinDate: new Date(2020, 1, 15),
        childrenCount: 2,
        relativesCount: 0,
        familyMembersCount: 4,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 2,
        name: "Ani Wijaya",
        address: "Jl. Sudirman No. 456",
        phoneNumber: "089876543210",
        joinDate: new Date(2021, 5, 10),
        childrenCount: 1,
        relativesCount: 1,
        familyMembersCount: 3,
        status: "moved",
        scheduledDeleteDate: new Date(2022, 6, 10),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
]

export default function DataUmatContent() {
    const { userRole } = useAuth()
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
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

    const handleDeleteFamilyHead = async (id: number, reason: "moved" | "deceased", memberName?: string) => {
        if (!canModifyData) {
            toast.error("Anda tidak memiliki izin untuk menghapus data")
            return
        }

        // In a real app, this would be an API call
        const targetFamilyHead = familyHeads.find(familyHead => familyHead.id === id)
        if (!targetFamilyHead) return;

        let updatedFamilyHeads;

        if (reason === "moved") {
            // Jika alasan pindah, jadwalkan penghapusan 1 tahun 1 bulan dari sekarang
            const deleteDate = new Date();
            deleteDate.setMonth(deleteDate.getMonth() + 13); // 1 tahun 1 bulan

            updatedFamilyHeads = familyHeads.map(familyHead => 
                familyHead.id === id 
                    ? { 
                        ...familyHead, 
                        status: "moved", 
                        scheduledDeleteDate: deleteDate,
                        updatedAt: new Date()
                    } 
                    : familyHead
            );
            
            // Dalam aplikasi sesungguhnya, kirim data ini ke backend untuk dijadwalkan
            console.log(`Keluarga ${targetFamilyHead.name} akan dihapus pada ${deleteDate.toISOString()}`);
        } else if (reason === "deceased") {
            // Jika alasan meninggal, perbarui status dan catat anggota keluarga yang meninggal
            updatedFamilyHeads = familyHeads.map(familyHead => 
                familyHead.id === id 
                    ? { 
                        ...familyHead, 
                        status: "deceased", 
                        deceasedMemberName: memberName,
                        updatedAt: new Date()
                    } 
                    : familyHead
            );
            
            // Dalam aplikasi sesungguhnya, kirim data ini ke backend untuk memperbarui database
            console.log(`Anggota keluarga ${memberName} dari keluarga ${targetFamilyHead.name} telah meninggal`);
        }

        setFamilyHeads(updatedFamilyHeads as FamilyHead[]);
    }

    const handleDownloadTemplate = () => {
        if (!canModifyData) {
            toast.error("Anda tidak memiliki izin untuk mengunduh template")
            return
        }

        exportFamilyHeadTemplate();
    }

    const handleImportData = () => {
        if (!canModifyData) {
            toast.error("Anda tidak memiliki izin untuk mengimpor data")
            return
        }

        setIsImportDialogOpen(true);
    }

    const handleImportComplete = (newFamilyHeads: FamilyHead[]) => {
        setFamilyHeads([...familyHeads, ...newFamilyHeads]);
    };

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

                <h2 className="text-2xl font-bold">Data Umat</h2>
            <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-4 mb-2">
                {canModifyData && (
                    <Button
                        onClick={() => {
                            setSelectedFamilyHead(undefined)
                            setIsFormDialogOpen(true)
                        }}
                        size="sm"
                        className="w-full sm:w-auto"
                    >
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Tambah Data
                    </Button>
                )}
            </div>

            <FamilyHeadsTable
                familyHeads={familyHeads}
                onEdit={(familyHead) => {
                    if (!canModifyData) {
                        toast.error("Anda tidak memiliki izin untuk mengubah data")
                        return
                    }
                    setSelectedFamilyHead(familyHead)
                    setIsFormDialogOpen(true)
                }}
                onDelete={handleDeleteFamilyHead}
                onExportTemplate={handleDownloadTemplate}
                onImportData={handleImportData}
                canModifyData={canModifyData}
            />

            <FamilyHeadFormDialog
                open={isFormDialogOpen}
                onOpenChange={setIsFormDialogOpen}
                familyHead={selectedFamilyHead}
                onSubmit={selectedFamilyHead ? handleEditFamilyHead : handleAddFamilyHead}
            />

            <ImportDialog
                open={isImportDialogOpen}
                onOpenChange={setIsImportDialogOpen}
                onImportComplete={handleImportComplete}
                existingDataCount={familyHeads.length}
            />
        </div>
    )
}