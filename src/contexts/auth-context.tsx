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
  isDevelopmentMode: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  setDevelopmentRole: (role: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * AuthProvider - Menyediakan konteks autentikasi untuk aplikasi
 * 
 * Mode Development:
 * - Feature role selector tersedia melalui setDevelopmentRole
 * - Role disimpan dalam cookie "devUserRole" dengan masa berlaku 1 hari
 * - isDevelopmentMode = true menandakan aplikasi berjalan dalam mode development
 * 
 * Catatan: Fitur ini hanya untuk keperluan development dan tidak akan tersedia di production.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<string>("Umat")
  const [isLoading, setIsLoading] = useState(true)
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(false)

  // Initialize auth state from cookies on client
  useEffect(() => {
    // Safe check for browser environment
    if (typeof window === 'undefined') return;

    // Check if we're in development mode
    const isDev = process.env.NODE_ENV === 'development';
    setIsDevelopmentMode(isDev);
    
    // In development, use the environment variable if available
    const devRole = process.env.NEXT_PUBLIC_DEV_USER_ROLE;
    if (devRole) {
      setUserRole(devRole);
      setIsLoading(false);
      return;
    }
    
    // Check for dev role cookie first (for our temporary role selection feature)
    const devRoleCookie = Cookies.get("devUserRole");
    if (isDev && devRoleCookie) {
      setUserRole(devRoleCookie);
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

  /**
   * Fungsi untuk mengatur role secara langsung untuk keperluan development
   * Fungsi ini hanya tersedia dalam mode development dan akan mereturn false di production
   */
  const setDevelopmentRole = async (role: string): Promise<boolean> => {
    if (process.env.NODE_ENV !== 'development') {
      console.warn('Development role selection is only available in development mode');
      return false;
    }
    
    setIsLoading(true);
    
    // Store role in cookies (1 day expiry for dev purposes)
    Cookies.set("devUserRole", role, { expires: 1 });
    setUserRole(role);
    setIsLoading(false);
    
    return true;
  }

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
    Cookies.remove("devUserRole")
    setUserRole("Umat")
    // Redirect to login page would happen in the component
  }

  const value = {
    userRole,
    isLoading,
    isDevelopmentMode,
    login,
    logout,
    setDevelopmentRole
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