import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role?: "admin" | "customer";
    accessToken?: string;
  }

  interface Session {
    accessToken?: string;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: "admin" | "customer";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "admin" | "customer";
    accessToken?: string;
  }
}
