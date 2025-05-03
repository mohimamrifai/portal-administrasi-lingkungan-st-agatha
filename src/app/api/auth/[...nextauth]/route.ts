import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"
import { compare } from "bcryptjs"

const prisma = new PrismaClient()

const handler = NextAuth({
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
        } as any
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.familyHeadId = (user as any).familyHeadId
        token.familyHeadName = (user as any).familyHeadName
      }
      return token
    },
    async session({ session, token }) {
      // Tampilkan token untuk debugging
      console.log('TOKEN SESSION DEBUG:', token)
      
      try {
        // Jika token valid dan session user tersedia
        if (typeof token === 'object' && token !== null && session.user) {
          // Gunakan type casting untuk menghindari error
          const tokenObj = token as any
          
          // Assign nilai user role, pastikan selalu string
          if (tokenObj.role) {
            // Gunakan String() untuk memastikan nilai selalu menjadi string
            (session.user as any).role = String(tokenObj.role)
          }
          
          // Tambahkan properti lain dengan aman
          if (tokenObj.familyHeadId !== undefined) {
            (session.user as any).familyHeadId = tokenObj.familyHeadId
          }
          
          if (tokenObj.familyHeadName !== undefined) {
            (session.user as any).familyHeadName = tokenObj.familyHeadName
          }
          
          console.log('SESSION USER:', session.user)
        } else {
          console.log('Invalid token or session')
        }
      } catch (error) {
        console.error('Error in session callback:', error)
      }
      
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST } 