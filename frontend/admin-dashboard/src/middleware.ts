import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Bỏ qua middleware cho các static files và API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Kiểm tra nếu đang truy cập dashboard mà chưa đăng nhập
  if (pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('accessToken')?.value;
    
    if (!token) {
      // Redirect về trang login nếu chưa có token
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Kiểm tra nếu đã đăng nhập mà truy cập trang login
  if (pathname === '/' || pathname === '/login') {
    const token = request.cookies.get('accessToken')?.value;
    
    if (token) {
      // Redirect về dashboard nếu đã có token
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
