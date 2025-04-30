"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { Bell } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface SiteHeaderProps {
  userRole?: string
}

function NotificationList() {
  const notifications = [
    {
      id: 1,
      title: "Pengumuman Rapat",
      message: "Rapat pengurus akan diadakan besok",
      time: "5 menit yang lalu"
    },
    {
      id: 2, 
      title: "Laporan Baru",
      message: "Ada laporan keuangan baru yang perlu direview",
      time: "1 jam yang lalu"
    }
  ]

  return (
    <div className="w-[320px]">
      <div className="flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h4 className="font-semibold">Notifikasi</h4>
          <Button variant="ghost" size="sm" className="text-xs hover:bg-muted">
            Tandai sudah dibaca
          </Button>
        </div>
        
        <div className="py-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="px-4 py-2.5 hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 space-y-1">
                  <p className="font-medium text-sm leading-none">{notification.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
                </div>
                <span className="text-[11px] text-muted-foreground whitespace-nowrap">{notification.time}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t px-4 py-2">
          <Button variant="ghost" className="w-full justify-center text-sm hover:bg-muted">
            Lihat semua notifikasi
          </Button>
        </div>
      </div>
    </div>
  )
}

export function SiteHeader({ userRole = "umat" }: SiteHeaderProps) {
  const { userRole: currentRole, isDevelopmentMode } = useAuth()
  
  // Format display role name untuk tampilan badge
  const formatRoleName = (role: string): string => {
    switch(role) {
      case 'SuperUser': return 'Super User';
      case 'ketuaLingkungan': return 'Ketua Lingkungan';
      case 'sekretaris': return 'Sekretaris';
      case 'wakilSekretaris': return 'Wakil Sekretaris';
      case 'bendahara': return 'Bendahara';
      case 'wakilBendahara': return 'Wakil Bendahara';
      case 'wakilKetua': return 'Wakil Ketua';
      case 'umat': return 'Umat';
      default: return role;
    }
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) sticky top-0 z-50 bg-background">
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
          {isDevelopmentMode && (
            <Badge variant="secondary" className="mr-2">
              DEMO MODE
            </Badge>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-destructive text-destructive-foreground text-xs font-medium rounded-full flex items-center justify-center px-1 text-white">
                  2
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="p-0 w-auto">
              <NotificationList />
            </PopoverContent>
          </Popover>
          <Badge variant="outline" className="text-muted-foreground">
            {formatRoleName(currentRole)}
          </Badge>
        </div>
      </div>
    </header>
  )
}
