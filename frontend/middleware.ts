import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard', '/adventure', '/inventory'];
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token')?.value;

  // Redirection des routes protégées si non authentifié
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirection des routes d'auth si déjà connecté
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
