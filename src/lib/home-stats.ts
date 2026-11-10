import "server-only";
import { connectToDatabase } from "@/lib/mongodb";
import Study from "@/models/Study";
import User from "@/models/User";

export type HomeStats = {
  memberCount: number;
  recruitingStudyCount: number;
};

export async function getHomeStats(): Promise<HomeStats | null> {
  try {
    await connectToDatabase();

    const [memberCount, recruitingStudyCount] = await Promise.all([
      User.countDocuments(),
      Study.countDocuments({ status: "RECRUITING" }),
    ]);
    return { memberCount, recruitingStudyCount };
  } catch (error) {
    // The public home page should still render if the database is temporarily unavailable.
    console.error("Failed to load home statistics", error);
    return null;
  }
}
