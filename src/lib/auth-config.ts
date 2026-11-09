export function isAuthConfigured() {
  return Boolean(process.env.MONGODB_URI && process.env.AUTH_SECRET);
}

export function safeCallbackUrl(value: string | null | undefined) {
  if (value?.startsWith("/") && !value.startsWith("//")) {
    return value;
  }

  return "/my";
}
