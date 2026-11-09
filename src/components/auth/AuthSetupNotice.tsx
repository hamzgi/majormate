import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";

export function AuthSetupNotice() {
  return (
    <AuthShell
      eyebrow="ACCOUNT SERVICE"
      title="계정 서비스를 준비하고 있어요"
      description="인증 환경 연결이 끝나면 회원가입과 로그인을 이용할 수 있습니다."
    >
      <section className="auth-card auth-setup-card">
        <div className="setup-icon" aria-hidden="true">⌁</div>
        <h2>잠시만 기다려 주세요</h2>
        <p>서비스 운영자가 데이터베이스와 인증 키를 연결하는 중입니다.</p>
        <Link className="button button--primary button--full" href="/">
          홈으로 돌아가기
        </Link>
      </section>
    </AuthShell>
  );
}
