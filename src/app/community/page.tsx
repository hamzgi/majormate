import { auth } from "@/auth";
import { AuthSetupNotice } from "@/components/auth/AuthSetupNotice";
import { SiteFrame } from "@/components/layout/SiteChrome";
import { isAuthConfigured } from "@/lib/auth-config";
import { connection } from "next/server";

export const instant = false;

export default async function CommunityPage() {
  await connection();
  if (!isAuthConfigured()) return <AuthSetupNotice />;
  const session = await auth();

  return <SiteFrame user={session?.user ?? null}>
    <main className="page-wrap">
      <section className="page-intro"><div><div className="eyebrow eyebrow--dark"><span className="pulse-dot" />MAJOR COMMUNITY</div><h1>전공 이야기를<br /><em>안전하게 나눠요.</em></h1><p>기존 프로토타입 게시글은 제거했습니다. 실제 게시글 기능은 다음 단계에서 회원 계정과 연결됩니다.</p></div></section>
      <section className="empty-state community-empty"><b>아직 등록된 게시글이 없어요</b><p>스터디 모집 기능에 이어 실제 커뮤니티 글·댓글 기능을 연결할 예정입니다.</p></section>
    </main>
  </SiteFrame>;
}
