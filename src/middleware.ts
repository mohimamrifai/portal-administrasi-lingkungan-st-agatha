import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { navMain } from '@/lib/nav-menu'
import { getDevUserRole } from '@/lib/env-config'

// Map for route to role access
// This defines which roles can access which routes
const routeAccessMap: Record<string, string[]> = {
  '/dashboard': ['SuperUser', 'Ketua', 'WakilKetua', 'Sekretaris', 'WakilSekretaris', 'Bendahara', 'WakilBendahara', 'Umat'],
  
  '/lingkungan/kas': ['SuperUser', 'Ketua', 'WakilKetua', 'Bendahara', 'WakilBendahara'],
  '/lingkungan/mandiri': ['SuperUser', 'Ketua', 'WakilKetua', 'Bendahara', 'WakilBendahara'],
  
  '/ikata/kas': ['SuperUser', 'Ketua', 'WakilKetua', 'Bendahara', 'WakilBendahara'],
  '/ikata/monitoring': ['SuperUser', 'Ketua', 'WakilKetua', 'Bendahara', 'WakilBendahara'],
  
  '/kesekretariatan/umat': ['SuperUser', 'Ketua', 'WakilKetua', 'Sekretaris', 'WakilSekretaris', 'Bendahara', 'WakilBendahara'],
  '/kesekretariatan/doling': ['SuperUser', 'Ketua', 'WakilKetua', 'Sekretaris', 'WakilSekretaris', 'Umat'],
  '/kesekretariatan/agenda': ['SuperUser', 'Ketua', 'WakilKetua', 'Sekretaris', 'WakilSekretaris', 'Bendahara', 'WakilBendahara', 'Umat'],
  
  '/publikasi': ['SuperUser', 'Ketua', 'WakilKetua', 'Sekretaris', 'WakilSekretaris', 'Umat'],
  '/publikasi/buat': ['SuperUser', 'Sekretaris', 'WakilSekretaris'],
  
  '/approval': ['SuperUser', 'Bendahara'],
  
  '/histori': ['SuperUser', 'Ketua', 'WakilKetua', 'Sekretaris', 'WakilSekretaris', 'Bendahara', 'WakilBendahara', 'Umat'],
  
  '/pengaturan/profil': ['SuperUser', 'Umat'],
  '/pengaturan/password': ['SuperUser', 'Ketua', 'WakilKetua', 'Sekretaris', 'WakilSekretaris', 'Bendahara', 'WakilBendahara', 'Umat'],
  '/pengaturan/wipe': ['SuperUser'],
}

export function middleware(request: NextRequest) {
  // Skip middleware on public routes
  if (
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/register') ||
    request.nextUrl.pathname.startsWith('/forgot-password')
  ) {
    return NextResponse.next()
  }

  // For development purposes, use the environment variable
  // In production, this would come from a session or cookie
  const userRole = process.env.NODE_ENV === 'development'
    ? getDevUserRole()
    : request.cookies.get("userRole")?.value || 'Umat';

  // Check if user is authenticated
  if (!userRole) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Check if user has access to the requested route
  const path = request.nextUrl.pathname
  const hasAccess = checkAccess(path, userRole)

  if (!hasAccess) {
    // Redirect to dashboard if user doesn't have access
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// Helper function to check if a user has access to a route
function checkAccess(path: string, role: string): boolean {
  // Check direct route access
  if (routeAccessMap[path] && routeAccessMap[path].includes(role)) {
    return true
  }

  // Check parent routes access
  for (const route in routeAccessMap) {
    if (path.startsWith(route) && routeAccessMap[route].includes(role)) {
      return true
    }
  }

  // Check if route is accessible through menu items
  const menuItems = navMain[role] || []
  for (const item of menuItems) {
    if (item.path === path) {
      return true
    }
    
    if (item.children) {
      for (const child of item.children) {
        if (child.path === path) {
          return true
        }
      }
    }
  }

  return false
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all routes except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ],
} 