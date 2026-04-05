import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

const providers = [];

if (process.env.GOOGLE_ID && process.env.GOOGLE_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    })
  );
}

if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  providers.push(
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    })
  );
}

export const authOptions = {
  providers,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!account || !user?.email) return false;

      await connectToDatabase();

      await User.findOneAndUpdate(
        { email: user.email },
        {
          $set: {
            name: user.name || "",
            image: user.image || "",
            isVerified: true,
            lastLoginAt: new Date(),
          },
          $addToSet: { oauthProviders: account.provider },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      return true;
    },
    async jwt({ token }) {
      if (!token?.email) return token;

      await connectToDatabase();
      const dbUser = await User.findOne({ email: token.email }).select("_id");
      if (dbUser?._id) {
        token.id = dbUser._id.toString();
      }

      return token;
    },
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
