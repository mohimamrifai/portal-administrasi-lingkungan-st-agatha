"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    kepalakeluarga: "",
    passphrase: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [errors, setErrors] = useState<{
    kepalakeluarga?: string;
    passphrase?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({})
  const [isChecking, setIsChecking] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
    
    // Clear specific error when typing
    if (errors[id as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [id]: undefined }))
    }
  }

  const verifyKepalakeluarga = async () => {
    setIsChecking(true)
    // Simulate API call to check if Kepala Keluarga exists in database
    try {
      // Replace with actual API call
      setTimeout(() => {
        if (formData.kepalakeluarga.trim() === "") {
          setErrors(prev => ({ ...prev, kepalakeluarga: "Nama Kepala Keluarga tidak boleh kosong" }))
          setIsVerified(false)
        } else {
          // Assume verification is successful for demo
          setIsVerified(true)
          setErrors(prev => ({ ...prev, kepalakeluarga: undefined }))
          setStep(2)
        }
        setIsChecking(false)
      }, 1000)
    } catch (error) {
      setErrors(prev => ({ ...prev, kepalakeluarga: "Terjadi kesalahan saat verifikasi" }))
      setIsChecking(false)
    }
  }

  const verifyPassphrase = () => {
    if (!formData.passphrase.trim()) {
      setErrors(prev => ({ ...prev, passphrase: "Passphrase tidak boleh kosong" }))
      return
    }
    
    // Simulate passphrase verification
    // Replace with actual API call
    setStep(3)
    setErrors(prev => ({ ...prev, passphrase: undefined }))
  }

  const resetPassword = () => {
    const newErrors: typeof errors = {}
    
    if (!formData.newPassword) {
      newErrors.newPassword = "Password baru tidak boleh kosong"
    } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(formData.newPassword)) {
      newErrors.newPassword = "Password harus terdiri dari minimal 8 karakter, mengandung huruf dan angka"
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password tidak boleh kosong"
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password tidak cocok"
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    // Submit password reset
    // Replace with actual API call
    alert("Password berhasil diubah")
    // Redirect to login page
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-center md:text-base font-bold">Portal Administrasi Lingkungan St. Agatha</CardTitle>
          <CardDescription className="text-center md:text-sm">
            Reset Password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-6">
              {step === 1 && (
                <div className="grid gap-3">
                  <Label htmlFor="kepalakeluarga">Nama Kepala Keluarga</Label>
                  <Input
                    id="kepalakeluarga"
                    type="text"
                    placeholder="Masukkan Nama Kepala Keluarga"
                    value={formData.kepalakeluarga}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.kepalakeluarga && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {errors.kepalakeluarga}
                      </AlertDescription>
                    </Alert>
                  )}
                  <Button 
                    type="button" 
                    className="w-full mt-2"
                    onClick={verifyKepalakeluarga}
                    disabled={isChecking}
                  >
                    {isChecking ? "Memverifikasi..." : "Verifikasi"}
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-3">
                  <Label htmlFor="passphrase">Passphrase</Label>
                  <Input
                    id="passphrase"
                    type="text"
                    placeholder="Masukkan Passphrase"
                    value={formData.passphrase}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.passphrase && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {errors.passphrase}
                      </AlertDescription>
                    </Alert>
                  )}
                  <Button 
                    type="button" 
                    className="w-full mt-2"
                    onClick={verifyPassphrase}
                  >
                    Lanjutkan
                  </Button>
                </div>
              )}

              {step === 3 && (
                <>
                  <div className="grid gap-3">
                    <Label htmlFor="newPassword">Password Baru</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Masukkan Password Baru"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.newPassword && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {errors.newPassword}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="confirmPassword">Ulangi Password Baru</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Ulangi Password Baru"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.confirmPassword && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {errors.confirmPassword}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                  <Button 
                    type="button" 
                    className="w-full mt-2"
                    onClick={resetPassword}
                  >
                    Reset Password
                  </Button>
                </>
              )}
            </div>
            <div className="mt-4 text-center text-sm">
              <Link href="/login" className="underline underline-offset-4">
                Kembali ke halaman Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
