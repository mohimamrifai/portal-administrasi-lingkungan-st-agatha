import { KaleidoskopActivityData } from "../actions";
import { JenisIbadat, SubIbadat } from "@prisma/client";

/**
 * Memfilter data kaleidoskop berdasarkan rentang periode
 */
export function filterDataByPeriode(
  data: KaleidoskopActivityData[],
  bulanAwal: string,
  tahunAwal: string,
  bulanAkhir: string,
  tahunAkhir: string
): KaleidoskopActivityData[] {
  // Konversi ke tipe numerik
  const startMonth = parseInt(bulanAwal);
  const startYear = parseInt(tahunAwal);
  const endMonth = parseInt(bulanAkhir);
  const endYear = parseInt(tahunAkhir);

  // Buat tanggal awal dan akhir
  const startDate = new Date(startYear, startMonth, 1);
  const endDate = new Date(endYear, endMonth + 1, 0); // Hari terakhir bulan

  // Filter data berdasarkan tanggal
  return data.filter(item => {
    const itemDate = new Date(item.tanggal);
    return itemDate >= startDate && itemDate <= endDate;
  });
}

/**
 * Mengubah enum JenisIbadat menjadi string yang mudah dibaca
 */
export function formatJenisIbadat(jenisIbadat: JenisIbadat): string {
  const mapping: Record<JenisIbadat, string> = {
    [JenisIbadat.DOA_LINGKUNGAN]: "Doa Lingkungan",
    [JenisIbadat.MISA]: "Misa",
    [JenisIbadat.PERTEMUAN]: "Pertemuan",
    [JenisIbadat.BAKTI_SOSIAL]: "Bakti Sosial",
    [JenisIbadat.KEGIATAN_LAIN]: "Kegiatan Lain",
  };
  
  return mapping[jenisIbadat] || String(jenisIbadat);
}

/**
 * Mengubah enum SubIbadat menjadi string yang mudah dibaca
 */
export function formatSubIbadat(subIbadat: SubIbadat | null): string {
  if (subIbadat === null) return "Umum";
  
  const mapping: Record<SubIbadat, string> = {
    [SubIbadat.IBADAT_SABDA]: "Ibadat Sabda",
    [SubIbadat.IBADAT_SABDA_TEMATIK]: "Ibadat Sabda Tematik",
    [SubIbadat.PRAPASKAH]: "Prapaskah",
    [SubIbadat.BKSN]: "BKSN",
    [SubIbadat.BULAN_ROSARIO]: "Bulan Rosario",
    [SubIbadat.NOVENA_NATAL]: "Novena Natal",
    [SubIbadat.MISA_SYUKUR]: "Misa Syukur",
    [SubIbadat.MISA_REQUEM]: "Misa Requem",
    [SubIbadat.MISA_ARWAH]: "Misa Arwah",
    [SubIbadat.MISA_PELINDUNG]: "Misa Pelindung",
  };
  
  return mapping[subIbadat] || String(subIbadat);
}

/**
 * Mengelompokkan data berdasarkan jenis ibadat dan sub ibadat
 * 
 * @returns Object dengan struktur { [jenisIbadat]: { [subIbadat]: count } }
 */
export function groupDataByJenisIbadat(data: KaleidoskopActivityData[]): Record<string, Record<string, number>> {
  const result: Record<string, Record<string, number>> = {};
  
  data.forEach((item) => {
    // Jika jenis ibadat belum ada, inisialisasi
    if (!result[item.jenisIbadat]) {
      result[item.jenisIbadat] = {};
    }
    
    // Gunakan string key yang aman untuk subIbadat (null menjadi "null")
    const subIbadatKey = item.subIbadat ? item.subIbadat.toString() : "null";
    
    // Jika sub ibadat belum ada, inisialisasi dengan nilai 0
    if (!result[item.jenisIbadat][subIbadatKey]) {
      result[item.jenisIbadat][subIbadatKey] = 0;
    }
    
    // Increment counter
    result[item.jenisIbadat][subIbadatKey]++;
  });
  
  return result;
} 