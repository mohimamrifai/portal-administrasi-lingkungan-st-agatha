"use client";

import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JadwalDolingTable } from "./jadwal-doling-table";
import { DetilDolingTable } from "./detil-doling-table";
import { AbsensiDolingTable } from "./absensi-doling-table";
import { RiwayatDolingContent } from "./riwayat-doling-content";
import { JadwalDolingFormDialog } from "./jadwal-doling-form-dialog";
import { DetilDolingFormDialog } from "./detil-doling-form-dialog";
import { AbsensiDolingFormDialog } from "./absensi-doling-form-dialog";
import { PrintJadwalDialog } from "./print-jadwal-dialog";
import { JadwalDolingPDF } from "./jadwal-doling-pdf";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import { DolingData, JadwalDoling, DetilDoling, AbsensiDoling } from "../types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

// Import components
import { JadwalDolingCards } from "./summary-cards";
import { FilterSection } from "./filter-section";
import { JadwalActionButtons, DetilActionButtons, AbsensiActionButtons } from "./action-buttons";

// Import server actions
import {
    getAllDoling,
    getKeluargaForSelection,
    getAbsensiByDolingId,
    addDoling,
    updateDolingDetail,
    updateAbsensi,
    deleteDoling,
    updateApprovalStatus,
    getRiwayatKehadiran,
    getRekapitulasiBulanan,
    KeluargaForSelect
} from "../actions";

import { setupReminderNotifications } from "../utils/reminder-notifications";
import { JenisIbadat, SubIbadat, StatusApproval } from "@prisma/client";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export interface DoaLingkunganContentProps {
    initialDoling?: DolingData[];
    initialRiwayat?: {nama: string; totalHadir: number; persentase: number}[];
    initialRekapitulasi?: {bulan: string; jumlahKegiatan: number; rataRataHadir: number}[];
    initialKeluarga?: KeluargaForSelect[];
}

export function DoaLingkunganContent({
    initialDoling = [],
    initialRiwayat = [],
    initialRekapitulasi = [],
    initialKeluarga = []
}: DoaLingkunganContentProps) {
    // Get user role
    const { userRole } = useAuth();

    // Tab state
    const [activeTab, setActiveTab] = useState("jadwal-doling");

    // Data state
    const [jadwalState, setJadwalState] = useState<JadwalDoling[]>(initialDoling);
    const [detilState, setDetilState] = useState<DetilDoling[]>(initialDoling);
    const [absensiState, setAbsensiState] = useState<AbsensiDoling[]>([]);
    const [kepalaKeluargaState, setKepalaKeluargaState] = useState<KeluargaForSelect[]>(initialKeluarga);
    const [riwayatState, setRiwayatState] = useState<{nama: string; totalHadir: number; persentase: number}[]>(initialRiwayat);
    const [rekapitulasiState, setRekapitulasiState] = useState<{bulan: string; jumlahKegiatan: number; rataRataHadir: number}[]>(initialRekapitulasi);
    const [loading, setLoading] = useState(!initialDoling.length);

    // Filter state
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTahun, setSelectedTahun] = useState(new Date().getFullYear().toString());
    const [selectedBulan, setSelectedBulan] = useState((new Date().getMonth() + 1).toString());

    // Dialog states
    const [jadwalFormOpen, setJadwalFormOpen] = useState(false);
    const [detilFormOpen, setDetilFormOpen] = useState(false);
    const [absensiFormOpen, setAbsensiFormOpen] = useState(false);
    const [printJadwalOpen, setPrintJadwalOpen] = useState(false);
    const [showPDFPreview, setShowPDFPreview] = useState(false);

    // PDF data state
    const [pdfData, setPdfData] = useState<{
        startMonth: number;
        startYear: number;
        endMonth: number;
        endYear: number;
    }>({ startMonth: 1, startYear: 2024, endMonth: 12, endYear: 2024 });

    // Editing states
    const [editingJadwal, setEditingJadwal] = useState<JadwalDoling | undefined>(undefined);
    const [editingDetil, setEditingDetil] = useState<DetilDoling | undefined>(undefined);
    const [editingAbsensi, setEditingAbsensi] = useState<AbsensiDoling | undefined>(undefined);
    const [selectedDolingId, setSelectedDolingId] = useState<string | null>(null);

    // Fetch data 
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const currentYear = selectedTahun === "all" ? new Date().getFullYear() : parseInt(selectedTahun);
            const [dolingData, keluargaData, riwayatData, rekapitulasi] = await Promise.all([
                getAllDoling(),
                getKeluargaForSelection(),
                getRiwayatKehadiran(),
                getRekapitulasiBulanan(currentYear)
            ]);
            
            // Urutkan jadwal berdasarkan tanggal terbaru dulu
            const sortedDolingData = [...dolingData].sort((a, b) => {
                const dateA = new Date(a.tanggal);
                const dateB = new Date(b.tanggal);
                return dateB.getTime() - dateA.getTime(); // Terbaru di atas
            });
            
            setJadwalState(sortedDolingData);
            setDetilState(sortedDolingData);
            setKepalaKeluargaState(keluargaData);
            setRiwayatState(riwayatData);
            setRekapitulasiState(rekapitulasi);

            // Jika belum ada doling yang dipilih, pilih yang paling baru
            if (!selectedDolingId && sortedDolingData.length > 0) {
                setSelectedDolingId(sortedDolingData[0].id);
            }

            // Jika ada doling yang dipilih, ambil data absensinya
            if (selectedDolingId) {
                const absensiData = await getAbsensiByDolingId(selectedDolingId);
                setAbsensiState(absensiData);
            } else if (sortedDolingData.length > 0) {
                // Jika tidak ada yang dipilih tapi ada data jadwal, ambil absensi dari jadwal terbaru
                const absensiData = await getAbsensiByDolingId(sortedDolingData[0].id);
                setAbsensiState(absensiData);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Gagal memuat data");
        } finally {
            setLoading(false);
        }
    }, [selectedDolingId, selectedTahun]);

    // Initial data fetching
    useEffect(() => {
        if (!initialDoling.length || !initialRiwayat.length || !initialRekapitulasi.length || !initialKeluarga.length) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [fetchData, initialDoling.length, initialRiwayat.length, initialRekapitulasi.length, initialKeluarga.length]);

    // Filter jadwal berdasarkan pencarian dan bulan/tahun
    const filteredJadwal = jadwalState.filter(jadwal => {
        const jadwalDate = new Date(jadwal.tanggal);
        const jadwalYear = jadwalDate.getFullYear().toString();
        const jadwalMonth = (jadwalDate.getMonth() + 1).toString();

        const matchesSearch = searchTerm === "" ||
            jadwal.tuanRumah.toLowerCase().includes(searchTerm.toLowerCase()) ||
            jadwal.alamat.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDate =
            (selectedTahun === "all" || jadwalYear === selectedTahun) &&
            (selectedBulan === "all" || jadwalMonth === selectedBulan);

        return matchesSearch && matchesDate;
    });

    // Simulasi notifikasi reminder
    useEffect(() => {
        setupReminderNotifications(jadwalState);
    }, [jadwalState]);

    // Log when tab changes
    useEffect(() => {
        // Tab changed - no need to log in production
    }, [activeTab, userRole]);

    // Effect untuk mengambil data absensi saat dolingId dipilih
    useEffect(() => {
        if (selectedDolingId) {
            const fetchAbsensiData = async () => {
                try {
                    const absensiData = await getAbsensiByDolingId(selectedDolingId);
                    setAbsensiState(absensiData);
                } catch (error) {
                    console.error("Error fetching absensi data:", error);
                    toast.error("Gagal memuat data absensi");
                }
            };
            
            fetchAbsensiData();
        }
    }, [selectedDolingId]);

    // Fetch data termasuk absensi saat tab absensi aktif
    useEffect(() => {
        if (activeTab === "absensi-doling") {
            // Muat semua data absensi saat pertama kali tab absensi ditampilkan
            const fetchAllAbsensiData = async () => {
                try {
                    // Jika tidak ada doling yang dipilih, ambil absensi dari jadwal terbaru
                    if (!selectedDolingId && jadwalState.length > 0) {
                        // Dapatkan jadwal terbaru (paling atas dalam daftar)
                        const latestDoling = jadwalState[0]; 
                        setSelectedDolingId(latestDoling.id);
                        const absensiData = await getAbsensiByDolingId(latestDoling.id);
                        setAbsensiState(absensiData);
                    } else if (selectedDolingId) {
                        // Jika sudah ada doling yang dipilih, muat datanya
                        const absensiData = await getAbsensiByDolingId(selectedDolingId);
                        setAbsensiState(absensiData);
                    }
                } catch (error) {
                    console.error("Error fetching absensi data:", error);
                }
            };
            
            fetchAllAbsensiData();
        }
    }, [activeTab, jadwalState, selectedDolingId]);

    // Event handlers - Jadwal Doling ------------------------------------------

    const handleAddJadwal = () => {
        setEditingJadwal(undefined);
        setJadwalFormOpen(true);
    };

    const handleEditJadwal = (jadwal: JadwalDoling) => {
        setEditingJadwal(jadwal);
        setJadwalFormOpen(true);
    };

    const handleDeleteJadwal = async (id: string) => {
        try {
            await deleteDoling(id);
            toast.success("Jadwal berhasil dihapus");
            fetchData(); // Refresh data
        } catch (error) {
            console.error("Error deleting jadwal:", error);
            toast.error("Gagal menghapus jadwal");
        }
    };

    const handleResetKepalaKeluarga = async () => {
        try {
            // Ambil data keluarga dari server
            const keluargaData = await getKeluargaForSelection();
            setKepalaKeluargaState(keluargaData);
            toast.success("Reset berhasil. Semua kepala keluarga dapat dipilih kembali.");
        } catch (error) {
            console.error("Error resetting kepala keluarga:", error);
            toast.error("Gagal melakukan reset kepala keluarga");
        }
    };

    const handleSubmitJadwal = async (values: {
        tanggal: Date;
        tuanRumahId: string;
        jenisIbadat: JenisIbadat;
        subIbadat?: SubIbadat | null;
        customSubIbadat?: string | null;
        temaIbadat?: string | null;
    }) => {
        try {
            console.log("DoaLingkunganContent menerima nilai form:", values);
            
            if (editingJadwal) {
                // Edit existing - tidak ada fungsi update jadwal, akan menggunakan deleteDoling dan addDoling
                await deleteDoling(editingJadwal.id);
                await addDoling({
                    tanggal: values.tanggal,
                    tuanRumahId: values.tuanRumahId,
                    jenisIbadat: values.jenisIbadat,
                    subIbadat: values.subIbadat || undefined,
                    customSubIbadat: values.customSubIbadat || undefined,
                    temaIbadat: values.temaIbadat || undefined
                });
                toast.success("Jadwal berhasil diperbarui");
            } else {
                // Add new
                await addDoling({
                    tanggal: values.tanggal,
                    tuanRumahId: values.tuanRumahId,
                    jenisIbadat: values.jenisIbadat,
                    subIbadat: values.subIbadat || undefined,
                    customSubIbadat: values.customSubIbadat || undefined,
                    temaIbadat: values.temaIbadat || undefined
                });
                toast.success("Jadwal baru berhasil ditambahkan");
            }
            setJadwalFormOpen(false);
            fetchData(); // Refresh data
        } catch (error) {
            console.error("Error submitting jadwal:", error);
            toast.error("Gagal menyimpan jadwal");
        }
    };

    // Event handlers - Detil Doling -------------------------------------------

    const handleAddDetil = () => {
        setEditingDetil(undefined);
        setDetilFormOpen(true);
    };

    const handleEditDetil = (detil: DetilDoling) => {
        setEditingDetil(detil);
        setDetilFormOpen(true);
    };

    const handleDeleteDetil = async (id: string) => {
        try {
            await deleteDoling(id);
            toast.success("Detail doling berhasil dihapus");
            fetchData(); // Refresh data
        } catch (error) {
            console.error("Error deleting detail:", error);
            toast.error("Gagal menghapus detail");
        }
    };

    const handleApproveDetil = async (id: string) => {
        try {
            await updateApprovalStatus(id, StatusApproval.APPROVED);
            toast.success("Status doling berhasil disetujui");
            fetchData(); // Refresh data
        } catch (error) {
            console.error("Error approving detail:", error);
            toast.error("Gagal menyetujui status doling");
        }
    };

    const handleSubmitDetil = async (values: any) => {
        try {
            const { id, ...updateData } = values;
            await updateDolingDetail(id, updateData);
            toast.success("Detail doling berhasil diperbarui");
            setDetilFormOpen(false);
            fetchData(); // Refresh data
        } catch (error) {
            console.error("Error submitting detail:", error);
            toast.error("Gagal menyimpan detail");
        }
    };

    // Event handlers - Absensi Doling -----------------------------------------

    const handleAddAbsensi = () => {
        setEditingAbsensi(undefined);
        setAbsensiFormOpen(true);
    };

    const handleEditAbsensi = (absensi: AbsensiDoling) => {
        setEditingAbsensi(absensi);
        setAbsensiFormOpen(true);
    };

    const handleSubmitAbsensi = async (values: { 
        doaLingkunganId: string, 
        absensiData: { 
            keluargaId: string, 
            hadir: boolean, 
            statusKehadiran: string 
        }[] 
    }) => {
        try {
            // Set doling ID yang aktif dulu
            setSelectedDolingId(values.doaLingkunganId);
            
            // Kirim data ke server
            await updateAbsensi(values.doaLingkunganId, values.absensiData);
            
            // Ambil data absensi terbaru
            const absensiData = await getAbsensiByDolingId(values.doaLingkunganId);
            setAbsensiState(absensiData);
            
            // Jika tab saat ini bukan tab absensi, pindah ke tab absensi
            if (activeTab !== "absensi-doling") {
                setActiveTab("absensi-doling");
            }
            
            // Tutup form
            setAbsensiFormOpen(false);
            
            // Tampilkan pesan sukses
            toast.success("Data absensi berhasil diperbarui");
        } catch (error) {
            console.error("Error submitting absensi:", error);
            toast.error("Gagal menyimpan absensi");
        }
    };

    // Print PDF Jadwal ---------------------------------------------------------

    const handlePrintJadwal = () => {
        setPrintJadwalOpen(true);
    };

    const handleGeneratePDF = (
        startMonth: number,
        startYear: number,
        endMonth: number,
        endYear: number
    ) => {
        setPdfData({ startMonth, startYear, endMonth, endYear });
        setShowPDFPreview(true);
    };

    // Fungsi untuk memilih DolingId ketika mengklik pada tabel jadwal atau detil
    const handleSelectDolingId = (id: string) => {
        setSelectedDolingId(id);
    };

    // Render action buttons based on active tab
    const renderActionButtons = () => {
        switch (activeTab) {
            case "jadwal-doling":
                return (
                    <JadwalActionButtons
                        onAddJadwal={handleAddJadwal}
                        onResetKepalaKeluarga={handleResetKepalaKeluarga}
                        onPrintJadwal={handlePrintJadwal}
                    />
                );
            case "detil-doling":
                return null;
            case "absensi-doling":
                return <AbsensiActionButtons onAddAbsensi={handleAddAbsensi} userRole={userRole || undefined} />;
            default:
                return null;
        }
    };

    // Render tab menu
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Doa Lingkungan</h2>
            
            {/* Summary Cards */}
            <JadwalDolingCards jadwalState={jadwalState} />
            
            {/* Main Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="">
                    <TabsTrigger value="jadwal-doling" className="text-xs sm:text-sm py-2">Jadwal</TabsTrigger>
                    <TabsTrigger value="detil-doling" className="text-xs sm:text-sm py-2">Detil</TabsTrigger>
                    <TabsTrigger value="absensi-doling" className="text-xs sm:text-sm py-2">Absensi</TabsTrigger>
                    <TabsTrigger value="riwayat-doling" className="text-xs sm:text-sm py-2">Riwayat</TabsTrigger>
                </TabsList>

                {/* Jadwal Doling Tab */}
                <TabsContent value="jadwal-doling" className="space-y-6">
                    <FilterSection
                        searchTerm={searchTerm}
                        selectedTahun={selectedTahun}
                        selectedBulan={selectedBulan}
                        onSearchTermChange={setSearchTerm}
                        onTahunChange={setSelectedTahun}
                        onBulanChange={setSelectedBulan}
                    />

                    {renderActionButtons()}
                    <JadwalDolingTable
                        jadwal={filteredJadwal}
                        onEdit={handleEditJadwal}
                        onDelete={handleDeleteJadwal}
                        onSelectDoling={handleSelectDolingId}
                    />
                </TabsContent>

                {/* Detil Doling Tab */}
                <TabsContent value="detil-doling">
                    {renderActionButtons()}
                    <DetilDolingTable
                        detil={detilState}
                        onEdit={handleEditDetil}
                        onDelete={handleDeleteDetil}
                        onApprove={handleApproveDetil}
                        onSelectDoling={handleSelectDolingId}
                    />
                </TabsContent>

                {/* Absensi Tab */}
                <TabsContent value="absensi-doling">
                    {renderActionButtons()}
                    
                    <AbsensiDolingTable
                        absensi={absensiState}
                        onEdit={handleEditAbsensi}
                        jadwalDoling={jadwalState}
                    />
                </TabsContent>

                {/* Riwayat Doling Tab */}
                <TabsContent value="riwayat-doling" className="space-y-4">
                    <RiwayatDolingContent 
                        riwayat={riwayatState} 
                        rekapitulasi={rekapitulasiState}
                        detilDolingData={detilState}
                        absensiDolingData={absensiState}
                    />
                </TabsContent>
            </Tabs>

            {/* Dialog Forms */}
            <JadwalDolingFormDialog
                open={jadwalFormOpen}
                onOpenChange={setJadwalFormOpen}
                jadwal={editingJadwal}
                onSubmit={handleSubmitJadwal}
                kepalaKeluarga={kepalaKeluargaState}
            />
            <DetilDolingFormDialog
                open={detilFormOpen}
                onOpenChange={setDetilFormOpen}
                detil={editingDetil}
                onSubmit={handleSubmitDetil}
                jadwalDoling={jadwalState}
            />
            <AbsensiDolingFormDialog
                open={absensiFormOpen}
                onOpenChange={setAbsensiFormOpen}
                absensi={editingAbsensi}
                onSubmit={handleSubmitAbsensi}
                detilDoling={detilState}
                jadwalDoling={jadwalState}
                keluargaList={kepalaKeluargaState}
            />
            <PrintJadwalDialog
                open={printJadwalOpen}
                onOpenChange={setPrintJadwalOpen}
                jadwal={jadwalState}
                onPrint={handleGeneratePDF}
            />
            <Dialog open={showPDFPreview} onOpenChange={setShowPDFPreview}>
                <DialogContent className="max-w-5xl max-h-screen overflow-auto">
                    <DialogHeader>
                        <DialogTitle>Preview PDF Jadwal Doling</DialogTitle>
                    </DialogHeader>
                    <JadwalDolingPDF
                        jadwal={jadwalState}
                        startMonth={pdfData.startMonth}
                        startYear={pdfData.startYear}
                        endMonth={pdfData.endMonth}
                        endYear={pdfData.endYear}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
} 