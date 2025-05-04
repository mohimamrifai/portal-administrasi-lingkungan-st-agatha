"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "../contexts/auth-context"
import { NotificationIndicator } from "./notification-indicator"

interface SiteHeaderProps {
  userRole?: string
}

// Format nama role untuk tampilan
const formatRoleName = (role: string) => {
  switch(role) {
    case 'SuperUser':
      return 'Super User';
    case 'ketuaLingkungan':
      return 'Ketua Lingkungan';
    case 'wakilKetua':
      return 'Wakil Ketua';
    case 'sekretaris':
      return 'Sekretaris';
    case 'wakilSekretaris':
      return 'Wakil Sekretaris';
    case 'bendahara':
      return 'Bendahara';
    case 'wakilBendahara':
      return 'Wakil Bendahara';
    case 'umat':
      return 'Umat';
    default:
      return role;
  }
}

export function SiteHeader({ userRole = "umat" }: SiteHeaderProps) {
  const { userRole: currentRole } = useAuth()
  
  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b p-2">
      <div className="flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium hidden md:block">Portal Administrasi Lingkungan St. Agatha</h1>
        </div>
        <div className="flex items-center gap-2">
          <NotificationIndicator />
          <Badge variant="outline" className="text-muted-foreground">
            {formatRoleName(currentRole)}
          </Badge>
        </div>
      </div>
    </header>
  )
}
