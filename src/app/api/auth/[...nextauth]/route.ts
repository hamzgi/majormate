import { handlers } from "@/auth";
import { isAuthConfigured } from "@/lib/auth-config";
import { NextRequest, NextResponse } from "next/server";

function configurationUnavailable() {
  return NextResponse.json(
    { error: "Authentication is not configured." },
    { status: 503 },
  );
}

export async function GET(request: NextRequest) {
  if (!isAuthConfigured()) {
    return configurationUnavailable();
  }

  return handlers.GET(request);
}

export async function POST(request: NextRequest) {
  if (!isAuthConfigured()) {
    return configurationUnavailable();
  }

  return handlers.POST(request);
}
