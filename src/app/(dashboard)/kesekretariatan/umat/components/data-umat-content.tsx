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
import { addFamilyHead, getAllFamilyHeads, markFamilyAsDeceased, markFamilyAsMoved, markFamilyMemberAsDeceased, updateFamilyHead } from "../actions"
import { StatusKehidupan } from "@prisma/client"

interface DataUmatContentProps {
    initialFamilyHeads?: FamilyHead[];
}

export default function DataUmatContent({ initialFamilyHeads = [] }: DataUmatContentProps) {
    const { userRole } = useAuth()
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
    const [selectedFamilyHead, setSelectedFamilyHead] = useState<FamilyHead | undefined>()
    const [familyHeads, setFamilyHeads] = useState<FamilyHead[]>(initialFamilyHeads)
    const [isLoading, setIsLoading] = useState(initialFamilyHeads.length === 0)

    // Cek apakah pengguna memiliki hak akses
    const hasAccess = userRole ? [
        'SUPER_USER',
        'KETUA',
        'WAKIL_KETUA',
        'SEKRETARIS',
        'WAKIL_SEKRETARIS',
    ].includes(userRole) : false;

    // Redirect jika tidak memiliki akses
    useEffect(() => {
        if (userRole && !hasAccess) {
            toast.error("Anda tidak memiliki akses ke halaman ini")
            router.push("/dashboard")
        }
    }, [hasAccess, router, userRole])

    // Cek akses untuk edit dan hapus data
    const canModifyData = userRole ? [
        'SUPER_USER',
        'SEKRETARIS',
        'WAKIL_SEKRETARIS',
    ].includes(userRole) : false;

    // Fetch data keluarga umat
    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true)
                const data = await getAllFamilyHeads();
                setFamilyHeads(data);
            } catch (error) {
                console.error("Error fetching family heads:", error);
                toast.error("Gagal mengambil data keluarga umat");
            } finally {
                setIsLoading(false)
            }
        }

        // Hanya fetch data jika tidak ada initial data
        if (initialFamilyHeads.length === 0) {
            fetchData();
        }
    }, [initialFamilyHeads.length]);

    const handleAddFamilyHead = async (values: FamilyHeadFormValues) => {
        if (!canModifyData) {
            toast.error("Anda tidak memiliki izin untuk menambah data")
            return
        }

        try {
            // Konversi tanggal dari null ke undefined
            const formattedValues = {
                ...values,
                nomorTelepon: values.nomorTelepon || undefined,
                tanggalKeluar: values.tanggalKeluar === null ? undefined : values.tanggalKeluar,
                tanggalMeninggal: values.tanggalMeninggal === null ? undefined : values.tanggalMeninggal
            };

            await addFamilyHead(formattedValues);
            
            // Refresh data
            const data = await getAllFamilyHeads();
            setFamilyHeads(data);
            toast.success("Berhasil menambahkan data keluarga baru");
            setIsFormDialogOpen(false);
        } catch (error) {
            console.error("Error adding family head:", error);
            toast.error("Gagal menambahkan data keluarga");
        }
    }

    const handleEditFamilyHead = async (values: FamilyHeadFormValues) => {
        if (!selectedFamilyHead || !canModifyData) {
            if (!canModifyData) toast.error("Anda tidak memiliki izin untuk mengubah data")
            return
        }

        try {
            // Konversi tanggal dari null ke undefined
            const formattedValues = {
                ...values,
                nomorTelepon: values.nomorTelepon || undefined,
                tanggalKeluar: values.tanggalKeluar === null ? undefined : values.tanggalKeluar,
                tanggalMeninggal: values.tanggalMeninggal === null ? undefined : values.tanggalMeninggal
            };

            await updateFamilyHead(selectedFamilyHead.id, formattedValues);
            
            // Refresh data
            const data = await getAllFamilyHeads();
            setFamilyHeads(data);
            toast.success("Berhasil mengupdate data keluarga");
            setIsFormDialogOpen(false);
        } catch (error) {
            console.error("Error updating family head:", error);
            toast.error("Gagal mengupdate data keluarga");
        }
    }

    const handleDeleteFamilyHead = async (id: string, reason: "moved" | "deceased" | "member_deceased", memberName?: string) => {
        if (!canModifyData) {
            toast.error("Anda tidak memiliki izin untuk menghapus data")
            return
        }

        try {
            if (reason === "moved") {
                await markFamilyAsMoved(id);
                toast.success("Status keluarga berhasil diubah menjadi Pindah");
            } else if (reason === "deceased") {
                await markFamilyAsDeceased(id);
                toast.success("Status keluarga berhasil diubah menjadi Meninggal");
            } else if (reason === "member_deceased" && memberName) {
                await markFamilyMemberAsDeceased(id, memberName);
                toast.success(`Status ${memberName} berhasil diubah menjadi Meninggal`);
            }
            
            // Refresh data
            const data = await getAllFamilyHeads();
            setFamilyHeads(data);
        } catch (error) {
            console.error("Error deleting family head:", error);
            toast.error("Gagal memperbarui status keluarga");
        }
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

    const handleImportComplete = async (newFamilyHeads: FamilyHead[]) => {
        // Refresh data setelah import
        try {
            const data = await getAllFamilyHeads();
            setFamilyHeads(data);
            toast.success(`Berhasil mengimpor ${newFamilyHeads.length} data keluarga`);
        } catch (error) {
            console.error("Error refreshing data after import:", error);
        }
    };

    if (userRole === undefined) {
        return <div className="flex justify-center items-center h-64">Memeriksa akses...</div>
    }

    if (!hasAccess && userRole !== null) {
        return <div className="flex justify-center items-center h-64">Anda tidak memiliki akses ke halaman ini</div>
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
                isLoading={isLoading}
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