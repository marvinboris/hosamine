import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { verifySession } from "./lib/session";

const intlMiddleware = createMiddleware(routing);

// Paths that must stay reachable without a session.
const PUBLIC_PATHS = new Set<string>(["/admin/login", "/api/admin/auth"]);

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // API routes: verify the signed session, reject with 401 otherwise.
  if (pathname.startsWith("/api")) {
    if (PUBLIC_PATHS.has(pathname)) return NextResponse.next();
    const token = req.cookies.get("admin_session")?.value;
    const session = token ? await verifySession(token) : null;
    if (!session) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Admin pages: verify the signed session, redirect to login otherwise.
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    const token = req.cookies.get("admin_session")?.value;
    const session = token ? await verifySession(token) : null;
    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.next();
  }

  // Public site: locale routing.
  return intlMiddleware(req);
}

export const config = {
  // Run on everything except Next internals and static files (now INCLUDES /api).
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
