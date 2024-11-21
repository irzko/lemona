import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { verify } from "argon2";
import "next-auth/jwt";

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: !!process.env.AUTH_DEBUG,
  theme: { logo: "https://authjs.dev/img/logo-sm.png" },
  providers: [
    CredentialsProvider({
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials): Promise<any> {
        const { username, password } = credentials as {
          username: string;
          password: string;
        };
        if (!username || !password) {
          throw new Error("Pls provide username and password");
        }
        const user = await prisma.user.findUnique({
          where: {
            username,
          },
        });

        if (!user || !(await verify(user.password, password))) {
          throw new Error("Invaid credentials.");
        }
        return user;
      },
    }),
  ],
  basePath: "/auth",
  pages: {
    signIn: "/login",
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
  },
});

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
