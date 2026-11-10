import { auth } from "@/auth";
import { AuthSetupNotice } from "@/components/auth/AuthSetupNotice";
import { SiteFrame } from "@/components/layout/SiteChrome";
import { CreateStudyForm } from "@/components/studies/CreateStudyForm";
import { isAuthConfigured } from "@/lib/auth-config";
import { redirect } from "next/navigation";
import { connection } from "next/server";

export const instant = false;

export default async function NewStudyPage() {
  await connection();
  if (!isAuthConfigured()) return <AuthSetupNotice />;
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/studies/new");

  return <SiteFrame user={session.user}>
    <main className="page-wrap narrow-page">
      <section className="page-intro"><div><div className="eyebrow eyebrow--dark"><span className="pulse-dot" />NEW STUDY</div><h1>함께할 사람을<br /><em>직접 모집해 보세요.</em></h1><p>모임 정보와 목표를 구체적으로 쓰면 더 잘 맞는 학우를 만날 수 있어요.</p></div></section>
      <section className="study-form-card"><CreateStudyForm /></section>
    </main>
  </SiteFrame>;
}
