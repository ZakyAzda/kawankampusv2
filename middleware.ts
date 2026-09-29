import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "kawan-kampus-super-secret-jwt-key-2025";
const key = new TextEncoder().encode(JWT_SECRET);

// Routes that require authentication
const PROTECTED_PREFIXES = ["/home", "/calendar", "/weekly", "/profile", "/schedule", "/conflict", "/add"];

// Routes only for unauthenticated users (redirect to /home if already logged in)
const AUTH_ONLY_PREFIXES = ["/login", "/register"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  let isAuthenticated = false;
  if (token) {
    try {
      await jwtVerify(token, key, { algorithms: ["HS256"] });
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  // If visiting a protected route without auth → redirect to login
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (isProtected && !isAuthenticated) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If visiting auth-only routes while already authenticated → redirect to home
  const isAuthOnly = AUTH_ONLY_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (isAuthOnly && isAuthenticated) {
    const homeUrl = req.nextUrl.clone();
    homeUrl.pathname = "/home";
    homeUrl.searchParams.delete("redirect");
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - api routes (/api/...)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files (manifest.json, sw.js, icons, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|icons|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.webp).*)",
  ],
};
