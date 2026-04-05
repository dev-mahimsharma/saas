import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "GOOGLE_ID",
      clientSecret: process.env.GOOGLE_SECRET || "GOOGLE_SECRET",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || "GITHUB_ID",
      clientSecret: process.env.GITHUB_SECRET || "GITHUB_SECRET",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google" || account.provider === "github") {
        await connectToDatabase();
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            isVerified: true,
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET || "my-super-secret-next-auth-key-1234",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
