"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { navMain } from "@/lib/nav-menu"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
}

export function AppSidebar({
  userRole = "SuperUser",
  ...props
}: React.ComponentProps<typeof Sidebar> & { userRole?: string }) {
  const pathname = usePathname()
  
  // Pastikan userRole ada di navMain, jika tidak, gunakan fallback menu yang pasti ada
  // Cek apakah userRole valid, jika tidak, gunakan menu "umat" atau menu pertama yang tersedia
  const validRole = navMain[userRole] ? userRole : "umat"
  const menuItems = navMain[validRole] || []

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <LayoutDashboard className="!size-5" />
                <span className="text-base font-semibold">Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={menuItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
