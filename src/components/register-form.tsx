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
import { AlertCircle, Eye, EyeOff } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [formData, setFormData] = useState({
    kepalakeluarga: "",
    username: "",
    password: "",
    passphrase: "",
  })
  const [errors, setErrors] = useState<{
    kepalakeluarga?: string;
    username?: string;
    password?: string;
    passphrase?: string;
  }>({})
  const [isChecking, setIsChecking] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showPassphrase, setShowPassphrase] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const togglePassphraseVisibility = () => {
    setShowPassphrase(!showPassphrase)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
    
    // Clear specific error when typing
    if (errors[id as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [id]: undefined }))
    }
  }

  const checkKepalakeluarga = async () => {
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
        }
        setIsChecking(false)
      }, 1000)
    } catch (error) {
      setErrors(prev => ({ ...prev, kepalakeluarga: "Terjadi kesalahan saat verifikasi" }))
      setIsChecking(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    const newErrors: typeof errors = {}
    
    if (!isVerified) {
      newErrors.kepalakeluarga = "Silahkan verifikasi Nama Kepala Keluarga terlebih dahulu"
    }
    
    if (!formData.username) {
      newErrors.username = "Username tidak boleh kosong"
    }
    
    if (!formData.password) {
      newErrors.password = "Password tidak boleh kosong"
    } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(formData.password)) {
      newErrors.password = "Password harus terdiri dari minimal 8 karakter, mengandung huruf dan angka"
    }
    
    if (!formData.passphrase) {
      newErrors.passphrase = "Passphrase tidak boleh kosong"
    } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(formData.passphrase)) {
      newErrors.passphrase = "Passphrase harus terdiri dari minimal 8 karakter, mengandung huruf dan angka"
    }
    
    setErrors(newErrors)
    
    // If no errors, submit form
    if (Object.keys(newErrors).length === 0) {
      // Submit form logic here
      console.log("Form submitted:", formData)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-center md:text-base font-bold">Portal Administrasi Lingkungan St. Agatha</CardTitle>
          <CardDescription className="text-center md:text-sm">
            Silahkan Register untuk mengakses portal administrasi lingkungan St. Agatha
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="kepalakeluarga">Nama Kepala Keluarga</Label>
                <div className="flex gap-2">
                  <Input
                    id="kepalakeluarga"
                    type="text"
                    placeholder="Masukkan Nama Kepala Keluarga"
                    value={formData.kepalakeluarga}
                    onChange={handleInputChange}
                    disabled={isVerified}
                    required
                  />
                  <Button 
                    type="button" 
                    onClick={checkKepalakeluarga} 
                    disabled={isChecking || isVerified}
                    className="whitespace-nowrap"
                  >
                    {isChecking ? "Memeriksa..." : isVerified ? "Terverifikasi" : "Verifikasi"}
                  </Button>
                </div>
                {errors.kepalakeluarga && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.kepalakeluarga}</AlertDescription>
                  </Alert>
                )}
                {isVerified && (
                  <Alert className="py-2 bg-green-50 text-green-800 border-green-200">
                    <AlertDescription>Nama Kepala Keluarga terverifikasi</AlertDescription>
                  </Alert>
                )}
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Masukkan Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={!isVerified}
                  required
                />
                {errors.username && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.username}</AlertDescription>
                  </Alert>
                )}
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Masukkan Password" 
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={!isVerified}
                    required 
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={togglePasswordVisibility}
                    disabled={!isVerified}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500 cursor-pointer" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500 cursor-pointer" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.password}</AlertDescription>
                  </Alert>
                )}
                <p className="text-xs text-muted-foreground">
                  Password harus terdiri dari minimal 8 karakter, mengandung huruf dan angka
                </p>
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="passphrase">Passphrase (untuk reset password)</Label>
                <div className="relative">
                  <Input 
                    id="passphrase" 
                    type={showPassphrase ? "text" : "password"} 
                    placeholder="Masukkan Passphrase" 
                    value={formData.passphrase}
                    onChange={handleInputChange}
                    disabled={!isVerified}
                    required 
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={togglePassphraseVisibility}
                    disabled={!isVerified}
                  >
                    {showPassphrase ? (
                      <EyeOff className="h-4 w-4 text-gray-500 cursor-pointer" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500 cursor-pointer" />
                    )}
                  </button>
                </div>
                {errors.passphrase && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.passphrase}</AlertDescription>
                  </Alert>
                )}
                <p className="text-xs text-muted-foreground">
                  Passphrase digunakan untuk reset password. Harus terdiri dari minimal 8 karakter, mengandung huruf dan angka
                </p>
              </div>
              
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={!isVerified}>
                  Daftar
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Sudah punya akun?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Silahkan Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
