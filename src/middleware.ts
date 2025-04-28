import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isValidRole, getDevUserRole, VALID_ROLES } from './lib/env-config'

const unAuthRoutes = ['/login', '/forgot-password', '/verify', '/__nextjs_original-stack-frame']
const rootFiles = ['/favicon.ico', '/manifest.json']

type RouteAccess = {
  [key: string]: string[]
}

const routeAccessMap: RouteAccess = {
  '/dashboard': ['SuperUser', 'ketuaLingkungan', 'wakilKetua', 'sekretaris', 'wakilSekretaris', 'bendahara', 'wakilBendahara', 'adminLingkungan', 'umat'],
  
  '/lingkungan': ['SuperUser', 'wakilKetua', 'bendahara', 'adminLingkungan'],
  '/lingkungan/kas': ['SuperUser', 'wakilKetua', 'bendahara', 'adminLingkungan'],
  '/lingkungan/mandiri': ['SuperUser', 'wakilKetua', 'bendahara', 'adminLingkungan'],
  
  '/ikata': ['SuperUser', 'wakilKetua', 'wakilBendahara', 'adminLingkungan'],
  '/ikata/kas': ['SuperUser', 'wakilKetua', 'wakilBendahara', 'adminLingkungan'],
  '/ikata/monitoring': ['SuperUser', 'wakilKetua', 'wakilBendahara', 'adminLingkungan'],
  
  '/kesekretariatan': ['SuperUser', 'ketuaLingkungan', 'wakilKetua', 'sekretaris', 'wakilSekretaris', 'bendahara', 'wakilBendahara', 'adminLingkungan', 'umat'],
  '/kesekretariatan/umat': ['SuperUser', 'wakilKetua', 'sekretaris', 'wakilSekretaris', 'adminLingkungan'],
  '/kesekretariatan/doling': ['SuperUser', 'ketuaLingkungan', 'wakilKetua', 'sekretaris', 'wakilSekretaris', 'umat'],
  '/kesekretariatan/agenda': ['SuperUser', 'ketuaLingkungan', 'wakilKetua', 'sekretaris', 'wakilSekretaris', 'bendahara', 'wakilBendahara', 'adminLingkungan'],
  
  '/publikasi': ['SuperUser', 'ketuaLingkungan', 'wakilKetua', 'sekretaris', 'wakilSekretaris', 'bendahara', 'wakilBendahara', 'adminLingkungan'],
  
  '/approval': ['SuperUser', 'bendahara'],
  
  '/histori-pembayaran': ['SuperUser', 'umat'],
  
  '/pengaturan': ['SuperUser', 'ketuaLingkungan', 'wakilKetua', 'sekretaris', 'wakilSekretaris', 'bendahara', 'wakilBendahara', 'adminLingkungan', 'umat'],
  '/pengaturan/profil': ['SuperUser', 'ketuaLingkungan', 'wakilKetua', 'sekretaris', 'wakilSekretaris', 'bendahara', 'wakilBendahara', 'adminLingkungan', 'umat'],
  '/pengaturan/password': ['SuperUser', 'ketuaLingkungan', 'wakilKetua', 'sekretaris', 'wakilSekretaris', 'bendahara', 'wakilBendahara', 'adminLingkungan', 'umat'],
  '/pengaturan/wipe': ['SuperUser'],
}

const checkAccess = (path: string, role: string): boolean => {
  // If it's an undefined route or user role, deny access
  if (!role || !isValidRole(role)) return false

  // Looking for exact match first
  if (routeAccessMap[path]) {
    return routeAccessMap[path].includes(role)
  }

  // Looking for path segment matches
  // Find the closest parent path that has a defined access control
  const pathSegments = path.split('/').filter(Boolean)
  let currentPath = ''

  for (let i = 0; i < pathSegments.length; i++) {
    currentPath = `/${pathSegments.slice(0, i + 1).join('/')}`
    if (routeAccessMap[currentPath]) {
      return routeAccessMap[currentPath].includes(role)
    }
  }

  // If no matches found, deny access
  return false
}

export function middleware(request: NextRequest) {
  // Get the path from the request
  const path = request.nextUrl.pathname

  // Skip for static files, api routes and next internals
  if (
    path.includes('/_next') ||
    path.startsWith('/api') ||
    path.includes('/static') ||
    rootFiles.some((file) => path === file) ||
    path === '/'
  ) {
    return NextResponse.next()
  }

  // For login-related routes, if user is already authenticated, redirect to dashboard
  if (unAuthRoutes.includes(path)) {
    // If userRole cookie exists, user is logged in already
    const userRoleCookie = request.cookies.get('userRole')
    if (userRoleCookie?.value) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // For all other routes, check if user is authenticated
  
  // Check for development role first (in both environments)
  const devRoleCookie = request.cookies.get('devUserRole')
  let userRole = devRoleCookie?.value
  
  // If not in dev mode with role set, use the regular role cookie
  if (!userRole) {
    const userRoleCookie = request.cookies.get('userRole')
    userRole = userRoleCookie?.value || (process.env.NODE_ENV === 'development' ? getDevUserRole() : undefined)
  }

  // If role doesn't exist or is invalid, redirect to login
  if (!userRole || !isValidRole(userRole)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Check if user has access to the route
  if (!checkAccess(path, userRole)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 