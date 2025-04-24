import { DataTypeOption, DataType, WipeStatus } from "../types"
import { toast } from "sonner"

// Daftar opsi jenis data yang tersedia
export const DATA_TYPE_OPTIONS: DataTypeOption[] = [
  { value: "publikasi", label: "Publikasi" },
  { value: "kas_lingkungan", label: "Kas Lingkungan" },
  { value: "dana_mandiri", label: "Dana Mandiri" },
  { value: "kas_ikata", label: "Kas IKATA" },
  { value: "doling", label: "Doa Lingkungan" },
  { value: "agenda", label: "Agenda" },
  { value: "semua", label: "Semua Data" }
]

// Interface untuk parameter fungsi wipeData
interface WipeDataParams {
  dataType: DataType
  startDate?: Date
  endDate?: Date
}

// Interface untuk parameter fungsi emergencyWipe
interface EmergencyWipeParams {
  confirmText: string
}

/**
 * Fungsi untuk menghapus data berdasarkan jenis dan rentang waktu
 * @param params Parameter penghapusan data
 * @returns Status penghapusan data
 */
export const wipeData = async (params: WipeDataParams): Promise<WipeStatus> => {
  const { dataType, startDate, endDate } = params
  
  // Implementasi penghapusan data sebenarnya akan dilakukan di sini
  // Untuk saat ini, ini hanya simulasi
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const dataLabel = dataType === "semua" 
        ? "semua" 
        : DATA_TYPE_OPTIONS.find(item => item.value === dataType)?.label || dataType
      
      toast.success(`Data ${dataLabel} berhasil dihapus`)
      
      resolve({
        isProcessing: false,
        success: true,
        message: `Data ${dataLabel} berhasil dihapus`
      })
    }, 2000)
  })
}

/**
 * Fungsi untuk melakukan emergency wipe (penghapusan semua data)
 * @param params Parameter emergency wipe
 * @returns Status penghapusan data
 */
export const emergencyWipe = async (params: EmergencyWipeParams): Promise<WipeStatus> => {
  const { confirmText } = params
  
  if (confirmText !== "EMERGENCY WIPE") {
    return {
      isProcessing: false,
      success: false,
      message: "Konfirmasi tidak valid"
    }
  }
  
  // Implementasi emergency wipe sebenarnya akan dilakukan di sini
  // Untuk saat ini, ini hanya simulasi
  
  return new Promise((resolve) => {
    setTimeout(() => {
      toast.success("Semua data berhasil dihapus")
      
      resolve({
        isProcessing: false,
        success: true,
        message: "Semua data berhasil dihapus"
      })
    }, 3000)
  })
}

/**
 * Fungsi untuk mendapatkan label dari jenis data
 * @param dataType Jenis data
 * @returns Label jenis data
 */
export const getDataTypeLabel = (dataType: DataType): string => {
  return dataType === "semua"
    ? "semua"
    : DATA_TYPE_OPTIONS.find(item => item.value === dataType)?.label || dataType
} 