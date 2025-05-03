import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"
import { compare } from "bcryptjs"
import { NextAuthOptions } from "next-auth"

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Username" },
        password: { label: "Password", type: "password", placeholder: "Password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }
        // Cari user berdasarkan username
        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
          include: { familyHead: true },
        })
        if (!user) return null
        // Bandingkan password hash
        const isValid = await compare(credentials.password, user.password)
        if (!isValid) return null
        return {
          id: user.id.toString(),
          name: user.username,
          role: user.role,
          familyHeadId: user.familyHeadId,
          familyHeadName: user.familyHead?.fullName || null,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role as string
        token.familyHeadId = user.familyHeadId as number | null
        token.familyHeadName = user.familyHeadName as string | null
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string
        session.user.familyHeadId = token.familyHeadId as number | null
        session.user.familyHeadName = token.familyHeadName as string | null
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions) 