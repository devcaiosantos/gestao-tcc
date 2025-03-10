import {NextResponse } from "next/server";
import parseJwt from "./utils/parseJwt";
import { NextRequest } from "next/server";
export default async function middleware(request: NextRequest){
    const tokenName = "tcc-token"
    const token = request.cookies.get(tokenName)?.value
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
        response.cookies.delete(tokenName)
        return response
    }
    
    const { exp } = jwtDecoded
    const now = new Date()
    const expDate = new Date(exp * 1000)
    if(now > expDate){
        const response = NextResponse.redirect(signInURL);
        response.cookies.delete(tokenName);
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
        * - define-advisor (Page route)
        * - define-board (Page route)
        * - schedule-board (Page route)
        */
        '/((?!api|_next/static|_next/image|favicon.ico|define-advisor|define-board|schedule-board).*)',
    ]
}
