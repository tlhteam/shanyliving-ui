import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

function redirectToLogin(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  url.searchParams.set("callbackUrl", request.nextUrl.pathname + request.nextUrl.search);

  return NextResponse.redirect(url);
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = await getToken({ req: request, secret });
  const role = token?.role;

  if (pathname.startsWith("/admin")) {
    return role === "admin" ? NextResponse.next() : redirectToLogin(request, "/admin/login");
  }

  if (pathname.startsWith("/customer")) {
    return role ? NextResponse.next() : redirectToLogin(request, "/login");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/customer/:path*"]
};
