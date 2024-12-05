import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { verify } from "argon2";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
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

        console.log("Authorizing");

        if (!user || !(await verify(user.passwordHash, password))) {
          throw new Error("Invaid credentials.");
        }
        return user;
      },
    }),
  ],
});
