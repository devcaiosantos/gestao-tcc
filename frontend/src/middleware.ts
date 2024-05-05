import {NextResponse } from "next/server";
import parseJwt from "./utils/parseJwt";
import { NextRequest } from "next/server";
export default async function middleware(request: NextRequest){
    const token = request.cookies.get("gestao-token")?.value
    const baseURL = request.nextUrl.origin
    const signInURL = new URL ('/login', baseURL)
    const dashboardURL = new URL ('/dashboard', baseURL)
    
    if(!token){
        if(request.nextUrl.pathname === '/login'){
            return NextResponse.next()
        }
        return NextResponse.redirect(signInURL)
    }
    if(request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/'){
        return NextResponse.redirect(dashboardURL)
    }
    
    const jwtDecoded = parseJwt(token);
    
    if(!jwtDecoded){
        const response = NextResponse.redirect(signInURL)
        response.cookies.delete('gestao-token')
        return response
    }
    
    const { exp } = jwtDecoded
    const now = new Date()
    const expDate = new Date(exp * 1000)
    if(now > expDate){
        const response = NextResponse.redirect(signInURL);
        response.cookies.delete('gestao-token');
        return response;
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
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ]
}
