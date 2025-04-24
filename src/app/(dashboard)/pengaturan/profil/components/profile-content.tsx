"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PlusCircle, Camera, User } from "lucide-react"

import { FamilyHeadForm } from "./family-head-form"
import { SpouseForm } from "./spouse-form"
import { DependentForm } from "./dependent-form"
import { DependentItem } from "./dependent-item"
import { 
  FamilyHeadFormValues, 
  SpouseFormValues, 
  DependentFormValues, 
  ProfileData, 
  Dependent, 
  Spouse,
  MaritalStatus 
} from "../types"
import { generateMockProfile, convertFormValuesToProfileData } from "../utils"

export default function ProfileContent() {
  const { userRole } = useAuth()
  const isUmatRole = userRole === "Umat"
  
  // State untuk menyimpan data profil
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  
  // State untuk tanggungan yang sedang diedit
  const [editingDependent, setEditingDependent] = useState<Dependent | null>(null)
  const [showDependentForm, setShowDependentForm] = useState<boolean>(false)
  
  // Nilai default untuk tab
  const [activeTab, setActiveTab] = useState<string>("kepala-keluarga")
  
  // Fetch data saat komponen di-mount
  useEffect(() => {
    // Simulasi pemanggilan API
    const fetchData = async () => {
      try {
        setIsLoading(true)
        // Simulasi delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        // Gunakan data dummy berdasarkan ID pengguna
        const userId = 1 // Hardcoded to 1 for demo, would come from auth context
        const data = generateMockProfile(userId)
        setProfileData(data)
        
        // Set tab "pasangan" jika ada data pasangan
        if (data.spouse) {
          setActiveTab("kepala-keluarga")
        }
      } catch (error) {
        toast.error("Gagal memuat data profil")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])
  
  // Helper untuk mendapatkan inisial nama
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  
  // Simulasi upload gambar
  const handleImageUpload = (entityType: 'familyHead' | 'spouse' | 'dependent', id?: number) => {
    // Dalam aplikasi nyata, ini akan membuka file picker dan melakukan upload
    // Untuk simulasi, kita hanya mengubah URL gambar profile dengan avatar acak baru
    const randomNumber = Math.floor(Math.random() * 70) + 1;
    const newImageUrl = `https://i.pravatar.cc/300?img=${randomNumber}`;
    
    if (!profileData) return;
    
    if (entityType === 'familyHead') {
      setProfileData({
        ...profileData,
        familyHead: {
          ...profileData.familyHead,
          imageUrl: newImageUrl
        }
      });
      toast.success("Foto profil berhasil diperbarui");
    } else if (entityType === 'spouse' && profileData.spouse) {
      setProfileData({
        ...profileData,
        spouse: {
          ...profileData.spouse,
          imageUrl: newImageUrl
        }
      });
      toast.success("Foto pasangan berhasil diperbarui");
    } else if (entityType === 'dependent' && id) {
      const updatedDependents = profileData.dependents.map(dependent => {
        if (dependent.id === id) {
          return {
            ...dependent,
            imageUrl: newImageUrl
          };
        }
        return dependent;
      });
      
      setProfileData({
        ...profileData,
        dependents: updatedDependents
      });
      toast.success("Foto tanggungan berhasil diperbarui");
    }
  };
  
  // Handler untuk menyimpan data Kepala Keluarga
  const handleFamilyHeadSubmit = async (values: FamilyHeadFormValues) => {
    if (!profileData) return
    
    try {
      setIsSaving(true)
      
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update local state, pastikan imageUrl tetap ada
      const updatedProfile = {
        ...profileData,
        familyHead: {
          ...profileData.familyHead,
          ...values,
          imageUrl: profileData.familyHead.imageUrl // Pastikan imageUrl tidak hilang
        }
      }
      
      setProfileData(updatedProfile)
      toast.success("Data Kepala Keluarga berhasil disimpan")
      
      // Jika status pernikahan bukan menikah, hapus data pasangan
      if (values.maritalStatus !== MaritalStatus.MARRIED) {
        setProfileData(prev => prev ? {
          ...prev,
          spouse: null
        } : null)
      }
      
    } catch (error) {
      toast.error("Gagal menyimpan data")
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }
  
  // Handler untuk menyimpan data Pasangan
  const handleSpouseSubmit = async (values: SpouseFormValues) => {
    if (!profileData) return
    
    try {
      setIsSaving(true)
      
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update local state dengan tipe data yang benar
      const newSpouse: Spouse = {
        id: profileData.spouse?.id || Date.now(),
        fullName: values.fullName,
        gender: values.gender,
        birthPlace: values.birthPlace,
        birthDate: values.birthDate,
        nik: values.nik,
        phoneNumber: values.phoneNumber,
        email: values.email || "",
        occupation: values.occupation,
        imageUrl: profileData.spouse?.imageUrl || `https://i.pravatar.cc/300?img=${Math.floor(Math.random() * 70) + 1}`
      }
      
      const updatedProfile = {
        ...profileData,
        spouse: newSpouse
      }
      
      setProfileData(updatedProfile)
      toast.success("Data Pasangan berhasil disimpan")
      
    } catch (error) {
      toast.error("Gagal menyimpan data")
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }
  
  // Handler untuk menambahkan tanggungan baru
  const handleAddDependent = async (values: DependentFormValues) => {
    if (!profileData) return
    
    try {
      setIsSaving(true)
      
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Buat objek tanggungan baru dengan tipe yang benar
      const newDependent: Dependent = {
        id: Date.now(),
        fullName: values.fullName,
        gender: values.gender,
        birthPlace: values.birthPlace,
        birthDate: values.birthDate,
        nik: values.nik,
        relationship: values.relationship,
        occupation: values.occupation || "",
        imageUrl: `https://i.pravatar.cc/300?img=${Math.floor(Math.random() * 70) + 1}`
      }
      
      // Update local state
      const updatedDependents = [...profileData.dependents, newDependent]
      
      setProfileData({
        ...profileData,
        dependents: updatedDependents
      })
      
      // Reset form
      setShowDependentForm(false)
      setEditingDependent(null)
      
      toast.success("Data Tanggungan berhasil ditambahkan")
      
    } catch (error) {
      toast.error("Gagal menambahkan data")
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }
  
  // Handler untuk update tanggungan
  const handleUpdateDependent = async (values: DependentFormValues) => {
    if (!profileData || !editingDependent) return
    
    try {
      setIsSaving(true)
      
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update local state dengan tipe yang benar
      const updatedDependents = profileData.dependents.map(dependent => {
        if (dependent.id === editingDependent.id) {
          return {
            ...dependent,
            fullName: values.fullName,
            gender: values.gender,
            birthPlace: values.birthPlace,
            birthDate: values.birthDate,
            nik: values.nik,
            relationship: values.relationship,
            occupation: values.occupation || "",
            imageUrl: dependent.imageUrl // Tetap mempertahankan foto yang ada
          }
        }
        return dependent
      })
      
      setProfileData({
        ...profileData,
        dependents: updatedDependents
      })
      
      // Reset form
      setShowDependentForm(false)
      setEditingDependent(null)
      
      toast.success("Data Tanggungan berhasil diperbarui")
      
    } catch (error) {
      toast.error("Gagal memperbarui data")
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }
  
  // Handler untuk menghapus tanggungan
  const handleDeleteDependent = async (dependent: Dependent) => {
    if (!profileData) return
    
    // Konfirmasi penghapusan
    const confirm = window.confirm(`Apakah Anda yakin ingin menghapus data ${dependent.fullName}?`)
    
    if (!confirm) return
    
    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Update local state
      const updatedDependents = profileData.dependents.filter(d => d.id !== dependent.id)
      
      setProfileData({
        ...profileData,
        dependents: updatedDependents
      })
      
      toast.success("Data Tanggungan berhasil dihapus")
      
    } catch (error) {
      toast.error("Gagal menghapus data")
      console.error(error)
    }
  }
  
  // Handler untuk edit tanggungan
  const handleEditDependent = (dependent: Dependent) => {
    setEditingDependent(dependent)
    setShowDependentForm(true)
  }
  
  // Handler untuk cancel form
  const handleCancelDependentForm = () => {
    setShowDependentForm(false)
    setEditingDependent(null)
  }
  
  // Handler untuk submit dependent
  const handleDependentSubmit = (values: DependentFormValues) => {
    if (editingDependent) {
      handleUpdateDependent(values)
    } else {
      handleAddDependent(values)
    }
  }
  
  // Jika masih loading, tampilkan pesan loading
  if (isLoading) {
    return <div className="text-center py-6">Memuat data...</div>
  }
  
  // Jika data belum tersedia
  if (!profileData) {
    return <div className="text-center py-6">Data profil tidak tersedia</div>
  }

  return (
    <div className="space-y-6 p-0">
      <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
        <div className="relative">
          <Avatar className="h-24 w-24 border-2 border-primary/10">
            <AvatarImage src={profileData.familyHead.imageUrl} alt={profileData.familyHead.fullName} />
            <AvatarFallback>{getInitials(profileData.familyHead.fullName)}</AvatarFallback>
          </Avatar>
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-background"
            onClick={() => handleImageUpload('familyHead')}
          >
            <Camera className="h-4 w-4" />
            <span className="sr-only">Upload foto</span>
          </Button>
        </div>
        <div>
          <h2 className="text-xl font-bold">{profileData.familyHead.fullName}</h2>
          <p className="text-muted-foreground">{profileData.familyHead.email}</p>
        </div>
      </div>
      
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="kepala-keluarga">Kepala Keluarga</TabsTrigger>
          {profileData.familyHead.maritalStatus === MaritalStatus.MARRIED && (
            <TabsTrigger value="pasangan">Pasangan</TabsTrigger>
          )}
          <TabsTrigger value="tanggungan">Tanggungan</TabsTrigger>
        </TabsList>
        
        <TabsContent value="kepala-keluarga" className="space-y-4 p-1">
          <FamilyHeadForm
            initialData={profileData.familyHead}
            onSubmit={handleFamilyHeadSubmit}
            isLoading={isSaving}
          />
        </TabsContent>
        
        {profileData.familyHead.maritalStatus === MaritalStatus.MARRIED && (
          <TabsContent value="pasangan" className="space-y-4 p-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <Avatar className="h-16 w-16 border-2 border-primary/10">
                  <AvatarImage 
                    src={profileData.spouse?.imageUrl} 
                    alt={profileData.spouse?.fullName} 
                  />
                  <AvatarFallback>
                    {profileData.spouse ? getInitials(profileData.spouse.fullName) : <User className="h-6 w-6" />}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute bottom-0 right-0 rounded-full h-6 w-6 bg-background"
                  onClick={() => handleImageUpload('spouse')}
                >
                  <Camera className="h-3 w-3" />
                  <span className="sr-only">Upload foto</span>
                </Button>
              </div>
              <div>
                <h3 className="font-medium">{profileData.spouse?.fullName || "Data Pasangan"}</h3>
                {profileData.spouse?.email && (
                  <p className="text-sm text-muted-foreground">{profileData.spouse.email}</p>
                )}
              </div>
            </div>
            <SpouseForm
              initialData={profileData.spouse}
              onSubmit={handleSpouseSubmit}
              isLoading={isSaving}
            />
          </TabsContent>
        )}
        
        <TabsContent value="tanggungan" className="space-y-4 p-1">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Daftar Tanggungan</h3>
            {!showDependentForm && (
              <Button
                onClick={() => {
                  setEditingDependent(null)
                  setShowDependentForm(true)
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Tambah Tanggungan
              </Button>
            )}
          </div>
          
          {showDependentForm && (
            <DependentForm
              initialData={editingDependent || undefined}
              onSubmit={handleDependentSubmit}
              onCancel={handleCancelDependentForm}
              isLoading={isSaving}
            />
          )}
          
          {profileData.dependents.length === 0 && !showDependentForm ? (
            <div className="text-center py-6 text-muted-foreground">
              Belum ada data tanggungan. Klik tombol "Tambah Tanggungan" untuk menambahkan.
            </div>
          ) : (
            <div>
              {profileData.dependents.map(dependent => (
                <DependentItem
                  key={dependent.id}
                  dependent={dependent}
                  onEdit={handleEditDependent}
                  onDelete={handleDeleteDependent}
                  onImageUpload={() => handleImageUpload('dependent', dependent.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
} 