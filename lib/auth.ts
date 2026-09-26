export const COOKIE_NAME = "mama_owner_session";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 วัน

export function getOwnerPassword(): string {
  return process.env.OWNER_PASSWORD || "mama2026";
}

export function verifyOwnerPassword(inputPassword: string): boolean {
  const masterPassword = getOwnerPassword();
  return inputPassword.trim() === masterPassword.trim();
}
