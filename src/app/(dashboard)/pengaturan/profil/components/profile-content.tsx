"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertCircle, PlusCircle, Camera, User, Save } from "lucide-react"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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

// Berdasarkan README.md:
// Submenu Profil - Hanya role "Umat" yang dapat memperbarui data profil
const ROLE_ACCESS_MAP = {
  // Semua role non-umat hanya bisa lihat profil mereka sendiri
  SuperUser: {
    canView: true,
    canEdit: false,
    message: "Anda melihat data profil sebagai SuperUser"
  },
  ketuaLingkungan: {
    canView: true,
    canEdit: false,
    message: "Anda melihat data profil sebagai Ketua Lingkungan"
  },
  wakilKetua: {
    canView: true,
    canEdit: false,
    message: "Anda melihat data profil sebagai Wakil Ketua"
  },
  sekretaris: {
    canView: true,
    canEdit: false, 
    message: "Anda melihat data profil sebagai Sekretaris"
  },
  wakilSekretaris: {
    canView: true,
    canEdit: false,
    message: "Anda melihat data profil sebagai Wakil Sekretaris"
  },
  bendahara: {
    canView: true,
    canEdit: false,
    message: "Anda melihat data profil sebagai Bendahara"
  },
  wakilBendahara: {
    canView: true,
    canEdit: false,
    message: "Anda melihat data profil sebagai Wakil Bendahara"
  },
  adminLingkungan: {
    canView: true,
    canEdit: false,
    message: "Anda melihat data profil sebagai Admin Lingkungan"
  },
  // Hanya umat yang dapat mengedit data profil
  umat: {
    canView: true,
    canEdit: true,
    message: "Anda dapat memperbarui data profil keluarga Anda"
  },
}

export default function ProfileContent() {
  const { userRole } = useAuth()
  
  // Ambil konfigurasi akses berdasarkan role
  const roleAccess = ROLE_ACCESS_MAP[userRole as keyof typeof ROLE_ACCESS_MAP] || ROLE_ACCESS_MAP.umat
  
  // State untuk menyimpan data profil
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  
  // State untuk dialog konfirmasi
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false)
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)
  const [confirmDialogProps, setConfirmDialogProps] = useState({
    title: "",
    description: ""
  })
  
  // State untuk tanggungan yang sedang diedit
  const [editingDependent, setEditingDependent] = useState<Dependent | null>(null)
  const [showDependentForm, setShowDependentForm] = useState<boolean>(false)
  
  // Nilai default untuk tab
  const [activeTab, setActiveTab] = useState<string>("kepala-keluarga")
  
  // Fetch data saat komponen di-mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        // Simulasi delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        // Gunakan data dummy berdasarkan ID pengguna
        // TODO: Ganti dengan API call ke backend
        const userId = 1 // Akan diganti dari auth context
        const data = generateMockProfile(userId)
        setProfileData(data)
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
  
  // Fungsi untuk menampilkan dialog konfirmasi
  const showConfirmationDialog = (
    title: string,
    description: string,
    action: () => void
  ) => {
    setConfirmDialogProps({
      title,
      description
    })
    setPendingAction(() => action)
    setShowConfirmDialog(true)
  }
  
  // Fungsi untuk melanjutkan aksi setelah konfirmasi
  const handleConfirm = () => {
    if (pendingAction) {
      pendingAction()
    }
    setShowConfirmDialog(false)
    setPendingAction(null)
  }
  
  // Simulasi upload gambar
  const handleImageUpload = (entityType: 'familyHead' | 'spouse' | 'dependent', id?: number) => {
    // Cek apakah pengguna memiliki izin untuk memperbarui data
    if (!roleAccess.canEdit) {
      toast.error(`Hanya pengguna dengan role Umat yang dapat memperbarui data`)
      return
    }
    
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
  const handleFamilyHeadSubmit = (values: FamilyHeadFormValues) => {
    // Cek apakah pengguna memiliki izin untuk memperbarui data
    if (!roleAccess.canEdit) {
      toast.error(`Hanya pengguna dengan role Umat yang dapat memperbarui data`)
      return
    }
    
    // Tampilkan dialog konfirmasi
    showConfirmationDialog(
      "Simpan Data Kepala Keluarga",
      "Apakah Anda yakin ingin menyimpan perubahan data Kepala Keluarga?",
      async () => {
        if (!profileData) return
        
        try {
          setIsSaving(true)
          
          // Simulasi API call
          // TODO: Ganti dengan API call ke backend
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
    )
  }
  
  // Handler untuk menyimpan data Pasangan
  const handleSpouseSubmit = (values: SpouseFormValues) => {
    // Cek apakah pengguna memiliki izin untuk memperbarui data
    if (!roleAccess.canEdit) {
      toast.error(`Hanya pengguna dengan role Umat yang dapat memperbarui data`)
      return
    }
    
    // Tampilkan dialog konfirmasi
    showConfirmationDialog(
      "Simpan Data Pasangan",
      "Apakah Anda yakin ingin menyimpan perubahan data Pasangan?",
      async () => {
        if (!profileData) return
        
        try {
          setIsSaving(true)
          
          // Simulasi API call
          // TODO: Ganti dengan API call ke backend
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Update local state, pastikan imageUrl tetap ada
          const updatedProfile = {
            ...profileData,
            spouse: values as Spouse
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
    )
  }
  
  // Handler untuk menambah tanggungan
  const handleAddDependent = (values: DependentFormValues) => {
    // Cek apakah pengguna memiliki izin untuk memperbarui data
    if (!roleAccess.canEdit) {
      toast.error(`Hanya pengguna dengan role Umat yang dapat memperbarui data`)
      return
    }
    
    // Tampilkan dialog konfirmasi
    showConfirmationDialog(
      "Tambah Data Tanggungan",
      "Apakah Anda yakin ingin menambah data Tanggungan?",
      async () => {
        if (!profileData) return
        
        try {
          setIsSaving(true)
          
          // Simulasi API call
          // TODO: Ganti dengan API call ke backend
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Generate ID untuk tanggungan baru (dalam implementasi nyata, ID akan dari backend)
          const newId = Math.max(0, ...profileData.dependents.map(d => d.id)) + 1
          
          // Buat objek tanggungan baru
          const newDependent: Dependent = {
            id: newId,
            name: values.name,
            birthDate: values.birthDate,
            birthPlace: values.birthPlace,
            gender: values.gender,
            education: values.education,
            religion: values.religion,
            maritalStatus: values.maritalStatus,
            dependentType: values.dependentType,
            baptismDate: values.baptismDate,
            confirmationDate: values.confirmationDate,
            imageUrl: values.imageUrl
          }
          
          // Update state dengan tanggungan baru
          const updatedDependents = [...profileData.dependents, newDependent]
          setProfileData({
            ...profileData,
            dependents: updatedDependents
          })
          
          // Sembunyikan form
          setShowDependentForm(false)
          setEditingDependent(null)
          
          toast.success("Data Tanggungan berhasil ditambahkan")
          
        } catch (error) {
          toast.error("Gagal menambah data tanggungan")
          console.error(error)
        } finally {
          setIsSaving(false)
        }
      }
    )
  }
  
  // Handler untuk mengupdate tanggungan
  const handleUpdateDependent = (values: DependentFormValues) => {
    // Cek apakah pengguna memiliki izin untuk memperbarui data
    if (!roleAccess.canEdit) {
      toast.error(`Hanya pengguna dengan role Umat yang dapat memperbarui data`)
      return
    }
    
    if (!editingDependent) return
    
    // Tampilkan dialog konfirmasi
    showConfirmationDialog(
      "Perbarui Data Tanggungan",
      "Apakah Anda yakin ingin memperbarui data Tanggungan?",
      async () => {
        if (!profileData) return
        
        try {
          setIsSaving(true)
          
          // Simulasi API call
          // TODO: Ganti dengan API call ke backend
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Update data tanggungan
          const updatedDependents = profileData.dependents.map(dependent => {
            if (dependent.id === editingDependent.id) {
              return {
                ...dependent,
                name: values.name,
                gender: values.gender,
                birthPlace: values.birthPlace,
                birthDate: values.birthDate,
                education: values.education,
                religion: values.religion,
                maritalStatus: values.maritalStatus,
                dependentType: values.dependentType,
                baptismDate: values.baptismDate,
                confirmationDate: values.confirmationDate
              }
            }
            return dependent
          })
          
          // Update state
          setProfileData({
            ...profileData,
            dependents: updatedDependents
          })
          
          // Sembunyikan form
          setShowDependentForm(false)
          setEditingDependent(null)
          
          toast.success("Data Tanggungan berhasil diperbarui")
          
        } catch (error) {
          toast.error("Gagal memperbarui data tanggungan")
          console.error(error)
        } finally {
          setIsSaving(false)
        }
      }
    )
  }
  
  // Handler untuk menghapus tanggungan
  const handleDeleteDependent = (dependent: Dependent) => {
    // Cek apakah pengguna memiliki izin untuk memperbarui data
    if (!roleAccess.canEdit) {
      toast.error(`Hanya pengguna dengan role Umat yang dapat memperbarui data`)
      return
    }
    
    // Tampilkan dialog konfirmasi
    showConfirmationDialog(
      "Hapus Data Tanggungan",
      `Apakah Anda yakin ingin menghapus data tanggungan ${dependent.name}?`,
      async () => {
        if (!profileData) return
        
        try {
          setIsSaving(true)
          
          // Simulasi API call
          // TODO: Ganti dengan API call ke backend
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Hapus tanggungan dari array
          const updatedDependents = profileData.dependents.filter(
            item => item.id !== dependent.id
          )
          
          // Update state
          setProfileData({
            ...profileData,
            dependents: updatedDependents
          })
          
          toast.success("Data Tanggungan berhasil dihapus")
          
        } catch (error) {
          toast.error("Gagal menghapus data tanggungan")
          console.error(error)
        } finally {
          setIsSaving(false)
        }
      }
    )
  }
  
  // Handler untuk membuka form edit tanggungan
  const handleEditDependent = (dependent: Dependent) => {
    // Cek apakah pengguna memiliki izin untuk memperbarui data
    if (!roleAccess.canEdit) {
      toast.error(`Hanya pengguna dengan role Umat yang dapat memperbarui data`)
      return
    }
    
    setEditingDependent(dependent)
    setShowDependentForm(true)
  }
  
  // Handler untuk membatalkan form tanggungan
  const handleCancelDependentForm = () => {
    setShowDependentForm(false)
    setEditingDependent(null)
  }
  
  // Wrapper untuk handle submit dari form tanggungan
  const handleDependentSubmit = (values: DependentFormValues) => {
    if (editingDependent) {
      handleUpdateDependent(values)
    } else {
      handleAddDependent(values)
    }
  }
  
  // Render alert banner untuk informasi role dan akses
  const renderRoleAccessAlert = () => {
    return (
      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {roleAccess.message}
        </AlertDescription>
      </Alert>
    )
  }
  
  // Render informasi identitas user berdasarkan role
  const renderUserInfo = () => {
    if (!profileData) return null;
    
    return (
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Informasi Akun</CardTitle>
            <Badge>{userRole}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/10">
              {profileData.familyHead.imageUrl ? (
                <AvatarImage 
                  src={profileData.familyHead.imageUrl} 
                  alt={profileData.familyHead.fullName} 
                />
              ) : (
                <AvatarFallback className="text-xl">
                  {getInitials(profileData.familyHead.fullName)}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{profileData.familyHead.fullName}</h3>
              <p className="text-sm text-muted-foreground">
                {profileData.familyHead.address}
              </p>
              <div className="flex gap-4 mt-1">
                <p className="text-sm text-muted-foreground">
                  {profileData.familyHead.phoneNumber}
                </p>
                {profileData.familyHead.email && (
                  <p className="text-sm text-muted-foreground">
                    {profileData.familyHead.email}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-primary rounded-full mb-2" aria-hidden="true"></div>
          <p className="text-sm text-muted-foreground">Memuat data profil...</p>
        </div>
      </div>
    )
  }
  
  if (!profileData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-destructive mb-2" />
          <p className="text-destructive">Gagal memuat data profil</p>
          <Button onClick={() => window.location.reload()} variant="outline" size="sm" className="mt-4">
            Coba Lagi
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tampilkan pesan akses berdasarkan role */}
      {renderRoleAccessAlert()}
      
      {/* Tampilkan informasi user */}
      {renderUserInfo()}
      
      {/* Tab data profil */}
      <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="kepala-keluarga">Kepala Keluarga</TabsTrigger>
          {profileData.familyHead.maritalStatus === MaritalStatus.MARRIED && (
            <TabsTrigger value="pasangan">Pasangan</TabsTrigger>
          )}
          <TabsTrigger value="tanggungan">Tanggungan</TabsTrigger>
        </TabsList>
        
        {/* Tab Kepala Keluarga */}
        <TabsContent value="kepala-keluarga" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center w-full md:w-1/4">
              <Avatar className="h-40 w-40 border-4 border-primary/10">
                {profileData.familyHead.imageUrl ? (
                  <AvatarImage src={profileData.familyHead.imageUrl} alt={profileData.familyHead.fullName} />
                ) : (
                  <AvatarFallback className="text-4xl">
                    {getInitials(profileData.familyHead.fullName)}
                  </AvatarFallback>
                )}
              </Avatar>
              {roleAccess.canEdit && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => handleImageUpload('familyHead')}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Ubah Foto
                </Button>
              )}
            </div>
            
            <div className="w-full md:w-3/4">
              <FamilyHeadForm 
                defaultValues={profileData.familyHead} 
                onSubmit={handleFamilyHeadSubmit}
                isSubmitting={isSaving}
                readOnly={!roleAccess.canEdit}
              />
            </div>
          </div>
        </TabsContent>
        
        {/* Tab Pasangan */}
        {profileData.familyHead.maritalStatus === MaritalStatus.MARRIED && (
          <TabsContent value="pasangan" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center w-full md:w-1/4">
                <Avatar className="h-40 w-40 border-4 border-primary/10">
                  {profileData.spouse?.imageUrl ? (
                    <AvatarImage src={profileData.spouse.imageUrl} alt={profileData.spouse?.fullName || ''} />
                  ) : (
                    <AvatarFallback className="text-4xl">
                      {profileData.spouse ? getInitials(profileData.spouse.fullName) : <User className="h-10 w-10" />}
                    </AvatarFallback>
                  )}
                </Avatar>
                {roleAccess.canEdit && profileData.spouse && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={() => handleImageUpload('spouse')}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Ubah Foto
                  </Button>
                )}
              </div>
              
              <div className="w-full md:w-3/4">
                <SpouseForm 
                  defaultValues={profileData.spouse || undefined} 
                  onSubmit={handleSpouseSubmit}
                  isSubmitting={isSaving}
                  readOnly={!roleAccess.canEdit}
                />
              </div>
            </div>
          </TabsContent>
        )}
        
        {/* Tab Tanggungan */}
        <TabsContent value="tanggungan" className="space-y-4">
          {showDependentForm ? (
            <DependentForm 
              defaultValues={editingDependent || undefined}
              onSubmit={handleDependentSubmit}
              onCancel={handleCancelDependentForm}
              isSubmitting={isSaving}
            />
          ) : (
            <>
              {profileData.dependents.length === 0 ? (
                <div className="text-center py-10 border rounded-lg">
                  <p className="text-muted-foreground mb-4">Belum ada data tanggungan</p>
                  {roleAccess.canEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDependentForm(true)}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Tambah Tanggungan
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Daftar Tanggungan</h3>
                    {roleAccess.canEdit && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDependentForm(true)}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Tambah Tanggungan
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {profileData.dependents.map((dependent) => (
                      <DependentItem
                        key={dependent.id}
                        dependent={dependent}
                        onEdit={handleEditDependent}
                        onDelete={handleDeleteDependent}
                        onImageUpload={handleImageUpload}
                        readOnly={!roleAccess.canEdit}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Dialog Konfirmasi */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmDialogProps.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialogProps.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Lanjutkan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 