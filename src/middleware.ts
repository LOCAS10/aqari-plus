// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ المسارات المتاحة للجميع (لا تحتاج تسجيل)
  const publicPaths = [
    '/',
    '/login',
    '/properties',
    '/search',
    '/api', // إذا كان هناك API
    '/_next', // ملفات Next.js
  ];

  // ✅ المسارات المحمية (تحتاج تسجيل)
  const protectedPaths = [
    '/dashboard',
    '/favorites',
    '/archive',
  ];

  // ✅ التحقق
  const isPublic = publicPaths.some(path => pathname.startsWith(path));
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));

  // ✅ إذا كان محمياً - أعد توجيه لصفحة الدخول
  if (isProtected && !isPublic) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
