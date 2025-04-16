import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"

interface SiteHeaderProps {
  userRole?: string
}

export function SiteHeader({ userRole = "Umat" }: SiteHeaderProps) {
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
          <Badge variant="outline" className="text-muted-foreground">
            {userRole}
          </Badge>
        </div>
      </div>
    </header>
  )
}
