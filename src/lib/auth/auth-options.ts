import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/database/mongoose";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: "ADMIN" | "SHOP_OWNER";
      storeId?: string;
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await connectDB();
        } catch (e) {
          console.error("[Auth] connectDB failed:", e);
          throw new Error("Database connection failed");
        }

        const user = await User.findOne({ email: (credentials.email as string).toLowerCase() }).lean();

        if (!user) {
          console.log("[Auth] User not found:", (credentials.email as string).toLowerCase());
          return null;
        }

        if (!user.isActive) {
          console.log("[Auth] User is inactive:", (credentials.email as string).toLowerCase());
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password as string, user.passwordHash as string);

        if (!isValid) {
          console.log("[Auth] Password mismatch for:", (credentials.email as string).toLowerCase());
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.name as string,
          email: user.email as string,
          role: user.role as "ADMIN" | "SHOP_OWNER",
          storeId: (user.storeId as { toString(): string })?.toString(),
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: string }).role;
        token.storeId = (user as { storeId?: string }).storeId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as "ADMIN" | "SHOP_OWNER";
        session.user.storeId = token.storeId as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.AUTH_SECRET,
});
