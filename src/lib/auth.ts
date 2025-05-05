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
          include: { keluarga: true },
        })
        if (!user) return null
        // Bandingkan password hash
        const isValid = await compare(credentials.password, user.password)
        if (!isValid) return null
        
        console.log("User authenticated:", {
          id: user.id,
          username: user.username,
          role: user.role,
          keluargaId: user.keluargaId
        })
        
        return {
          id: user.id,
          name: user.username,
          role: user.role, // Enum 'Role' already in correct format
          keluargaId: user.keluargaId,
          keluargaNama: user.keluarga?.namaKepalaKeluarga || null,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 hari
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 hari
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role as string
        token.keluargaId = user.keluargaId as string | null
        token.keluargaNama = user.keluargaNama as string | null
        
        console.log("JWT token generated:", {
          id: token.id,
          role: token.role
        })
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.keluargaId = token.keluargaId as string | null
        session.user.keluargaNama = token.keluargaNama as string | null
        
        console.log("Session created:", {
          id: session.user.id,
          role: session.user.role
        })
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions) 