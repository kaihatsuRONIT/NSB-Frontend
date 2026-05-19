import { NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

export function middleware(request) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get('access_token')?.value;

    if (pathname === '/login') {
        if (accessToken) {
            try {
                const decoded = jwtDecode(accessToken);
                if (decoded.exp && decoded.exp * 1000 > Date.now()) {
                    return NextResponse.redirect(new URL('/', request.url));
                }
            } catch {
                return NextResponse.next();
            }
        }
    }
    if (pathname.startsWith('/admin')) {
        if (!accessToken) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        try {
            const decoded = jwtDecode(accessToken);
            if (decoded.role !== 'ADMIN') {
                return NextResponse.redirect(new URL('/', request.url));
            }
        } catch {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/login'],
};