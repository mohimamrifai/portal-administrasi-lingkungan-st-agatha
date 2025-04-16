"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import Cookies from 'js-cookie'

// Available roles in the system
export const ROLES = {
  SUPER_USER: 'SuperUser',
  KETUA: 'Ketua',
  WAKIL_KETUA: 'WakilKetua',
  SEKRETARIS: 'Sekretaris',
  WAKIL_SEKRETARIS: 'WakilSekretaris',
  BENDAHARA: 'Bendahara',
  WAKIL_BENDAHARA: 'WakilBendahara',
  UMAT: 'Umat',
};

interface AuthContextType {
  userRole: string
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Initialize with environment variable for development, or default to "Umat"
  const defaultRole = 
    typeof window !== 'undefined' && window.process?.env?.NEXT_PUBLIC_DEV_USER_ROLE 
    ? window.process.env.NEXT_PUBLIC_DEV_USER_ROLE 
    : "Umat";
  
  const [userRole, setUserRole] = useState<string>(defaultRole)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state from cookies on client
  useEffect(() => {
    // In development, use the environment variable if available
    if (process.env.NEXT_PUBLIC_DEV_USER_ROLE) {
      setUserRole(process.env.NEXT_PUBLIC_DEV_USER_ROLE);
      setIsLoading(false);
      return;
    }
    
    // In production, use stored cookie
    const storedRole = Cookies.get("userRole")
    if (storedRole) {
      setUserRole(storedRole)
    }
    setIsLoading(false)
  }, [])

  // Mock login function (to be replaced with real authentication)
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock role assignment based on username
    // In a real app, this would come from the backend
    let role: string
    switch (username.toLowerCase()) {
      case "admin":
        role = "SuperUser"
        break
      case "ketua":
        role = "Ketua"
        break
      case "wakilketua":
        role = "WakilKetua"
        break  
      case "sekretaris":
        role = "Sekretaris"
        break
      case "wakilsekretaris":
        role = "WakilSekretaris"
        break
      case "bendahara":
        role = "Bendahara"
        break
      case "wakilbendahara":
        role = "WakilBendahara"
        break
      default:
        role = "Umat"
    }
    
    // Store role in cookies (7 day expiry)
    Cookies.set("userRole", role, { expires: 7 })
    setUserRole(role)
    setIsLoading(false)
    
    return true
  }

  const logout = () => {
    Cookies.remove("userRole")
    setUserRole("Umat")
    // Redirect to login page would happen in the component
  }

  const value = {
    userRole,
    isLoading,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 