import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "@/lib/locales";

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets and API routes.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const pathLocale = segments[0];

  if (pathLocale === defaultLocale) {
    const strippedPath = pathname.replace(new RegExp(`^/${defaultLocale}(?=/|$)`), "") || "/";
    const url = request.nextUrl.clone();
    url.pathname = strippedPath;
    return NextResponse.redirect(url);
  }

  if (locales.includes(pathLocale as (typeof locales)[number])) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  const cleanPath =
    pathname === "/"
      ? ""
      : pathname.replace(/\/+$/, "");
  url.pathname = `/${defaultLocale}${cleanPath}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
