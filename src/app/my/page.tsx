import { auth } from "@/auth";
import { AuthSetupNotice } from "@/components/auth/AuthSetupNotice";
import { ProfileDashboard } from "@/components/auth/ProfileDashboard";
import { isAuthConfigured } from "@/lib/auth-config";
import { redirect } from "next/navigation";

// This is an account-only page, so session protection takes priority over prerendering.
export const instant = false;

export default async function MyPage() {
  if (!isAuthConfigured()) {
    return <AuthSetupNotice />;
  }

  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/my");
  }

  return <ProfileDashboard user={session.user} />;
}
