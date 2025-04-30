"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JadwalDolingTable } from "./jadwal-doling-table";
import { DetilDolingTable } from "./detil-doling-table";
import { AbsensiDolingTable } from "./absensi-doling-table";
import { RiwayatDolingContent } from "./riwayat-doling-content";
import { JadwalDolingFormDialog } from "./jadwal-doling-form-dialog";
import { DetilDolingFormDialog } from "./detail-dolling-form-dialog";
import { AbsensiDolingFormDialog } from "./absensi-doling-form-dialog";
import { PrintJadwalDialog } from "./print-jadwal-dialog";
import { JadwalDolingPDF } from "./jadwal-doling-pdf";
import { toast } from "sonner";
import { JadwalDoling, DetilDoling, AbsensiDoling } from "../types";
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

// Import data and utils
import {
    jadwalDolingData,
    detilDolingData,
    absensiDolingData,
    kepalaKeluargaData,
    riwayatDolingData,
    rekapitulasiData,
} from "../utils/mock-data";

import { setupReminderNotifications } from "../utils/reminder-notifications";

export function DoaLingkunganContent() {
    // Tab state
    const [activeTab, setActiveTab] = useState("jadwal-doling");

    // Data state
    const [jadwalState, setJadwalState] = useState<JadwalDoling[]>(jadwalDolingData);
    const [detilState, setDetilState] = useState<DetilDoling[]>(detilDolingData);
    const [absensiState, setAbsensiState] = useState<AbsensiDoling[]>(absensiDolingData);
    const [kepalaKeluargaState, setKepalaKeluargaState] = useState(kepalaKeluargaData);

    // Filter state
    const [showSudahTerpilih, setShowSudahTerpilih] = useState(false);
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

    // Filter kepala keluarga yang sudah/belum terpilih
    const filteredKepalaKeluarga = kepalaKeluargaState.filter(item =>
        showSudahTerpilih ? true : !item.sudahTerpilih
    );

    // Filter jadwal berdasarkan pencarian dan bulan/tahun
    const filteredJadwal = jadwalState.filter(jadwal => {
        const jadwalDate = jadwal.tanggal;
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

    // Event handlers - Jadwal Doling ------------------------------------------

    const handleAddJadwal = () => {
        setEditingJadwal(undefined);
        setJadwalFormOpen(true);
    };

    const handleEditJadwal = (jadwal: JadwalDoling) => {
        setEditingJadwal(jadwal);
        setJadwalFormOpen(true);
    };

    const handleDeleteJadwal = (id: number) => {
        setJadwalState(jadwalState.filter(item => item.id !== id));
        toast.success("Jadwal berhasil dihapus");
    };

    const handleResetKepalaKeluarga = () => {
        setKepalaKeluargaState(
            kepalaKeluargaState.map(item => ({ ...item, sudahTerpilih: false }))
        );
        toast.success("Reset berhasil. Semua kepala keluarga dapat dipilih kembali.");
    };

    const handleSubmitJadwal = (values: Omit<JadwalDoling, 'id' | 'createdAt' | 'updatedAt'>) => {
        if (editingJadwal) {
            // Edit existing
            setJadwalState(jadwalState.map(item =>
                item.id === editingJadwal.id
                    ? { ...item, ...values, updatedAt: new Date() }
                    : item
            ));
            toast.success("Jadwal berhasil diperbarui");
        } else {
            // Add new
            const newJadwal: JadwalDoling = {
                id: Math.max(0, ...jadwalState.map(item => item.id)) + 1,
                ...values,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            setJadwalState([...jadwalState, newJadwal]);

            // Update status kepala keluarga yang terpilih
            if (values.tuanRumahId) {
                setKepalaKeluargaState(
                    kepalaKeluargaState.map(item =>
                        item.id === values.tuanRumahId
                            ? { ...item, sudahTerpilih: true }
                            : item
                    )
                );
            }

            toast.success("Jadwal baru berhasil ditambahkan");
        }
        setJadwalFormOpen(false);
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

    const handleDeleteDetil = (id: number) => {
        setDetilState(detilState.filter(item => item.id !== id));
        toast.success("Detail doling berhasil dihapus");
    };

    const handleSubmitDetil = (values: Omit<DetilDoling, 'id' | 'createdAt' | 'updatedAt'>) => {
        if (editingDetil) {
            // Edit existing
            setDetilState(detilState.map(item =>
                item.id === editingDetil.id
                    ? { ...item, ...values, updatedAt: new Date() }
                    : item
            ));
            toast.success("Detail doling berhasil diperbarui");
        } else {
            // Add new
            const newDetil: DetilDoling = {
                id: Math.max(0, ...detilState.map(item => item.id)) + 1,
                ...values,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            setDetilState([...detilState, newDetil]);
            toast.success("Detail doling baru berhasil ditambahkan");
        }
        setDetilFormOpen(false);
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

    const handleSubmitAbsensi = (values: Omit<AbsensiDoling, 'id' | 'createdAt' | 'updatedAt'>) => {
        if (editingAbsensi) {
            // Edit existing
            setAbsensiState(absensiState.map(item =>
                item.id === editingAbsensi.id
                    ? { ...item, ...values, updatedAt: new Date() }
                    : item
            ));
            toast.success("Data absensi berhasil diperbarui");
        } else {
            // Add new
            const newAbsensi: AbsensiDoling = {
                id: Math.max(0, ...absensiState.map(item => item.id)) + 1,
                ...values,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            setAbsensiState([...absensiState, newAbsensi]);
            toast.success("Data absensi baru berhasil ditambahkan");
        }
        setAbsensiFormOpen(false);
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
                return <DetilActionButtons onAddDetil={handleAddDetil} />;
            case "absensi-doling":
                return <AbsensiActionButtons onAddAbsensi={handleAddAbsensi} />;
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
                        showSudahTerpilih={showSudahTerpilih}
                        onSearchTermChange={setSearchTerm}
                        onTahunChange={setSelectedTahun}
                        onBulanChange={setSelectedBulan}
                        onShowSudahTerpilihChange={setShowSudahTerpilih}
                    />

                    {renderActionButtons()}
                    <JadwalDolingTable
                        jadwal={filteredJadwal}
                        onEdit={handleEditJadwal}
                        onDelete={handleDeleteJadwal}
                    />
                </TabsContent>

                {/* Detil Doling Tab */}
                <TabsContent value="detil-doling">
                    <DetilDolingTable
                        detil={detilState}
                        onEdit={handleEditDetil}
                        onDelete={handleDeleteDetil}
                    />
                </TabsContent>

                {/* Absensi Tab */}
                <TabsContent value="absensi-doling">
                    <AbsensiDolingTable
                        absensi={absensiState}
                        onEdit={handleEditAbsensi}
                    />
                </TabsContent>

                {/* Riwayat Doling Tab */}
                <TabsContent value="riwayat-doling" className="space-y-4">
                    <RiwayatDolingContent 
                        riwayat={riwayatDolingData} 
                        rekapitulasi={rekapitulasiData}
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