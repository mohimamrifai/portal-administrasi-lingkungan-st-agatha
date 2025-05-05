"use server";

import { prisma } from "@/lib/db";
import { unstable_noStore as noStore } from "next/cache";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { AgendaFormValues, AgendaAttachment } from "./types";
import { z } from "zod";
import { uploadFile, updateFile, deleteFile } from "@/lib/uploads";
import { createNotification } from "@/lib/notifications";
import { getCurrentJakartaTime } from '@/lib/date-utils';

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

    // Buat notifikasi untuk pengelola atau admin berdasarkan target
    // Target bisa berupa 'lingkungan', 'stasi', atau 'paroki'
    if (formData.target === 'lingkungan' || formData.target === 'stasi' || formData.target === 'paroki') {
      // Fetch users with role that matches the target
      const adminRole = formData.target === 'lingkungan' 
        ? 'ketuaLingkungan' 
        : formData.target === 'stasi' 
          ? 'wakilKetua' 
          : 'SuperUser';
      
      // Get admins based on role
      const admins = await prisma.user.findMany({
        where: {
          role: adminRole
        },
        select: {
          id: true
        }
      });
      
      // Create notifications for each admin
      for (const admin of admins) {
        await createNotification({
          title: "Agenda Baru Dibuat",
          message: `Agenda baru "${formData.title}" memerlukan persetujuan Anda. Silakan cek menu agenda.`,
          type: "info",
          recipientId: admin.id,
          senderId: userId,
          relatedItemId: newAgenda.id,
          relatedItemType: "Agenda"
        });
      }
    }

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
    
    // Dapatkan data user untuk mengirim notifikasi
    const session = await getServerSession(authOptions);
    let senderId: number | undefined;
    
    if (session?.user?.id) {
      senderId = Number(session.user.id);
    }
    
    // Kirim notifikasi ke pembuat agenda jika editor bukan pembuat
    if (senderId && senderId !== updatedAgenda.createdBy) {
      await createNotification({
        title: "Agenda Diperbarui",
        message: `Agenda "${formData.title}" telah diperbarui.`,
        type: "info",
        recipientId: updatedAgenda.createdBy,
        senderId,
        relatedItemId: id,
        relatedItemType: "Agenda"
      });
    }
    
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
    
    // Dapatkan data user untuk mengirim notifikasi
    let senderId: number | undefined;
    
    if (session?.user?.id) {
      senderId = Number(session.user.id);
      
      // Kirim notifikasi ke pembuat agenda jika deleter bukan pembuat
      if (senderId !== agenda.createdBy) {
        await createNotification({
          title: "Agenda Dihapus",
          message: `Agenda "${agenda.title}" telah dihapus.`,
          type: "warning",
          recipientId: agenda.createdBy,
          senderId,
          relatedItemType: "Agenda"
        });
      }
    }
    
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

// Fungsi untuk menghapus agenda yang sudah selesai secara otomatis
export async function autoDeleteCompletedAgendas(): Promise<ActionResponse> {
  noStore();
  
  try {
    // Dapatkan semua agenda yang sudah selesai/ditolak dan lebih dari 7 hari
    const cutoffDate = new Date(getCurrentJakartaTime());
    cutoffDate.setDate(cutoffDate.getDate() - 7); // 7 hari yang lalu

    // Cari agenda yang akan dihapus
    const agendasToDelete = await prisma.agenda.findMany({
      where: {
        status: {
          in: ['completed', 'rejected']
        },
        updatedAt: {
          lt: cutoffDate
        }
      }
    });

    // Hapus file attachment untuk setiap agenda jika ada
    for (const agenda of agendasToDelete) {
      if (agenda.attachment) {
        try {
          const attachmentData = JSON.parse(agenda.attachment as string) as AgendaAttachment;
          await deleteFile(attachmentData.fileName, 'agenda');
        } catch (error) {
          console.error(`Error deleting attachment for agenda ${agenda.id}:`, error);
        }
      }
    }

    // Hapus agenda dari database
    const result = await prisma.agenda.deleteMany({
      where: {
        status: {
          in: ['completed', 'rejected']
        },
        updatedAt: {
          lt: cutoffDate
        }
      }
    });

    // Kirim notifikasi ke admin
    try {
      const admins = await prisma.user.findMany({
        where: {
          role: 'SuperUser'
        }
      });

      for (const admin of admins) {
        await createNotification({
          title: "Auto-Delete Agenda",
          message: `${result.count} agenda yang sudah selesai/ditolak telah dihapus secara otomatis.`,
          type: "info",
          recipientId: admin.id,
          relatedItemType: "Agenda"
        });
      }
    } catch (error) {
      console.error("Error sending notifications:", error);
    }

    // Revalidasi path setelah penghapusan
    revalidatePath('/kesekretariatan/agenda');
    
    return {
      success: true,
      message: `${result.count} agenda telah dihapus secara otomatis`,
      data: result
    };
  } catch (error) {
    console.error("Error auto-deleting agendas:", error);
    return {
      success: false,
      message: "Gagal menghapus agenda secara otomatis"
    };
  }
}

// Fungsi untuk mengirim notifikasi pengingat ke pengurus
export async function sendReminderNotifications(): Promise<ActionResponse> {
  noStore();
  
  try {
    // Hitung jumlah agenda open
    const openAgendas = await prisma.agenda.count({
      where: {
        status: 'open'
      }
    });

    if (openAgendas > 0) {
      // Dapatkan semua pengurus
      const pengurus = await prisma.user.findMany({
        where: {
          role: {
            in: [
              'ketuaLingkungan',
              'wakilKetua',
              'sekretaris',
              'wakilSekretaris',
              'bendahara',
              'wakilBendahara',
              'SuperUser'
            ]
          }
        }
      });

      // Kirim notifikasi ke setiap pengurus
      for (const user of pengurus) {
        await createNotification({
          title: "Pengingat Agenda",
          message: `Terdapat ${openAgendas} agenda yang menunggu tindak lanjut.`,
          type: "info",
          recipientId: user.id,
          relatedItemType: "Agenda"
        });
      }
    }

    return {
      success: true,
      message: "Notifikasi pengingat berhasil dikirim"
    };
  } catch (error) {
    console.error("Error sending reminder notifications:", error);
    return {
      success: false,
      message: "Gagal mengirim notifikasi pengingat"
    };
  }
} 