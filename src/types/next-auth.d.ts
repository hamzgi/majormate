import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      nickname: string;
      major: string;
      grade: number;
    } & DefaultSession["user"];
  }

  interface User {
    nickname: string;
    major: string;
    grade: number;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    nickname?: string;
    major?: string;
    grade?: number;
  }
}
