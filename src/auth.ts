import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { apiUrl } from "@/lib/api";

const credentialsSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["admin", "customer"]).optional()
});

type LoginResponse = {
  token?: string;
  user?: { id: number | string; name?: string; email?: string; role?: string };
};

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  },
  providers: [
    Credentials({
      name: "Sanctum",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" }
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);

        if (!parsed.success || !apiUrl) {
          return null;
        }

        try {
          const response = await fetch(`${apiUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ ...parsed.data, device_name: "shany-web" }),
            cache: "no-store"
          });

          if (!response.ok) {
            return null;
          }

          const body = await response.json();
          const payload: LoginResponse = body?.data ?? body;

          if (!payload?.token || !payload?.user) {
            return null;
          }

          return {
            id: String(payload.user.id),
            name: payload.user.name ?? null,
            email: payload.user.email ?? null,
            role: payload.user.role === "admin" ? "admin" : "customer",
            accessToken: payload.token
          };
        } catch {
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? token.sub ?? "");
        session.user.role = token.role === "admin" ? "admin" : "customer";
      }

      session.accessToken = token.accessToken;

      return session;
    }
  }
};
