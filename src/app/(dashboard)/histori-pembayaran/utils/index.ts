import { PaymentHistory, PaymentStatus } from "../types";

// Fungsi untuk memfilter data pembayaran berdasarkan user ID dan tipe pembayaran
export function filterPaymentsByUserAndType(
  data: PaymentHistory[],
  type: "Dana Mandiri" | "IKATA",
  userId?: number,
  showAllUsers = false
): PaymentHistory[] {
  let filteredData = data.filter(payment => payment.type === type);
  
  // Filter status sesuai brief
  if (type === "Dana Mandiri") {
    filteredData = filteredData.filter(payment => payment.status === "Lunas");
  }
  if (type === "IKATA") {
    filteredData = filteredData.filter(payment => payment.status === "Lunas");
  }
  
  // Jika perlu filter berdasarkan user ID
  if (!showAllUsers && userId) {
    filteredData = filteredData.filter(payment => payment.userId === userId);
  }
  
  return filteredData;
}

// Fungsi untuk memfilter data berdasarkan tipe pembayaran dan tahun
export function filterPaymentHistory(
  data: PaymentHistory[],
  type: "Dana Mandiri" | "IKATA",
  year?: number
): PaymentHistory[] {
  return data.filter(
    (payment) =>
      payment.type === type && (year ? payment.year === year : true)
  );
}

// Fungsi untuk mendapatkan daftar tahun unik dari data histori
export function getUniqueYears(data: PaymentHistory[]): number[] {
  const years = data.map((payment) => payment.year);
  return [...new Set(years)].sort((a, b) => b - a); // Descending order
}

// Fungsi untuk mendapatkan warna badge berdasarkan status
export function getStatusColor(status: PaymentStatus): string {
  switch (status) {
    case "Lunas":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "Menunggu":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "Belum Bayar":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
}

// Fungsi untuk memformat mata uang sebagai Rupiah
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Fungsi untuk membuat data histori pembayaran dummy
export function generatePaymentHistoryData(): PaymentHistory[] {
  const currentYear = new Date().getFullYear();
  const history: PaymentHistory[] = [];
  
  // Data dummy untuk umat
  const umatData = [
    { id: 1, name: "Budi Santoso" },
    { id: 2, name: "Joko Widodo" },
    { id: 3, name: "Rina Marlina" },
    { id: 4, name: "Agus Darmawan" },
    { id: 5, name: "Siti Aminah" }
  ];

  // Membuat data histori untuk Dana Mandiri selama 3 tahun terakhir
  for (let year = currentYear; year >= currentYear - 2; year--) {
    // Buat data untuk setiap umat
    umatData.forEach(umat => {
      // Status berbeda untuk setiap umat berdasarkan id dan tahun
      let status: PaymentStatus;
      let paymentDate: Date | null = null;
      
      if (year === currentYear) {
        // Tahun ini: Status bervariasi berdasarkan ID umat
        if (umat.id % 3 === 0) {
          status = "Lunas";
          paymentDate = new Date(year, umat.id % 12, 10 + umat.id);
        } else if (umat.id % 3 === 1) {
          status = "Menunggu";
          paymentDate = null;
        } else {
          status = "Belum Bayar";
          paymentDate = null;
        }
      } else if (year === currentYear - 1) {
        // Tahun lalu: Mayoritas lunas
        if (umat.id % 5 === 0) {
          status = "Belum Bayar";
          paymentDate = null;
        } else {
          status = "Lunas";
          paymentDate = new Date(year, (umat.id + 2) % 12, 5 + umat.id);
        }
      } else {
        // 2 tahun lalu: Semua lunas
        status = "Lunas";
        paymentDate = new Date(year, (umat.id + 4) % 12, 15 - (umat.id % 5));
      }
      
      // Tambahkan entry Dana Mandiri
      history.push({
        id: history.length + 1,
        userId: umat.id,
        familyHeadName: umat.name,
        year,
        paymentDate,
        amount: 200000 + (year - (currentYear - 2)) * 50000,
        status,
        type: "Dana Mandiri",
        description: `Dana Mandiri Tahun ${year}`,
      });
    });
  }

  // Membuat data histori untuk IKATA selama 3 tahun terakhir
  for (let year = currentYear; year >= currentYear - 2; year--) {
    // Per semester
    for (let semester = 1; semester <= 2; semester++) {
      // Buat data untuk setiap umat
      umatData.forEach(umat => {
        // Status berbeda untuk setiap umat berdasarkan id dan tahun/semester
        let status: PaymentStatus;
        let paymentDate: Date | null = null;
        
        if (year === currentYear) {
          if (semester === 1) {
            // Semester 1 tahun ini: mayoritas lunas
            if (umat.id % 4 === 0) {
              status = "Menunggu";
              paymentDate = null;
            } else {
              status = "Lunas";
              paymentDate = new Date(year, (umat.id % 3) + 1, 5 + umat.id);
            }
          } else {
            // Semester 2 tahun ini: bervariasi
            if (umat.id % 2 === 0) {
              status = "Belum Bayar";
              paymentDate = null;
            } else if (umat.id % 3 === 0) {
              status = "Menunggu";
              paymentDate = null;
            } else {
              status = "Lunas";
              paymentDate = new Date(year, 6 + (umat.id % 2), 10 + (umat.id % 15));
            }
          }
        } else if (year === currentYear - 1) {
          // Tahun lalu: Hampir semua lunas
          if (umat.id === 5 && semester === 2) {
            status = "Belum Bayar";
            paymentDate = null;
          } else {
            status = "Lunas";
            const month = semester === 1 ? (umat.id % 4) + 1 : (umat.id % 4) + 7;
            paymentDate = new Date(year, month, 10 + (umat.id % 15));
          }
        } else {
          // 2 tahun lalu: Semua lunas
          status = "Lunas";
          const month = semester === 1 ? (umat.id % 3) + 1 : (umat.id % 3) + 7;
          paymentDate = new Date(year, month, 5 + (umat.id % 20));
        }
        
        // Tambahkan entry IKATA
        history.push({
          id: history.length + 1,
          userId: umat.id,
          familyHeadName: umat.name,
          year,
          paymentDate,
          amount: 75000 + (year - (currentYear - 2)) * 25000,
          status,
          type: "IKATA",
          description: `Iuran IKATA Semester ${semester} ${year}`,
        });
      });
    }
  }

  return history;
}
