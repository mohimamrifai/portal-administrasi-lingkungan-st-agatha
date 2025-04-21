"use client";

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { JadwalDolingTable } from "./components/jadwal-doling-table"
import { JadwalDolingFormDialog } from "./components/jadwal-doling-form-dialog"
import { DetilDolingTable } from "./components/detil-doling-table"
import { DetilDolingFormDialog } from "./components/detil-doling-form-dialog"
import { AbsensiDolingTable } from "./components/absensi-doling-table"
import { AbsensiDolingFormDialog } from "./components/absensi-doling-form-dialog"
import { RiwayatDolingContent } from "./components/riwayat-doling-content"
import { KaleidoskopContent } from "./components/kaleidoskop-content"
import { JadwalDoling, DetilDoling, AbsensiDoling, RiwayatDoling, RekapitulasiKegiatan, KaleidoskopData } from "./types"
import { toast } from "sonner"

// Mock data for Jadwal Doling
const mockJadwalDoling: JadwalDoling[] = [
  {
    id: 1,
    tanggal: new Date(2024, 3, 15),
    waktu: "19:00",
    tuanRumah: "Budi Santoso",
    alamat: "Jl. Merdeka No. 123",
    status: "terjadwal",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    tanggal: new Date(2024, 3, 22),
    waktu: "19:30",
    tuanRumah: "Ani Wijaya",
    alamat: "Jl. Sudirman No. 456",
    status: "terjadwal",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    tanggal: new Date(2024, 3, 8),
    waktu: "19:00",
    tuanRumah: "Joko Susilo",
    alamat: "Jl. Diponegoro No. 789",
    status: "selesai",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// Mock data for Detil Doling
const mockDetilDoling: DetilDoling[] = [
  {
    id: 1,
    tanggal: new Date(2024, 3, 8),
    tuanRumah: "Joko Susilo",
    jumlahHadir: 25,
    kegiatan: "Doa Rosario",
    status: "selesai",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    tanggal: new Date(2024, 3, 1),
    tuanRumah: "Siti Rahayu",
    jumlahHadir: 30,
    kegiatan: "Doa Bersama",
    status: "selesai",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// Mock data for Absensi Doling
const mockAbsensiDoling: AbsensiDoling[] = [
  {
    id: 1,
    nama: "Budi Santoso",
    kepalaKeluarga: true,
    kehadiran: "hadir",
    keterangan: "-",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    nama: "Ani Wijaya",
    kepalaKeluarga: false,
    kehadiran: "tidak-hadir",
    keterangan: "Sakit",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    nama: "Joko Susilo",
    kepalaKeluarga: true,
    kehadiran: "hadir",
    keterangan: "-",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// Mock data for Riwayat Doling
const mockRiwayatDoling: RiwayatDoling[] = [
  {
    nama: "Budi Santoso",
    totalHadir: 10,
    persentase: 90,
  },
  {
    nama: "Ani Wijaya",
    totalHadir: 8,
    persentase: 75,
  },
  {
    nama: "Joko Susilo",
    totalHadir: 12,
    persentase: 95,
  },
]

// Mock data for Rekapitulasi Kegiatan
const mockRekapitulasiKegiatan: RekapitulasiKegiatan[] = [
  {
    bulan: "April 2024",
    jumlahKegiatan: 4,
    rataRataHadir: 25,
  },
  {
    bulan: "Maret 2024",
    jumlahKegiatan: 4,
    rataRataHadir: 28,
  },
  {
    bulan: "Februari 2024",
    jumlahKegiatan: 4,
    rataRataHadir: 30,
  },
]

// Mock data for Kaleidoskop
const mockKaleidoskopData: KaleidoskopData = {
  totalKegiatan: 48,
  rataRataKehadiran: 85,
  totalKKAktif: 50,
}

export default function DoaLingkunganPage() {
  const [isJadwalFormDialogOpen, setIsJadwalFormDialogOpen] = useState(false)
  const [isDetilFormDialogOpen, setIsDetilFormDialogOpen] = useState(false)
  const [isAbsensiFormDialogOpen, setIsAbsensiFormDialogOpen] = useState(false)
  const [selectedJadwal, setSelectedJadwal] = useState<JadwalDoling | undefined>()
  const [selectedDetil, setSelectedDetil] = useState<DetilDoling | undefined>()
  const [selectedAbsensi, setSelectedAbsensi] = useState<AbsensiDoling | undefined>()
  const [jadwal, setJadwal] = useState<JadwalDoling[]>(mockJadwalDoling)
  const [detil, setDetil] = useState<DetilDoling[]>(mockDetilDoling)
  const [absensi, setAbsensi] = useState<AbsensiDoling[]>(mockAbsensiDoling)
  const [riwayat, setRiwayat] = useState<RiwayatDoling[]>(mockRiwayatDoling)
  const [rekapitulasi, setRekapitulasi] = useState<RekapitulasiKegiatan[]>(mockRekapitulasiKegiatan)
  const [kaleidoskop, setKaleidoskop] = useState<KaleidoskopData>(mockKaleidoskopData)

  // Jadwal Doling handlers
  const handleAddJadwal = async (values: Omit<JadwalDoling, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newJadwal: JadwalDoling = {
      id: jadwal.length + 1,
      ...values,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setJadwal([...jadwal, newJadwal])
    toast.success("Jadwal berhasil ditambahkan")
  }

  const handleEditJadwal = async (values: Omit<JadwalDoling, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedJadwal) return
    const updatedJadwal = jadwal.map((item) =>
      item.id === selectedJadwal.id
        ? { ...item, ...values, updatedAt: new Date() }
        : item
    )
    setJadwal(updatedJadwal)
    toast.success("Jadwal berhasil diperbarui")
  }

  const handleDeleteJadwal = async (id: number) => {
    setJadwal(jadwal.filter((item) => item.id !== id))
    toast.success("Jadwal berhasil dihapus")
  }

  // Detil Doling handlers
  const handleAddDetil = async (values: Omit<DetilDoling, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDetil: DetilDoling = {
      id: detil.length + 1,
      ...values,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setDetil([...detil, newDetil])
    toast.success("Detil kegiatan berhasil ditambahkan")
  }

  const handleEditDetil = async (values: Omit<DetilDoling, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedDetil) return
    const updatedDetil = detil.map((item) =>
      item.id === selectedDetil.id
        ? { ...item, ...values, updatedAt: new Date() }
        : item
    )
    setDetil(updatedDetil)
    toast.success("Detil kegiatan berhasil diperbarui")
  }

  const handleDeleteDetil = async (id: number) => {
    setDetil(detil.filter((item) => item.id !== id))
    toast.success("Detil kegiatan berhasil dihapus")
  }

  // Absensi handlers
  const handleAddAbsensi = async (values: Omit<AbsensiDoling, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAbsensi: AbsensiDoling = {
      id: absensi.length + 1,
      ...values,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setAbsensi([...absensi, newAbsensi])
    toast.success("Absensi berhasil ditambahkan")
  }

  const handleEditAbsensi = async (values: Omit<AbsensiDoling, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedAbsensi) return
    const updatedAbsensi = absensi.map((item) =>
      item.id === selectedAbsensi.id
        ? { ...item, ...values, updatedAt: new Date() }
        : item
    )
    setAbsensi(updatedAbsensi)
    toast.success("Absensi berhasil diperbarui")
  }

  return (
    <div className="container mx-auto py-6 space-y-6 px-4">
      <h1 className="text-2xl font-bold">Doa Lingkungan</h1>

      <Tabs defaultValue="jadwal" className="w-full">
        <TabsList>
          <TabsTrigger value="jadwal">Jadwal Doling</TabsTrigger>
          <TabsTrigger value="detil">Detil Doling</TabsTrigger>
          <TabsTrigger value="absensi">Absensi</TabsTrigger>
          <TabsTrigger value="riwayat">Riwayat Doling</TabsTrigger>
          <TabsTrigger value="kaleidoskop">Kaleidoskop</TabsTrigger>
        </TabsList>

        <TabsContent value="jadwal">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  setSelectedJadwal(undefined)
                  setIsJadwalFormDialogOpen(true)
                }}
              >
                Tambah Jadwal
              </Button>
            </div>
            <JadwalDolingTable
              jadwal={jadwal}
              onEdit={(jadwal) => {
                setSelectedJadwal(jadwal)
                setIsJadwalFormDialogOpen(true)
              }}
              onDelete={handleDeleteJadwal}
            />
          </div>
        </TabsContent>

        <TabsContent value="detil">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  setSelectedDetil(undefined)
                  setIsDetilFormDialogOpen(true)
                }}
              >
                Tambah Data
              </Button>
            </div>
            <DetilDolingTable
              detil={detil}
              onEdit={(detil) => {
                setSelectedDetil(detil)
                setIsDetilFormDialogOpen(true)
              }}
              onDelete={handleDeleteDetil}
            />
          </div>
        </TabsContent>

        <TabsContent value="absensi">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  setSelectedAbsensi(undefined)
                  setIsAbsensiFormDialogOpen(true)
                }}
              >
                Tambah Absensi
              </Button>
            </div>
            <AbsensiDolingTable
              absensi={absensi}
              onEdit={(absensi) => {
                setSelectedAbsensi(absensi)
                setIsAbsensiFormDialogOpen(true)
              }}
            />
          </div>
        </TabsContent>

        <TabsContent value="riwayat">
          <div className="space-y-4">
            <RiwayatDolingContent
              riwayat={riwayat}
              rekapitulasi={rekapitulasi}
            />
          </div>
        </TabsContent>

        <TabsContent value="kaleidoskop">
          <div className="space-y-4">
            <KaleidoskopContent data={kaleidoskop} />
          </div>
        </TabsContent>
      </Tabs>

      <JadwalDolingFormDialog
        open={isJadwalFormDialogOpen}
        onOpenChange={setIsJadwalFormDialogOpen}
        jadwal={selectedJadwal}
        onSubmit={selectedJadwal ? handleEditJadwal : handleAddJadwal}
      />

      <DetilDolingFormDialog
        open={isDetilFormDialogOpen}
        onOpenChange={setIsDetilFormDialogOpen}
        detil={selectedDetil}
        onSubmit={selectedDetil ? handleEditDetil : handleAddDetil}
      />

      <AbsensiDolingFormDialog
        open={isAbsensiFormDialogOpen}
        onOpenChange={setIsAbsensiFormDialogOpen}
        absensi={selectedAbsensi}
        onSubmit={selectedAbsensi ? handleEditAbsensi : handleAddAbsensi}
      />
    </div>
  )
} 