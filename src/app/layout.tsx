import "./globals.css"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { ClientSessionProvider } from "@/components/client-session-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Portal Administrasi Lingkungan St. Agatha",
  description: "Portal administrasi untuk lingkungan St. Agatha",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <ClientSessionProvider>
          {children}
          <Toaster />
        </ClientSessionProvider>
      </body>
    </html>
  )
}
