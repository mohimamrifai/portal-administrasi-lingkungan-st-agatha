export interface DelinquentPayment {
  id: string;
  kepalaKeluarga: string;
  keluargaId: string;
  periodeAwal: string;
  periodeAkhir: string;
  jumlahTunggakan: number;
  status: 'belum_lunas' | 'sebagian_bulan';
  createdAt: string;
  updatedAt: string;
}

export interface NotificationData {
  kepalaKeluarga: string;
  periode: string;
  jumlahTunggakan: number;
  message: string;
} 