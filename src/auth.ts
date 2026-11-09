import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/mongodb";
import { loginSchema } from "@/lib/auth-validation";
import User from "@/models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "이메일 로그인",
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse({
          email: credentials?.email,
          password: credentials?.password,
        });

        if (!parsed.success) {
          return null;
        }

        await connectToDatabase();

        const user = await User.findOne({
          email: parsed.data.email.toLowerCase(),
        })
          .select("+passwordHash")
          .lean();

        if (!user || !user.passwordHash) {
          return null;
        }

        const isPasswordValid = await compare(parsed.data.password, user.passwordHash);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          nickname: user.nickname,
          major: user.major,
          grade: user.grade,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.nickname = user.nickname;
        token.major = user.major;
        token.grade = user.grade;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id;
        session.user.nickname = token.nickname ?? session.user.name ?? "사용자";
        session.user.major = token.major ?? "";
        session.user.grade = token.grade ?? 0;
      }

      return session;
    },
  },
});
