import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { z } from "zod";
import { apiUrl } from "@/lib/api";

const credentialsSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["admin", "customer"]).optional()
});

type LoginResponse = {
  token?: string;
  user?: { id: number | string; name?: string; email?: string; avatar?: string | null; role?: string };
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
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: { params: { prompt: "select_account", access_type: "offline", response_type: "code" } }
    }),
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
    async signIn({ account, user }) {
      if (account?.provider !== "google") {
        return true;
      }

      if (!apiUrl || !account.id_token) {
        return false;
      }

      const response = await fetch(`${apiUrl}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ id_token: account.id_token, device_name: "shany-google" }),
        cache: "no-store"
      });

      if (!response.ok) {
        return false;
      }

      const body = await response.json();
      const payload: LoginResponse = body?.data ?? body;

      if (!payload?.token || !payload?.user) {
        return false;
      }

      user.id = String(payload.user.id);
      user.name = payload.user.name ?? user.name;
      user.email = payload.user.email ?? user.email;
      user.image = payload.user.avatar ?? user.image;
      user.role = payload.user.role === "admin" ? "admin" : "customer";
      user.accessToken = payload.token;

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.picture = user.image;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? token.sub ?? "");
        session.user.role = token.role === "admin" ? "admin" : "customer";
        session.user.image = token.picture ?? session.user.image;
      }

      session.accessToken = token.accessToken;

      return session;
    }
  }
};
