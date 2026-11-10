import "server-only";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export type HomeStats = {
  memberCount: number;
};

export async function getHomeStats(): Promise<HomeStats | null> {
  try {
    await connectToDatabase();

    return {
      memberCount: await User.countDocuments(),
    };
  } catch (error) {
    // The public home page should still render if the database is temporarily unavailable.
    console.error("Failed to load home statistics", error);
    return null;
  }
}
