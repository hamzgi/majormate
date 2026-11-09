import { auth } from "@/auth";
import { AuthSetupNotice } from "@/components/auth/AuthSetupNotice";
import { LoginForm } from "@/components/auth/LoginForm";
import { isAuthConfigured, safeCallbackUrl } from "@/lib/auth-config";
import { redirect } from "next/navigation";

// Auth.js reads request cookies. This route intentionally blocks until its session check completes.
export const instant = false;

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string | string[]; registered?: string | string[] }>;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  if (!isAuthConfigured()) {
    return <AuthSetupNotice />;
  }

  const callbackUrl = safeCallbackUrl(firstValue(params.callbackUrl));
  const session = await auth();

  if (session?.user?.id) {
    redirect(callbackUrl);
  }

  return <LoginForm callbackUrl={callbackUrl} showRegistered={firstValue(params.registered) === "1"} />;
}
