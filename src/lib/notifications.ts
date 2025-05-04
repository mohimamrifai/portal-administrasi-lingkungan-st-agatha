"use server";

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { unstable_noStore as noStore } from "next/cache";
import { revalidatePath } from "next/cache";

export type NotificationType = "info" | "success" | "warning" | "error";

export interface NotificationData {
  title: string;
  message: string;
  type: NotificationType;
  recipientId?: number;
  senderId?: number;
  relatedItemId?: number;
  relatedItemType?: string;
}

export interface NotificationResponse {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Membuat notifikasi baru di database
 */
export async function createNotification(data: NotificationData): Promise<NotificationResponse> {
  noStore();
  
  try {
    // Dapatkan data user dari session jika senderId tidak disediakan
    let senderId = data.senderId;
    
    if (!senderId) {
      const session = await getServerSession(authOptions);
      if (session?.user?.id) {
        senderId = Number(session.user.id);
      }
    }
    
    // Buat notifikasi baru
    const notification = await prisma.notification.create({
      data: {
        title: data.title,
        message: data.message,
        type: data.type,
        recipientId: data.recipientId,
        senderId,
        relatedItemId: data.relatedItemId,
        relatedItemType: data.relatedItemType,
      }
    });
    
    // Revalidasi path jika diperlukan
    if (data.relatedItemType) {
      revalidatePath(`/${data.relatedItemType.toLowerCase()}`);
    }
    
    return {
      success: true,
      message: "Notifikasi berhasil dibuat",
      data: notification
    };
  } catch (error) {
    console.error("Error creating notification:", error);
    return {
      success: false,
      message: "Gagal membuat notifikasi"
    };
  }
}

/**
 * Mendapatkan notifikasi untuk user tertentu
 */
export async function getUserNotifications(limit = 10): Promise<any[]> {
  noStore();
  
  try {
    // Dapatkan session user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return [];
    }
    
    const userId = Number(session.user.id);
    
    // Hitung tanggal 1 hari yang lalu
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    // Ambil notifikasi untuk user tersebut
    // Filter: hanya yang belum dibaca dan kurang dari 1 hari
    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: userId,
        isRead: false,
        timestamp: {
          gte: oneDayAgo
        }
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: limit
    });
    
    return notifications;
  } catch (error) {
    console.error("Error fetching user notifications:", error);
    return [];
  }
}

/**
 * Mendapatkan notifikasi berdasarkan ID
 */
export async function getNotificationById(notificationId: number): Promise<any | null> {
  noStore();
  
  try {
    // Dapatkan session user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return null;
    }
    
    const userId = Number(session.user.id);
    
    // Ambil notifikasi berdasarkan ID
    const notification = await prisma.notification.findUnique({
      where: {
        id: notificationId
      },
    });
    
    // Pastikan user adalah penerima notifikasi tersebut
    if (!notification || notification.recipientId !== userId) {
      return null;
    }
    
    return notification;
  } catch (error) {
    console.error("Error fetching notification by ID:", error);
    return null;
  }
}

/**
 * Menandai notifikasi sebagai telah dibaca
 */
export async function markNotificationAsRead(notificationId: number): Promise<NotificationResponse> {
  noStore();
  
  try {
    // Dapatkan session user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return {
        success: false,
        message: "User tidak terautentikasi"
      };
    }
    
    const userId = Number(session.user.id);
    
    // Periksa apakah notifikasi milik user
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId }
    });
    
    if (!notification || notification.recipientId !== userId) {
      return {
        success: false,
        message: "Notifikasi tidak ditemukan atau tidak berhak mengaksesnya"
      };
    }
    
    // Update notifikasi
    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true }
    });
    
    return {
      success: true,
      message: "Notifikasi ditandai sebagai dibaca"
    };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return {
      success: false,
      message: "Gagal menandai notifikasi sebagai dibaca"
    };
  }
}

/**
 * Menandai semua notifikasi pengguna sebagai telah dibaca
 */
export async function markAllNotificationsAsRead(): Promise<NotificationResponse> {
  noStore();
  
  try {
    // Dapatkan session user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return {
        success: false,
        message: "User tidak terautentikasi"
      };
    }
    
    const userId = Number(session.user.id);
    
    // Update semua notifikasi milik user yang belum dibaca
    await prisma.notification.updateMany({
      where: { 
        recipientId: userId,
        isRead: false
      },
      data: { isRead: true }
    });
    
    // Revalidasi path notifikasi
    revalidatePath('/notifications');
    
    return {
      success: true,
      message: "Semua notifikasi berhasil ditandai sebagai dibaca"
    };
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return {
      success: false,
      message: "Gagal menandai semua notifikasi sebagai dibaca"
    };
  }
}

/**
 * Menghitung jumlah notifikasi yang belum dibaca
 */
export async function getUnreadNotificationsCount(): Promise<number> {
  noStore();
  
  try {
    // Dapatkan session user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return 0;
    }
    
    const userId = Number(session.user.id);
    
    // Hitung tanggal 1 hari yang lalu
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    // Hitung jumlah notifikasi yang belum dibaca
    const count = await prisma.notification.count({
      where: {
        recipientId: userId,
        isRead: false,
        timestamp: {
          gte: oneDayAgo
        }
      }
    });
    
    return count;
  } catch (error) {
    console.error("Error counting unread notifications:", error);
    return 0;
  }
}

/**
 * Menghapus notifikasi
 */
export async function deleteNotification(notificationId: number): Promise<NotificationResponse> {
  noStore();
  
  try {
    // Dapatkan session user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return {
        success: false,
        message: "User tidak terautentikasi"
      };
    }
    
    const userId = Number(session.user.id);
    
    // Periksa apakah notifikasi milik user
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId }
    });
    
    if (!notification || notification.recipientId !== userId) {
      return {
        success: false,
        message: "Notifikasi tidak ditemukan atau tidak berhak mengaksesnya"
      };
    }
    
    // Hapus notifikasi
    await prisma.notification.delete({
      where: { id: notificationId }
    });
    
    return {
      success: true,
      message: "Notifikasi berhasil dihapus"
    };
  } catch (error) {
    console.error("Error deleting notification:", error);
    return {
      success: false,
      message: "Gagal menghapus notifikasi"
    };
  }
} 