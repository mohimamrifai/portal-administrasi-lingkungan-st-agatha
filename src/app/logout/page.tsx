"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function LogoutPage() {
  const { logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Panggil fungsi logout dan redirect ke halaman login
    logout()
    router.push("/login")
  }, [logout, router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p>Logging out...</p>
      </div>
    </div>
  )
} 