import { AuthSetupNotice } from "@/components/auth/AuthSetupNotice";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { isAuthConfigured } from "@/lib/auth-config";

export default function RegisterPage() {
  if (!isAuthConfigured()) {
    return <AuthSetupNotice />;
  }

  return <RegisterForm />;
}
