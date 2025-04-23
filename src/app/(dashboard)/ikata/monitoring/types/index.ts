export interface DelinquentPayment {
  id: string;
  kepalaKeluarga: string;
  periodeAwal: string;
  periodeAkhir: string;
  jumlahTunggakan: number;
  status: 'belum_lunas' | 'lunas';
  createdAt: string;
  updatedAt: string;
}

export interface NotificationData {
  kepalaKeluarga: string;
  periode: string;
  jumlahTunggakan: number;
  message: string;
} 