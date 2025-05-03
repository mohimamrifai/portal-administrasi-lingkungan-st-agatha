"use client"

import { 
  createContext, 
  useContext, 
  useState, 
  useEffect,
  ReactNode
} from "react"
import { useSession } from "next-auth/react"

// Tipe role pengguna
type UserRole = 
  | 'SuperUser' 
  | 'ketuaLingkungan' 
  | 'bendahara' 
  | 'wakilBendahara'
  | 'sekretaris'
  | 'wakilSekretaris'
  | 'adminLingkungan'
  | 'anggota'
  | 'umat'
  | 'guest'

// Interface konteks autentikasi
interface AuthContextType {
  isAuthenticated: boolean
  userRole: UserRole
  userId: string | null
  username: string | null
  logout: () => void
}

// Nilai default untuk konteks
const defaultContext: AuthContextType = {
  isAuthenticated: false,
  userRole: 'guest',
  userId: null,
  username: null,
  logout: () => {}
}

// Membuat konteks
const AuthContext = createContext<AuthContextType>(defaultContext)

// Hook untuk menggunakan konteks autentikasi
export const useAuth = () => useContext(AuthContext)

// Provider untuk konteks autentikasi
export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<UserRole>('guest')
  const [userId, setUserId] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)

  // Memeriksa autentikasi saat aplikasi dimuat atau session berubah
  useEffect(() => {
    // Jika session ada dan user memiliki role, update state
    if (session?.user) {
      setIsAuthenticated(true)
      
      // Ambil role dari session (ditambahkan ke session di NextAuth callbacks)
      const sessionRole = (session.user as any).role
      
      // Validasi role, pastikan role ada dalam daftar UserRole yang valid
      if (sessionRole && isValidUserRole(sessionRole)) {
        setUserRole(sessionRole as UserRole)
      } else {
        // Fallback ke guest jika role tidak valid
        setUserRole('guest')
      }
      
      // Ambil userId dan username
      // NextAuth user tidak memiliki id secara default, akses melalui any
      const userId = (session.user as any).id || null
      setUserId(userId)
      setUsername(session.user.name || null)
    } else {
      // Reset ke default jika tidak ada session
      setIsAuthenticated(false)
      setUserRole('guest')
      setUserId(null)
      setUsername(null)
    }
  }, [session, status])

  // Fungsi untuk memvalidasi user role
  function isValidUserRole(role: string): role is UserRole {
    return [
      'SuperUser', 
      'ketuaLingkungan', 
      'bendahara', 
      'wakilBendahara',
      'sekretaris',
      'wakilSekretaris',
      'adminLingkungan',
      'anggota',
      'umat',
      'guest'
    ].includes(role as UserRole)
  }

  // Nilai konteks yang akan disediakan
  const contextValue: AuthContextType = {
    isAuthenticated,
    userRole,
    userId,
    username,
    logout: () => {} // Kosong, karena logout sebenarnya menggunakan signOut dari next-auth
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
} 