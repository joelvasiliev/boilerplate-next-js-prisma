import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token: any = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  const url = request.nextUrl.clone();

  if (!token) {
    if (url.pathname !== '/') {
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  } else {
    if (url.pathname === '/') {
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
    
    // if (token.user?.isFirstLogin) {
    //   url.pathname = '/completar-cadastro';
    //   return NextResponse.redirect(url);
    // }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
  ],
};