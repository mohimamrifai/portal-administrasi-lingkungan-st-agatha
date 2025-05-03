import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const routeAccessMap: { [key: string]: string[] } = {
  '/dashboard': ['SuperUser', 'ketuaLingkungan', 'wakilKetua', 'sekretaris', 'wakilSekretaris', 'bendahara', 'wakilBendahara', 'umat'],
  '/lingkungan': ['SuperUser', 'ketuaLingkungan', 'wakilKetua', 'bendahara'],
  '/lingkungan/kas': ['SuperUser', 'ketuaLingkungan', 'wakilKetua', 'bendahara'],
  '/lingkungan/mandiri': ['SuperUser', 'ketuaLingkungan', 'wakilKetua', 'bendahara'],
  '/ikata': ['SuperUser', 'ketuaLingkungan', 'wakilKetua', 'wakilBendahara'],
  '/ikata/kas': ['SuperUser', 'ketuaLingkungan', 'wakilKetua', 'wakilBendahara'],
  '/ikata/monitoring': ['SuperUser', 'ketuaLingkungan', 'wakilKetua', 'wakilBendahara'],
  '/kesekretariatan': ['SuperUser', 'ketuaLingkungan', 'wakilKetua', 'sekretaris', 'wakilSekretaris', 'bendahara', 'wakilBendahara', 'umat'],
  '/kesekretariatan/umat': ['SuperUser', 'ketuaLingkungan', 'wakilKetua', 'sekretaris', 'wakilSekretaris'],
  '/kesekretariatan/doling': ['SuperUser', 'ketuaLingkungan', 'wakilKetua', 'sekretaris', 'wakilSekretaris'],
  '/kesekretariatan/kaleidoskop': ['SuperUser', 'sekretaris', 'wakilSekretaris'],
  '/kesekretariatan/agenda': ['SuperUser', 'ketuaLingkungan', 'wakilKetua', 'sekretaris', 'wakilSekretaris', 'bendahara', 'wakilBendahara', 'umat'],
  '/publikasi': ['SuperUser', 'ketuaLingkungan', 'wakilKetua', 'sekretaris', 'wakilSekretaris', 'bendahara', 'wakilBendahara'],
  '/approval': ['SuperUser', 'ketuaLingkungan', 'wakilKetua', 'bendahara'],
  '/histori-pembayaran': ['SuperUser', 'umat'],
  '/pengaturan': ['SuperUser', 'ketuaLingkungan', 'wakilKetua', 'sekretaris', 'wakilSekretaris', 'bendahara', 'wakilBendahara', 'umat'],
  '/pengaturan/profil': ['SuperUser', 'umat'],
  '/pengaturan/password': ['SuperUser', 'ketuaLingkungan', 'wakilKetua', 'sekretaris', 'wakilSekretaris', 'bendahara', 'wakilBendahara', 'umat'],
  '/pengaturan/wipe': ['SuperUser'],
}

const checkAccess = (path: string, role: string): boolean => {
  if (!role) return false
  if (routeAccessMap[path]) {
    return routeAccessMap[path].includes(role)
  }
  const pathSegments = path.split('/').filter(Boolean)
  let currentPath = ''
  for (let i = 0; i < pathSegments.length; i++) {
    currentPath = `/${pathSegments.slice(0, i + 1).join('/')}`
    if (routeAccessMap[currentPath]) {
      return routeAccessMap[currentPath].includes(role)
    }
  }
  return false
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  // Skip static, api, dsb
  if (
    path.includes('/_next') ||
    path.startsWith('/api') ||
    path.includes('/static') ||
    path === '/'
  ) {
    return NextResponse.next()
  }
  // Allow public routes (login, register, forgot-password, dsb)
  const publicRoutes = ['/login', '/register', '/forgot-password', '/verify', '/__nextjs_original-stack-frame']
  if (publicRoutes.includes(path)) {
    // Jika sudah login, redirect ke dashboard
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (token?.role) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }
  // Ambil session NextAuth.js
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  const userRole = token?.role as string | undefined
  if (!userRole) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if (!checkAccess(path, userRole)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 