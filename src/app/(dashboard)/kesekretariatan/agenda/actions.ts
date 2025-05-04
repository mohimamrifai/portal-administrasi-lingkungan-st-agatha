"use server";

import { prisma } from "@/lib/db";
import { unstable_noStore as noStore } from "next/cache";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { AgendaFormValues, AgendaAttachment } from "./types";
import { z } from "zod";
import { uploadFile, updateFile, deleteFile } from "@/lib/uploads";

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
    throw new Error("Gagal mengambil data agenda");
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
    // Proses file lampiran jika ada
    let attachmentData: AgendaAttachment | undefined;
    
    if (formData.attachment) {
      // Upload file
      const fileBuffer = await formData.attachment.arrayBuffer();
      const originalFilename = formData.attachment.name;
      const fileType = formData.attachment.type;
      
      const { fileName, fileUrl } = await uploadFile(
        Buffer.from(fileBuffer),
        originalFilename,
        'agenda'
      );
      
      attachmentData = {
        fileName,
        originalName: originalFilename,
        fileUrl,
        fileType
      };
    }
    
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
        title: formData.title,
        description: formData.description,
        date: formData.date,
        location: formData.location,
        target: formData.target,
        status: "open",
        attachment: attachmentData ? JSON.stringify(attachmentData) : null,
        createdBy: userId
      }
    });

    // Revalidasi path agar data diperbarui
    revalidatePath('/kesekretariatan/agenda');
    
    return {
      success: true,
      message: "Agenda berhasil dibuat",
      data: {
        ...newAgenda,
        attachment: attachmentData
      }
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
      message: `Gagal membuat agenda: ${errorMessage}`
    };
  }
}

// Fungsi untuk memperbarui agenda yang sudah ada
export async function updateAgenda(id: number, formData: AgendaFormValues): Promise<ActionResponse> {
  noStore();
  
  try {
    // Ambil data agenda saat ini untuk pengecekan attachment
    const currentAgenda = await prisma.agenda.findUnique({
      where: { id }
    });
    
    if (!currentAgenda) {
      return {
        success: false,
        message: "Agenda tidak ditemukan"
      };
    }
    
    // Parse attachment yang ada (jika ada)
    let existingAttachment: AgendaAttachment | null = null;
    if (currentAgenda.attachment) {
      try {
        existingAttachment = JSON.parse(currentAgenda.attachment as string);
      } catch (e) {
        console.error("Error parsing existing attachment:", e);
      }
    }
    
    // Proses file lampiran baru jika ada
    let attachmentData: AgendaAttachment | undefined | null = existingAttachment;
    
    // Jika user ingin menghapus lampiran
    if (formData.removeAttachment && existingAttachment) {
      try {
        await deleteFile(existingAttachment.fileName, 'agenda');
        attachmentData = null;
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    }
    // Jika ada file baru, upload
    else if (formData.attachment) {
      const fileBuffer = await formData.attachment.arrayBuffer();
      const originalFilename = formData.attachment.name;
      const fileType = formData.attachment.type;
      
      // Jika sudah ada lampiran, update file
      if (existingAttachment) {
        const { fileName, fileUrl } = await updateFile(
          Buffer.from(fileBuffer),
          originalFilename,
          'agenda',
          existingAttachment.fileName
        );
        
        attachmentData = {
          fileName,
          originalName: originalFilename,
          fileUrl,
          fileType
        };
      }
      // Jika belum ada lampiran, upload file baru
      else {
        const { fileName, fileUrl } = await uploadFile(
          Buffer.from(fileBuffer),
          originalFilename,
          'agenda'
        );
        
        attachmentData = {
          fileName,
          originalName: originalFilename,
          fileUrl,
          fileType
        };
      }
    }
    
    // Update agenda
    const updatedAgenda = await prisma.agenda.update({
      where: { id },
      data: {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        location: formData.location,
        target: formData.target,
        attachment: attachmentData ? JSON.stringify(attachmentData) : null,
        updatedAt: new Date()
      }
    });
    
    // Revalidasi path agar data diperbarui
    revalidatePath('/kesekretariatan/agenda');
    
    return {
      success: true,
      message: "Agenda berhasil diperbarui",
      data: {
        ...updatedAgenda,
        attachment: attachmentData
      }
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
    
    // Hapus file attachment jika ada
    if (agenda.attachment) {
      try {
        const attachmentData = JSON.parse(agenda.attachment as string) as AgendaAttachment;
        await deleteFile(attachmentData.fileName, 'agenda');
      } catch (error) {
        console.error("Error deleting attachment:", error);
        // Lanjutkan meskipun gagal menghapus file
      }
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