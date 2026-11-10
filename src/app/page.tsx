import { MajorMateApp } from "@/components/MajorMateApp";
import { getHomeStats } from "@/lib/home-stats";
import { connection } from "next/server";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={<MajorMateApp page="home" homeStats={null} />}>
      <HomeContent />
    </Suspense>
  );
}

async function HomeContent() {
  await connection();
  const homeStats = await getHomeStats();

  return <MajorMateApp page="home" homeStats={homeStats} />;
}
