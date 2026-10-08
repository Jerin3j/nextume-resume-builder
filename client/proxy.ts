import { NextRequest, NextResponse } from "next/server";
import { extractSubdomain } from "@/lib/domains";

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static files with extensions (.png, .jpg, .svg, etc.)
     */
    "/((?!api/|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|json)$).*)",
  ],
};

export default function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host");

  const subdomain = extractSubdomain(hostname);

  // If on root domain (nextume.in, localhost:3000) or www -> proceed normally
  if (!subdomain) {
    return NextResponse.next();
  }

  // Handle system feature subdomains
  if (subdomain === "app") {
    if (url.pathname === "/") {
      return NextResponse.rewrite(new URL("/dashboard", req.url));
    }
    if (url.pathname.startsWith("/builder")) {
      return NextResponse.rewrite(new URL(`/dashboard${url.pathname}`, req.url));
    }
    if (!url.pathname.startsWith("/dashboard")) {
      return NextResponse.rewrite(new URL(`/dashboard${url.pathname}`, req.url));
    }
    return NextResponse.next();
  }

  if (subdomain === "ats") {
    if (url.pathname === "/") {
      return NextResponse.rewrite(new URL("/ats-score", req.url));
    }
    return NextResponse.rewrite(new URL(`/ats-score${url.pathname}`, req.url));
  }

  if (subdomain === "coverletter" || subdomain === "cover-letter") {
    if (url.pathname === "/") {
      return NextResponse.rewrite(new URL("/cover-letter", req.url));
    }
    return NextResponse.rewrite(new URL(`/cover-letter${url.pathname}`, req.url));
  }

  if (subdomain === "pricing") {
    if (url.pathname === "/") {
      return NextResponse.rewrite(new URL("/pricing", req.url));
    }
    return NextResponse.rewrite(new URL(`/pricing${url.pathname}`, req.url));
  }

  if (subdomain === "community") {
    if (url.pathname === "/") {
      return NextResponse.rewrite(new URL("/community", req.url));
    }
    return NextResponse.rewrite(new URL(`/community${url.pathname}`, req.url));
  }

  // Any other subdomain is treated as a User Personal Portfolio subdomain!
  // e.g. jerin.nextume.in -> rewrites to /portfolio/jerin
  if (url.pathname === "/" || url.pathname === "") {
    return NextResponse.rewrite(new URL(`/portfolio/${subdomain}`, req.url));
  }

  // Preserve any sub-paths or rewrite to user portfolio
  return NextResponse.rewrite(new URL(`/portfolio/${subdomain}`, req.url));
}
