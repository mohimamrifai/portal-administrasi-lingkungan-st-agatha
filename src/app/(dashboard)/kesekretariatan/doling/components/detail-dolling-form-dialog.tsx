"use client";

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { InformasiDasarSection } from "./informasi-dasar"
import { DataKehadiranSection } from "./data-kehadiran"
import { KolekteSection } from "./kolekte-section"
import { PetugasLiturgiSection } from "./petugas-liturgi"
import { KeteranganStatusSection } from "./keterangan-status"
import { JenisIbadat, DetilDolingFormDialogProps } from "../types/form-types"
import { DetilDoling } from "../types"

export function DetilDolingFormDialog({
  open,
  onOpenChange,
  detil,
  onSubmit,
  jadwalDoling,
}: DetilDolingFormDialogProps) {
  const [selectedJadwal, setSelectedJadwal] = useState<string>(detil?.jadwalId?.toString() || "manual")
  const [tanggalValue, setTanggalValue] = useState<string>(detil ? format(detil.tanggal, 'yyyy-MM-dd') : "")
  const [tuanRumahValue, setTuanRumahValue] = useState<string>(detil?.tuanRumah || "")
  const [jenisIbadat, setJenisIbadat] = useState<JenisIbadat>(detil?.jenisIbadat as JenisIbadat || "doa-lingkungan")
  const [subIbadat, setSubIbadat] = useState<string>(detil?.subIbadat || "umum")
  const [status, setStatus] = useState<DetilDoling['status']>(detil?.status || "selesai")
  
  const [jumlahKehadiran, setJumlahKehadiran] = useState({
    totalHadir: detil?.jumlahHadir || 0,
    bapak: detil?.jumlahBapak || 0,
    ibu: detil?.jumlahIbu || 0,
    omk: detil?.jumlahOMK || 0,
    bia: detil?.jumlahBIA || 0,
    bir: detil?.jumlahBIR || 0,
  })
  
  const [kolekteData, setKolekteData] = useState({
    kolekte1: detil?.kolekte1 || 0,
    kolekte2: detil?.kolekte2 || 0,
    ucapanSyukur: detil?.ucapanSyukur || 0,
  })
  
  const [petugasLiturgi, setPetugasLiturgi] = useState({
    pemimpin: detil?.pemimpinLiturgi || "",
    rosario: detil?.petugasRosario || "",
    lagu: detil?.petugasLagu || "",
    bacaan: detil?.petugasBacaan || "",
  })
  
  useEffect(() => {
    if (selectedJadwal && jadwalDoling.length > 0 && selectedJadwal !== "manual") {
      const jadwal = jadwalDoling.find(j => j.id.toString() === selectedJadwal);
      if (jadwal) {
        setTanggalValue(format(jadwal.tanggal, 'yyyy-MM-dd'));
        setTuanRumahValue(jadwal.tuanRumah);
      }
    }
  }, [selectedJadwal, jadwalDoling]);
  
  // Reset sub-ibadat ketika jenis ibadat berubah
  useEffect(() => {
    if (jenisIbadat) {
      setSubIbadat("umum"); // Default value
    }
  }, [jenisIbadat]);
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    // Extract form data
    const submitData: Omit<DetilDoling, 'id' | 'createdAt' | 'updatedAt'> = {
      jadwalId: selectedJadwal && selectedJadwal !== "manual" ? parseInt(selectedJadwal) : undefined,
      tanggal: new Date(formData.get('tanggal') as string),
      tuanRumah: formData.get('tuanRumah') as string,
      jumlahHadir: parseInt(formData.get('totalHadir') as string || "0"),
      jenisIbadat: formData.get('jenisIbadat') as string,
      subIbadat: formData.get('subIbadat') as string,
      temaIbadat: formData.get('temaIbadat') as string || "",
      kegiatan: `${jenisIbadat} - ${subIbadat}`,
      status: status,
      sudahDiapprove: false,
      keterangan: formData.get('keterangan') as string || "",
    }
    
    // Tambahkan data kehadiran jika jenis ibadat adalah doa lingkungan
    if (jenisIbadat === "doa-lingkungan") {
      submitData.jumlahBapak = jumlahKehadiran.bapak;
      submitData.jumlahIbu = jumlahKehadiran.ibu;
      submitData.jumlahOMK = jumlahKehadiran.omk;
      submitData.jumlahBIA = jumlahKehadiran.bia;
      submitData.jumlahBIR = jumlahKehadiran.bir;
      
      submitData.pemimpinLiturgi = petugasLiturgi.pemimpin;
      submitData.petugasRosario = petugasLiturgi.rosario;
      submitData.petugasLagu = petugasLiturgi.lagu;
      submitData.petugasBacaan = petugasLiturgi.bacaan;
    }
    
    // Tambahkan data kolekte jika relevan
    if (jenisIbadat === "doa-lingkungan" || jenisIbadat === "misa") {
      submitData.kolekte1 = kolekteData.kolekte1;
      submitData.kolekte2 = kolekteData.kolekte2;
      submitData.ucapanSyukur = kolekteData.ucapanSyukur;
      submitData.koleksi = kolekteData.kolekte1 + kolekteData.kolekte2 + kolekteData.ucapanSyukur;
    }
    
    onSubmit(submitData);
  }
  
  // Handle input number untuk kolekte
  const handleKolekteChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof kolekteData): void => {
    const value = parseInt(e.target.value || "0");
    setKolekteData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle input number untuk kehadiran
  const handleKehadiranChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof jumlahKehadiran): void => {
    const value = parseInt(e.target.value || "0");
    setJumlahKehadiran(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle input untuk petugas liturgi
  const handlePetugasLiturgiChange = (field: keyof typeof petugasLiturgi, value: string): void => {
    setPetugasLiturgi(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[700px] w-full mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {detil ? 'Edit Detil Doling' : 'Tambah Detil Doling'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informasi Dasar */}
          <InformasiDasarSection 
            selectedJadwal={selectedJadwal}
            tanggalValue={tanggalValue}
            tuanRumahValue={tuanRumahValue}
            jenisIbadat={jenisIbadat}
            subIbadat={subIbadat}
            temaIbadat={detil?.temaIbadat}
            jadwalDoling={jadwalDoling}
            onSelectedJadwalChange={setSelectedJadwal}
            onTanggalValueChange={setTanggalValue}
            onTuanRumahValueChange={setTuanRumahValue}
            onJenisIbadatChange={setJenisIbadat}
            onSubIbadatChange={setSubIbadat}
          />
          
          {/* Data Kehadiran (hanya untuk doa lingkungan) */}
          {jenisIbadat === "doa-lingkungan" && (
            <DataKehadiranSection 
              jumlahKehadiran={jumlahKehadiran}
              onKehadiranChange={handleKehadiranChange}
            />
          )}
          
          {/* Persembahan/Kolekte (hanya untuk doa lingkungan atau misa) */}
          {(jenisIbadat === "doa-lingkungan" || jenisIbadat === "misa") && (
            <KolekteSection 
              kolekteData={kolekteData}
              onKolekteChange={handleKolekteChange}
            />
          )}
          
          {/* Petugas Liturgi (hanya untuk doa lingkungan) */}
          {jenisIbadat === "doa-lingkungan" && (
            <PetugasLiturgiSection 
              petugasLiturgi={petugasLiturgi}
              onPetugasLiturgiChange={handlePetugasLiturgiChange}
            />
          )}
          
          {/* Keterangan dan Status */}
          <KeteranganStatusSection 
            keterangan={detil?.keterangan}
            status={status}
            onStatusChange={setStatus}
          />
          
          <div className="flex justify-end space-x-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit">
              {detil ? 'Simpan Perubahan' : 'Tambah'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 