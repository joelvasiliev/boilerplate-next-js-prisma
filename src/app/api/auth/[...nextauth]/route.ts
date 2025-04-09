import NextAuth from "next-auth";
import bcrypt from 'bcrypt';
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET as string,
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/",
    signOut: "/",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
    if (user) {
      token.user = user; 
    }
    return token;
  },
    async session({ session, token }) {
      if (token?.user) {
        session.user = token.user; 
      }
      return session;
    }
  },
  providers: [
    CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          const user = await prisma.user.findFirst({
            where: { email: credentials?.email },
          });
        
          if (user) {
            const isPasswordCorrect = await bcrypt.compare(credentials?.password || "", user.password || "");
            if (isPasswordCorrect) {
              return {
                id: user.id,
                email: user.email,
                image: user.image,
                role: user.role,
                isFirstLogin: user.isFirstLogin
              };
            }
          }
          return null;
        }
      }),
  ],
});

export { handler as GET, handler as POST };
