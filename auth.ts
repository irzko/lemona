import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { verify } from "argon2";
import "next-auth/jwt"

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: !!process.env.AUTH_DEBUG,
  theme: { logo: "https://authjs.dev/img/logo-sm.png" },
  adapter: PrismaAdapter(prisma),
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

        console.log(user);
        
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
  // callbackk session return user id
    jwt: async ({ token, user }) => {
      // First time JWT callback is run, user object is available
      if (user && user.id && user.role) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token && token.id && token.role) {
        session.id = token.id;
        session.role = token.role;
      }
      return session;
    },
  }
});

declare module "next-auth" {
  interface Session {
    id: string;
    role: number;
  }

  interface User {
    id?: string;
    role: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: number;
  }
}