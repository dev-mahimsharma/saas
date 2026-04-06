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

async function syncUserToDatabase(user, account) {
  if (!account?.provider || !user?.email) return null;

  await connectToDatabase();

  return User.findOneAndUpdate(
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
}

export const authOptions = {
  providers,
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60,
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!account || !user?.email) return false;

      try {
        const dbUser = await syncUserToDatabase(user, account);
        if (dbUser?._id) {
          user.id = dbUser._id.toString();
        }
      } catch (error) {
        console.error("Failed to sync OAuth user to MongoDB during sign-in.", error);
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
        return token;
      }

      if (!token?.email) {
        token.id ??= token.sub;
        return token;
      }

      try {
        await connectToDatabase();
        const dbUser = await User.findOne({ email: token.email }).select("_id");
        if (dbUser?._id) {
          token.id = dbUser._id.toString();
        } else {
          token.id ??= token.sub;
        }
      } catch (error) {
        console.error("Failed to load OAuth user from MongoDB during JWT callback.", error);
        token.id ??= token.sub;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token?.id || token?.sub || "";
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};

export default NextAuth(authOptions);
