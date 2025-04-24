"use client"

import { useState, useEffect } from "react"
import { Trash2, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import SelectiveWipeTab from "./selective-wipe-tab"
import EmergencyWipeTab from "./emergency-wipe-tab"
import { wipeData, emergencyWipe, getDataTypeLabel } from "../utils"
import { DataType, WipeMode } from "../types"

export default function WipeContent() {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [dataType, setDataType] = useState<string>("")
  const [confirmText, setConfirmText] = useState("")
  const [backupConfirm, setBackupConfirm] = useState(false)
  const [activeTab, setActiveTab] = useState<WipeMode>("selective")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  
  const { userRole } = useAuth()
  const router = useRouter()
  
  // Redirect jika bukan SuperUser
  useEffect(() => {
    if (userRole !== "SuperUser") {
      toast.error("Anda tidak memiliki akses ke halaman ini")
      router.push("/dashboard")
    }
  }, [userRole, router])

  const resetForm = () => {
    setStartDate(undefined)
    setEndDate(undefined)
    setDataType("")
    setConfirmText("")
    setBackupConfirm(false)
  }

  const handleWipeData = async () => {
    setIsProcessing(true)
    
    try {
      if (activeTab === "selective") {
        await wipeData({
          dataType: dataType as DataType,
          startDate,
          endDate
        })
      } else {
        await emergencyWipe({
          confirmText
        })
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghapus data")
      console.error("Error while wiping data:", error)
    } finally {
      setIsProcessing(false)
      resetForm()
      setShowConfirmation(false)
    }
  }
  
  const isSelectiveFormValid = startDate && endDate && dataType && confirmText === "KONFIRMASI" && backupConfirm
  const isEmergencyFormValid = confirmText === "EMERGENCY WIPE" && backupConfirm

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Wipe Data</CardTitle>
          <CardDescription>
            Halaman ini hanya dapat diakses oleh SuperUser. Fitur ini digunakan untuk menghapus data berdasarkan parameter tertentu.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-6">
            <ShieldAlert className="h-5 w-5" />
            <AlertTitle className="text-lg">Area Terbatas!</AlertTitle>
            <AlertDescription>
              Area ini hanya untuk SuperUser. Tindakan yang dilakukan di halaman ini akan berdampak permanen pada database sistem.
            </AlertDescription>
          </Alert>
          
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as WipeMode)} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="selective">Penghapusan Selektif</TabsTrigger>
              <TabsTrigger value="emergency">Emergency Wipe</TabsTrigger>
            </TabsList>
            
            <TabsContent value="selective" className="mt-4">
              <SelectiveWipeTab 
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                dataType={dataType}
                setDataType={setDataType}
                confirmText={confirmText}
                setConfirmText={setConfirmText}
                backupConfirm={backupConfirm}
                setBackupConfirm={setBackupConfirm}
              />
            </TabsContent>
            
            <TabsContent value="emergency" className="mt-4">
              <EmergencyWipeTab 
                confirmText={confirmText}
                setConfirmText={setConfirmText}
                backupConfirm={backupConfirm}
                setBackupConfirm={setBackupConfirm}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <Button 
            variant="outline" 
            onClick={resetForm}
            disabled={isProcessing}
          >
            Reset
          </Button>
          
          {activeTab === "selective" ? (
            <Button 
              variant="destructive" 
              className="ml-auto"
              disabled={!isSelectiveFormValid || isProcessing}
              onClick={() => setShowConfirmation(true)}
            >
              {isProcessing ? (
                <>
                  <span className="mr-2">Memproses...</span>
                  <span className="animate-spin">⏳</span>
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Hapus Data Selektif
                </>
              )}
            </Button>
          ) : (
            <Button 
              variant="destructive" 
              className="ml-auto"
              disabled={!isEmergencyFormValid || isProcessing}
              onClick={() => setShowConfirmation(true)}
            >
              {isProcessing ? (
                <>
                  <span className="mr-2">Memproses...</span>
                  <span className="animate-spin">⏳</span>
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Emergency Wipe
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
      
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan Data</AlertDialogTitle>
            <AlertDialogDescription>
              {activeTab === "selective" ? (
                `Tindakan ini akan menghapus permanen ${dataType ? getDataTypeLabel(dataType as DataType) : ""} dari ${startDate ? startDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : "..."} hingga ${endDate ? endDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : "..."}.`
              ) : (
                "TINDAKAN INI AKAN MENGHAPUS PERMANEN SELURUH DATA DALAM SISTEM. PASTIKAN ANDA BENAR-BENAR YAKIN DAN TELAH MEMBUAT BACKUP LENGKAP."
              )}
            </AlertDialogDescription>
            
            <div className="mt-4 text-red-600 font-bold text-sm">
              Data yang sudah dihapus tidak dapat dikembalikan.
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleWipeData}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700"
            >
              {isProcessing ? (
                <span className="flex items-center">
                  <span className="mr-2">Memproses</span>
                  <span className="animate-spin">⏳</span>
                </span>
              ) : (
                <>
                  Ya, Hapus Data
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 