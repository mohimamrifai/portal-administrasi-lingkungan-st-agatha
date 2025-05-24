import { useState, useEffect } from "react"
import { toast } from "sonner"
import { getProfileData } from "../actions/profile-actions"
import { ProfileData } from "../types"
import { generateMockProfile } from "../utils"

export function useProfileData(userId: string | null | undefined) {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSaving, setIsSaving] = useState<boolean>(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        
        if (!userId) {
          // Jangan menampilkan toast error saat userId masih null pada loading awal
          // Hanya tetap dalam state loading
          return
        }
        
        // Panggil API untuk mendapatkan data profil
        const response = await getProfileData(userId)
        
        if (!response.success) {
          toast.error(response.error || "Gagal memuat data profil")
          // Gunakan data dummy sebagai fallback jika data dari API gagal
          const fallbackData = generateMockProfile(1)
          setProfileData(fallbackData)
          return
        }
        
        if (response.data) {
          setProfileData(response.data)
        } else {
          // Jika data tidak ada, gunakan fallback data
          const fallbackData = generateMockProfile(1)
          setProfileData(fallbackData)
        }
      } catch (error) {
        toast.error("Gagal memuat data profil")
        console.error(error)
        
        // Gunakan data dummy sebagai fallback jika terjadi error
        const fallbackData = generateMockProfile(1)
        setProfileData(fallbackData)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [userId])

  const refreshProfileData = async (): Promise<boolean> => {
    if (!userId) return false
    
    try {
      const response = await getProfileData(userId)
      if (response.success && response.data) {
        setProfileData(response.data)
        return true
      }
      return false
    } catch (error) {
      console.error("Error refreshing profile data:", error)
      return false
    }
  }

  return {
    profileData,
    setProfileData,
    isLoading,
    isSaving,
    setIsSaving,
    refreshProfileData
  }
} 