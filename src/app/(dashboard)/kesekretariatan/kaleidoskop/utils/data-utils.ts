import { DolingData } from "../types";

/**
 * Memfilter data berdasarkan periode
 */
export function filterDataByPeriode(
  data: DolingData[],
  bulanAwal: string,
  tahunAwal: string,
  bulanAkhir: string,
  tahunAkhir: string
): DolingData[] {
  const startDate = new Date(parseInt(tahunAwal), parseInt(bulanAwal), 1);
  
  // Set tanggal akhir ke hari terakhir bulan
  const endDate = new Date(parseInt(tahunAkhir), parseInt(bulanAkhir) + 1, 0);
  
  return data.filter((item) => {
    const itemDate = new Date(item.tanggal);
    return itemDate >= startDate && itemDate <= endDate;
  });
}

/**
 * Mengelompokkan data berdasarkan jenis ibadat dan sub ibadat
 * 
 * @returns Object dengan struktur { [jenisIbadat]: { [subIbadat]: count } }
 */
export function groupDataByJenisIbadat(data: DolingData[]): Record<string, Record<string, number>> {
  const result: Record<string, Record<string, number>> = {};
  
  data.forEach((item) => {
    // Jika jenis ibadat belum ada, inisialisasi
    if (!result[item.jenisIbadat]) {
      result[item.jenisIbadat] = {};
    }
    
    // Jika sub ibadat belum ada, inisialisasi dengan nilai 0
    if (!result[item.jenisIbadat][item.subIbadat]) {
      result[item.jenisIbadat][item.subIbadat] = 0;
    }
    
    // Increment counter
    result[item.jenisIbadat][item.subIbadat]++;
  });
  
  return result;
} 