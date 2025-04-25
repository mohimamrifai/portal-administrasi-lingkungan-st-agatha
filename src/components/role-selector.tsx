"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { ROLES } from "@/contexts/auth-context"
import { useState } from "react"
import { Loader2, InfoIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function RoleSelector() {
  const { setDevelopmentRole } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const handleRoleSelect = async (role: string) => {
    setSelectedRole(role)
    setIsLoading(true)
    
    try {
      // Set role untuk keperluan development/demo
      await setDevelopmentRole(role)
      router.push("/dashboard")
    } catch (error) {
      console.error("Error setting role:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-center text-base font-bold">Mode Demo</CardTitle>
        <CardDescription className="text-center text-sm">
          Pilih role untuk mencoba fitur sebagai pengguna berbeda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(ROLES).map(([key, role]) => (
            <Button
              key={key}
              variant={selectedRole === role ? "default" : "outline"}
              className="p-2 w-full"
              onClick={() => handleRoleSelect(role)}
              disabled={isLoading}
            >
              {isLoading && selectedRole === role ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {role}
            </Button>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Alert className="w-full">
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            Fitur ini memungkinkan Anda mencoba semua peran untuk tujuan demonstrasi.
          </AlertDescription>
        </Alert>
      </CardFooter>
    </Card>
  )
} 