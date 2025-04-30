"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import Cookies from 'js-cookie'

// Available roles in the system
export const ROLES = {
  SUPER_USER: 'SuperUser',
  KETUA_LINGKUNGAN: 'ketuaLingkungan',
  SEKRETARIS: 'sekretaris',
  WAKIL_SEKRETARIS: 'wakilSekretaris',
  BENDAHARA: 'bendahara',
  WAKIL_BENDAHARA: 'wakilBendahara',
  WAKIL_KETUA: 'wakilKetua',
  UMAT: 'umat',
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
 * Mode Development dan Demo:
 * - Feature role selector tersedia melalui setDevelopmentRole
 * - Role disimpan dalam cookie "devUserRole" dengan masa berlaku 1 hari
 * - isDevelopmentMode = true menandakan aplikasi berjalan dalam mode development atau bahwa
 *   fitur development diaktifkan di production untuk tujuan demo
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<string>("umat")
  const [isLoading, setIsLoading] = useState(true)
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(false)

  // Initialize auth state from cookies on client
  useEffect(() => {
    // Safe check for browser environment
    if (typeof window === 'undefined') return;

    // Check if we're in development mode or demo mode is enabled
    const isDev = process.env.NODE_ENV === 'development';
    // Selalu aktifkan mode development untuk demo client
    setIsDevelopmentMode(true);
    
    // In development, use the environment variable if available
    const devRole = process.env.NEXT_PUBLIC_DEV_USER_ROLE;
    if (devRole) {
      setUserRole(devRole);
      setIsLoading(false);
      return;
    }
    
    // Check for dev role cookie first (for our temporary role selection feature)
    const devRoleCookie = Cookies.get("devUserRole");
    if (devRoleCookie) {
      setUserRole(devRoleCookie);
      setIsLoading(false);
      return;
    }
    
    // Fall back to regular user role cookie
    const storedRole = Cookies.get("userRole")
    if (storedRole) {
      setUserRole(storedRole)
    }
    setIsLoading(false)
  }, [])

  /**
   * Fungsi untuk mengatur role secara langsung untuk keperluan development/demo
   * Fitur ini sekarang juga tersedia di production untuk tujuan demo
   */
  const setDevelopmentRole = async (role: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Store role in cookies (1 day expiry for dev/demo purposes)
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
        role = "ketuaLingkungan"
        break
      case "sekretaris":
        role = "sekretaris"
        break
      case "wakilsekretaris":
        role = "wakilSekretaris"
        break
      case "bendahara":
        role = "bendahara"
        break
      case "wakilbendahara":
        role = "wakilBendahara"
        break
      case "wakilketua":
        role = "wakilKetua"
        break
      default:
        role = "umat"
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
    setUserRole("umat")
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