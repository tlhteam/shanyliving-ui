import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/customer-login",
  },
  callbacks: {
    authorized: ({ token, req }) => {
      const pathname = req.nextUrl.pathname;

      if (pathname.startsWith("/admin")) {
        return token?.role === "admin";
      }

      if (pathname.startsWith("/customer")) {
        return token?.role === "admin" || token?.role === "customer";
      }

      return Boolean(token);
    },
  },
});

export const config = {
  matcher: ["/admin/:path*", "/customer/:path*"],
};
