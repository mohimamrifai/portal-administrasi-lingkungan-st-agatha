import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/contexts/auth-context"
import { AppClientWrapper, HeaderClientWrapper } from "@/components/client-wrappers"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portal Administrasi Lingkungan St. Agatha",
  description: "Portal Administrasi Lingkungan St. Agatha",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={`${geistSans.variable} ${geistMono.variable} font-geist-sans`}>
        <AuthProvider>
          <SidebarProvider
            style={
              {
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
              } as React.CSSProperties
            }
          >
            <AppClientWrapper />
            <SidebarInset>
              <HeaderClientWrapper />
              <main className="flex flex-1 flex-col">
                {children}
              </main>
            </SidebarInset>
          </SidebarProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
