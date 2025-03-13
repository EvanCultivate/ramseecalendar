import { cookies } from 'next/headers';

const AUTH_COOKIE = 'auth';

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE);
  return authCookie?.value === process.env.APP_PASSWORD;
}

export async function setAuthCookie(value: string) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, value);
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
} 