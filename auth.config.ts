import type { NextAuthConfig } from "next-auth";
import "next-auth/jwt";

export const authConfig = {
  basePath: "/auth",
  pages: {
    signIn: "/auth/login",
  },
  session: { strategy: "jwt" },

  callbacks: {
    jwt: async ({ token, user }) => {
      if (user && user.id && user.role) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.username = token.username;
      return session;
    },

    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnAuth = nextUrl.pathname.startsWith("/auth");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isOnAuth && isLoggedIn) {
        const url = nextUrl.clone();
        url.pathname = "/";
        return Response.redirect(url);
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;

declare module "next-auth" {
  interface Session {
    id: string;
    role: string;
    username: string;
  }
  interface User {
    id?: string;
    role: string;
    username: string;
    name?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    username: string;
  }
}
