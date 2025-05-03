"use server";

import { prisma } from "@/lib/db";
import { unstable_noStore as noStore } from "next/cache";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { AgendaFormValues } from "./types";
import { z } from "zod";

// Schema validasi untuk agenda
const agendaSchema = z.object({
  title: z.string().min(3, "Judul harus minimal 3 karakter"),
  description: z.string().min(10, "Deskripsi harus minimal 10 karakter"),
  date: z.date(),
  location: z.string().min(3, "Lokasi harus minimal 3 karakter"),
  target: z.enum(["lingkungan", "stasi", "paroki"]),
});

// Tipe untuk response dari server action
type ActionResponse = {
  success: boolean;
  message: string;
  data?: any;
};

// Fungsi untuk mendapatkan daftar agenda
export async function getAgendas() {
  noStore();
  
  try {
    const agendas = await prisma.agenda.findMany({
      orderBy: {
        updatedAt: 'desc'
      }
    });
    
    return agendas;
  } catch (error) {
    console.error("Error fetching agendas:", error);
    return [];
  }
}

// Fungsi untuk mendapatkan agenda berdasarkan ID
export async function getAgendaById(id: number) {
  noStore();
  
  try {
    const agenda = await prisma.agenda.findUnique({
      where: { id }
    });
    
    return agenda;
  } catch (error) {
    console.error(`Error fetching agenda with id ${id}:`, error);
    return null;
  }
}

// Fungsi untuk menambahkan agenda baru
export async function createAgenda(formData: AgendaFormValues): Promise<ActionResponse> {
  noStore();
  
  try {
    // Validasi input
    const validatedData = agendaSchema.parse(formData);
    
    // Dapatkan data user dari session
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return {
        success: false,
        message: "Tidak ada sesi yang ditemukan. Silakan login kembali."
      };
    }
    
    if (!session.user) {
      return {
        success: false,
        message: "Tidak ada data pengguna dalam sesi. Silakan login kembali."
      };
    }
    
    // Cara alternatif untuk mendapatkan userId jika tidak ada di session
    let userId: number;
    
    if (session.user.id) {
      // Gunakan ID yang ada di session
      userId = Number(session.user.id);
    } else {
      // Cari user berdasarkan nama pengguna sebagai fallback
      const username = session.user.name;
      if (!username) {
        return {
          success: false,
          message: "Nama pengguna tidak ditemukan dalam sesi. Silakan login kembali."
        };
      }
      
      // Cari user di database
      const user = await prisma.user.findUnique({
        where: { username }
      });
      
      if (!user) {
        return {
          success: false,
          message: "Pengguna tidak ditemukan di database. Silakan login kembali."
        };
      }
      
      userId = user.id;
    }

    // Buat agenda baru dengan userId yang didapatkan
    const newAgenda = await prisma.agenda.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        date: validatedData.date,
        location: validatedData.location,
        target: validatedData.target,
        status: "open",
        createdBy: userId
      }
    });

    // Revalidasi path agar data diperbarui
    revalidatePath('/kesekretariatan/agenda');
    
    return {
      success: true,
      message: "Agenda berhasil diajukan",
      data: newAgenda
    };
  } catch (error) {
    console.error("Error creating agenda:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: `Validasi gagal: ${error.errors.map(e => e.message).join(", ")}`
      };
    }
    
    // Tambahkan informasi error lebih detail
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      message: `Gagal mengajukan agenda: ${errorMessage}`
    };
  }
}

// Fungsi untuk memperbarui agenda yang sudah ada
export async function updateAgenda(id: number, formData: AgendaFormValues): Promise<ActionResponse> {
  noStore();
  
  try {
    // Validasi input
    const validatedData = agendaSchema.parse(formData);
    
    // Dapatkan data user dari session
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.id) {
      return {
        success: false,
        message: "Anda harus login terlebih dahulu"
      };
    }
    
    // Cari agenda yang akan diupdate
    const agenda = await prisma.agenda.findUnique({
      where: { id }
    });
    
    // Periksa apakah agenda ditemukan
    if (!agenda) {
      return {
        success: false,
        message: "Agenda tidak ditemukan"
      };
    }
    
    // Periksa apakah user adalah pembuat agenda atau admin
    if (agenda.createdBy !== Number(session.user.id) && session.user.role !== 'SuperUser') {
      return {
        success: false,
        message: "Anda tidak memiliki izin untuk mengedit agenda ini"
      };
    }
    
    // Periksa apakah status agenda masih "open"
    if (agenda.status !== 'open') {
      return {
        success: false,
        message: "Hanya agenda dengan status 'Menunggu' yang dapat diedit"
      };
    }
    
    // Update agenda
    const updatedAgenda = await prisma.agenda.update({
      where: { id },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        date: validatedData.date,
        location: validatedData.location,
        target: validatedData.target,
        updatedAt: new Date()
      }
    });
    
    // Revalidasi path agar data diperbarui
    revalidatePath('/kesekretariatan/agenda');
    
    return {
      success: true,
      message: "Agenda berhasil diperbarui",
      data: updatedAgenda
    };
  } catch (error) {
    console.error("Error updating agenda:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: `Validasi gagal: ${error.errors.map(e => e.message).join(", ")}`
      };
    }
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      message: `Gagal memperbarui agenda: ${errorMessage}`
    };
  }
}

// Fungsi untuk menghapus agenda
export async function deleteAgenda(agendaId: number): Promise<ActionResponse> {
  noStore();
  
  try {
    // Dapatkan data user dari session
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return {
        success: false,
        message: "Anda harus login terlebih dahulu"
      };
    }
    
    // Dapatkan agenda yang akan dihapus
    const agenda = await prisma.agenda.findUnique({
      where: { id: agendaId }
    });
    
    // Periksa apakah agenda ditemukan
    if (!agenda) {
      return {
        success: false,
        message: "Agenda tidak ditemukan"
      };
    }
    
    // Periksa apakah user adalah pembuat agenda atau admin
    if (agenda.createdBy !== Number(session.user.id) && session.user.role !== 'SuperUser') {
      return {
        success: false,
        message: "Anda tidak memiliki izin untuk menghapus agenda ini"
      };
    }
    
    // Hapus agenda
    await prisma.agenda.delete({
      where: { id: agendaId }
    });
    
    // Revalidasi path agar data diperbarui
    revalidatePath('/kesekretariatan/agenda');
    
    return {
      success: true,
      message: "Agenda berhasil dihapus"
    };
  } catch (error) {
    console.error("Error deleting agenda:", error);
    return {
      success: false,
      message: "Gagal menghapus agenda"
    };
  }
} 