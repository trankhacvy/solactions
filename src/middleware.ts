import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { Routes } from "./config/routes";
import { env } from "./env";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/ routes
     * 2. /_next/ (Next.js internals)
     * 3. /_proxy/ (special page for OG tags proxying)
     * 4. /_static (inside /public)
     * 5. /_vercel (Vercel internals)
     * 6. Static files (e.g. /favicon.ico, /sitemap.xml, /robots.txt, etc.)
     */
    "/((?!api/|_next/|_proxy/|_static|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const path = req.nextUrl.pathname;

  const session = await getToken({ req });

  if (
    session &&
    session.user &&
    session.user.isNewUser &&
    path !== Routes.ONBOARDING_PROFILE
  ) {
    return NextResponse.redirect(new URL(Routes.ONBOARDING_PROFILE, req.url));
  }

  return NextResponse.next();
}
