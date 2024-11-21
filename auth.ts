import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { verify } from "argon2";

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
  async session({ session, user }) {
    
    session.user.id = user.id as string
    
    return session
  }}
});