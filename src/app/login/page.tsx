import { auth } from "@/auth";
import { AuthSetupNotice } from "@/components/auth/AuthSetupNotice";
import { LoginForm } from "@/components/auth/LoginForm";
import { isAuthConfigured, safeCallbackUrl } from "@/lib/auth-config";
import { redirect } from "next/navigation";
import { connection } from "next/server";

// Account routes intentionally wait for a request instead of streaming a static shell.
export const instant = false;

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string | string[]; registered?: string | string[] }>;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  // Auth.js creates cryptographic values while reading the session.
  // Render this account route only after a real request arrives.
  await connection();

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
