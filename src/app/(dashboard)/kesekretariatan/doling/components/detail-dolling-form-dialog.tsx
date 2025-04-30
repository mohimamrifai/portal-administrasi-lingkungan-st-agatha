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
import { PetugasMisaSection } from "./petugas-misa"
import { KeteranganStatusSection } from "./keterangan-status"
import { JenisIbadat, DetilDolingFormDialogProps } from "../types/form-types"
import { DetilDoling } from "../types"
import { toast } from "sonner"

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
  const [subIbadat, setSubIbadat] = useState<string>(detil?.subIbadat || "ibadat-sabda")
  const [temaIbadat, setTemaIbadat] = useState<string>(detil?.temaIbadat || "")
  const [keterangan, setKeterangan] = useState<string>(detil?.keterangan || "")
  const [status, setStatus] = useState<DetilDoling['status']>(detil?.status || "selesai")
  
  const [jumlahKehadiran, setJumlahKehadiran] = useState({
    totalHadir: detil?.jumlahHadir || 0,
    jumlahKKHadir: detil?.jumlahKKHadir || 0,
    bapak: detil?.jumlahBapak || 0,
    ibu: detil?.jumlahIbu || 0,
    omk: detil?.jumlahOMK || 0,
    biaKecil: detil?.jumlahBIAKecil || 0,
    biaBesar: detil?.jumlahBIABesar || 0,
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
    renungan: detil?.pembawaRenungan || "",
    lagu: detil?.petugasLagu || "",
    doaUmat: detil?.petugasDoaUmat || "",
    bacaan: detil?.petugasBacaan || "",
  })
  
  const [petugasMisa, setPetugasMisa] = useState({
    pemimpin: detil?.pemimpinMisa || "",
    bacaanPertama: detil?.bacaanPertama || "",
    pemazmur: detil?.pemazmur || "",
    jumlahPeserta: detil?.jumlahPeserta || 0,
  })
  
  // Update all values when detil changes
  useEffect(() => {
    if (detil) {
      setSelectedJadwal(detil.jadwalId?.toString() || "manual");
      setTanggalValue(format(detil.tanggal, 'yyyy-MM-dd'));
      setTuanRumahValue(detil.tuanRumah || "");
      setJenisIbadat(detil.jenisIbadat as JenisIbadat || "doa-lingkungan");
      setSubIbadat(detil.subIbadat || "ibadat-sabda");
      setTemaIbadat(detil.temaIbadat || "");
      setKeterangan(detil.keterangan || "");
      setStatus(detil.status || "selesai");
      
      setJumlahKehadiran({
        totalHadir: detil.jumlahHadir || 0,
        jumlahKKHadir: detil.jumlahKKHadir || 0,
        bapak: detil.jumlahBapak || 0,
        ibu: detil.jumlahIbu || 0,
        omk: detil.jumlahOMK || 0,
        biaKecil: detil.jumlahBIAKecil || 0,
        biaBesar: detil.jumlahBIABesar || 0,
        bir: detil.jumlahBIR || 0,
      });
      
      setKolekteData({
        kolekte1: detil.kolekte1 || 0,
        kolekte2: detil.kolekte2 || 0,
        ucapanSyukur: detil.ucapanSyukur || 0,
      });
      
      setPetugasLiturgi({
        pemimpin: detil.pemimpinLiturgi || "",
        rosario: detil.petugasRosario || "",
        renungan: detil.pembawaRenungan || "",
        lagu: detil.petugasLagu || "",
        doaUmat: detil.petugasDoaUmat || "",
        bacaan: detil.petugasBacaan || "",
      });
      
      setPetugasMisa({
        pemimpin: detil.pemimpinMisa || "",
        bacaanPertama: detil.bacaanPertama || "",
        pemazmur: detil.pemazmur || "",
        jumlahPeserta: detil.jumlahPeserta || 0,
      });
    }
  }, [detil]);
  
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
    if (jenisIbadat === "doa-lingkungan") {
      setSubIbadat("ibadat-sabda");
    } else if (jenisIbadat === "misa") {
      setSubIbadat("misa-syukur");
    } else {
      setSubIbadat("");
    }
  }, [jenisIbadat]);
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Extract form data
    const submitData: Omit<DetilDoling, 'id' | 'createdAt' | 'updatedAt'> = {
      jadwalId: selectedJadwal && selectedJadwal !== "manual" ? parseInt(selectedJadwal) : undefined,
      tanggal: new Date(formData.get('tanggal') as string),
      tuanRumah: formData.get('tuanRumah') as string,
      jumlahHadir: parseInt(formData.get('totalHadir') as string || "0"),
      jenisIbadat: formData.get('jenisIbadat') as string,
      subIbadat: formData.get('subIbadat') as string || "",
      temaIbadat: formData.get('temaIbadat') as string || "",
      kegiatan: `${jenisIbadat} - ${subIbadat}`,
      status: status,
      sudahDiapprove: false,
      keterangan: keterangan,
    };
    
    // Tambahkan data berdasarkan jenis ibadat
    if (jenisIbadat === "doa-lingkungan") {
      submitData.jumlahKKHadir = jumlahKehadiran.jumlahKKHadir;
      submitData.jumlahBapak = jumlahKehadiran.bapak;
      submitData.jumlahIbu = jumlahKehadiran.ibu;
      submitData.jumlahOMK = jumlahKehadiran.omk;
      submitData.jumlahBIAKecil = jumlahKehadiran.biaKecil;
      submitData.jumlahBIABesar = jumlahKehadiran.biaBesar;
      submitData.jumlahBIR = jumlahKehadiran.bir;
      
      submitData.pemimpinLiturgi = petugasLiturgi.pemimpin;
      submitData.petugasRosario = petugasLiturgi.rosario;
      submitData.pembawaRenungan = petugasLiturgi.renungan;
      submitData.petugasLagu = petugasLiturgi.lagu;
      submitData.petugasDoaUmat = petugasLiturgi.doaUmat;
      submitData.petugasBacaan = petugasLiturgi.bacaan;
      
      submitData.kolekte1 = kolekteData.kolekte1;
      submitData.kolekte2 = kolekteData.kolekte2;
      submitData.ucapanSyukur = kolekteData.ucapanSyukur;
      submitData.koleksi = kolekteData.kolekte1 + kolekteData.kolekte2 + kolekteData.ucapanSyukur;
    } 
    else if (jenisIbadat === "misa") {
      submitData.pemimpinMisa = petugasMisa.pemimpin;
      submitData.bacaanPertama = petugasMisa.bacaanPertama;
      submitData.pemazmur = petugasMisa.pemazmur;
      submitData.jumlahPeserta = petugasMisa.jumlahPeserta;
      
      submitData.kolekte1 = kolekteData.kolekte1;
      submitData.kolekte2 = kolekteData.kolekte2;
      submitData.ucapanSyukur = kolekteData.ucapanSyukur;
      submitData.koleksi = kolekteData.kolekte1 + kolekteData.kolekte2 + kolekteData.ucapanSyukur;
    }
    
    // Tampilkan notifikasi sesuai brief
    toast.success("Data berhasil disimpan", {
      description: `Data doling untuk ${submitData.jenisIbadat} pada tanggal ${format(submitData.tanggal, 'dd MMMM yyyy')}`,
    });
    
    onSubmit(submitData);
  };
  
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
  
  // Handle input untuk petugas misa
  const handlePetugasMisaChange = (field: 'pemimpin' | 'bacaanPertama' | 'pemazmur', value: string): void => {
    setPetugasMisa(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle jumlah peserta misa
  const handleJumlahPesertaChange = (value: number): void => {
    setPetugasMisa(prev => ({
      ...prev,
      jumlahPeserta: value
    }));
  };
  
  // Handle keterangan change
  const handleKeteranganChange = (value: string): void => {
    setKeterangan(value);
  };

  // Cek apakah perlu menampilkan field tertentu berdasarkan jenis ibadat
  const shouldShowSubIbadat = jenisIbadat === "doa-lingkungan" || jenisIbadat === "misa";
  const shouldShowTemaIbadat = jenisIbadat === "doa-lingkungan";
  const shouldShowTuanRumah = jenisIbadat === "doa-lingkungan" || jenisIbadat === "misa";
  const shouldShowJumlahKK = jenisIbadat === "doa-lingkungan" || jenisIbadat === "misa";
  const shouldShowKehadiran = jenisIbadat === "doa-lingkungan";
  const shouldShowKolekte = jenisIbadat === "doa-lingkungan" || jenisIbadat === "misa";
  const shouldShowPetugasLiturgi = jenisIbadat === "doa-lingkungan";
  const shouldShowPetugasMisa = jenisIbadat === "misa";
  const shouldShowPemimpinRosario = jenisIbadat !== "doa-lingkungan";
  const shouldShowJumlahPeserta = jenisIbadat === "misa";

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
            temaIbadat={temaIbadat}
            jadwalDoling={jadwalDoling}
            onSelectedJadwalChange={setSelectedJadwal}
            onTanggalValueChange={setTanggalValue}
            onTuanRumahValueChange={setTuanRumahValue}
            onJenisIbadatChange={setJenisIbadat}
            onSubIbadatChange={setSubIbadat}
            onTemaIbadatChange={setTemaIbadat}
            shouldShowSubIbadat={shouldShowSubIbadat}
            shouldShowTemaIbadat={shouldShowTemaIbadat}
            shouldShowTuanRumah={shouldShowTuanRumah}
            hideJadwalSelect={!!detil}
          />
          
          {/* Data Kehadiran (hanya untuk doa lingkungan) */}
          {shouldShowKehadiran && (
            <DataKehadiranSection 
              jumlahKehadiran={jumlahKehadiran}
              onKehadiranChange={handleKehadiranChange}
            />
          )}
          
          {/* Persembahan/Kolekte (hanya untuk doa lingkungan atau misa) */}
          {shouldShowKolekte && (
            <KolekteSection 
              kolekteData={kolekteData}
              onKolekteChange={handleKolekteChange}
            />
          )}
          
          {/* Petugas Liturgi (hanya untuk doa lingkungan) */}
          {shouldShowPetugasLiturgi && (
            <PetugasLiturgiSection 
              petugasLiturgi={petugasLiturgi}
              onPetugasLiturgiChange={handlePetugasLiturgiChange}
              shouldShowPemimpinRosario={!shouldShowPemimpinRosario}
            />
          )}
          
          {/* Petugas Misa (hanya untuk misa) */}
          {shouldShowPetugasMisa && (
            <PetugasMisaSection 
              petugasMisa={petugasMisa}
              onPetugasMisaChange={handlePetugasMisaChange}
              onJumlahPesertaChange={handleJumlahPesertaChange}
            />
          )}
          
          {/* Keterangan Status */}
          <KeteranganStatusSection 
            status={status}
            onStatusChange={setStatus}
            keterangan={keterangan}
            onKeteranganChange={handleKeteranganChange}
          />
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 