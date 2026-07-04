// Client for the external Katalok Backend API.
// Base URL & endpoint contracts come from https://katalok-taupe.vercel.app/api/docs
export const KATALOK_API_BASE = "https://katalok-taupe.vercel.app/api";

const TOKEN_KEY = "katalok.accessToken";
const REFRESH_KEY = "katalok.refreshToken";
const USER_KEY = "katalok.user";

export type KatalokUser = {
  id: string;
  name: string;
  email: string;
  role: "CLIENT" | "PROFESSIONAL" | "ADMIN";
};

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): KatalokUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as KatalokUser; } catch { return null; }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

function saveSession(payload: { user: KatalokUser; accessToken: string; refreshToken: string }) {
  localStorage.setItem(TOKEN_KEY, payload.accessToken);
  localStorage.setItem(REFRESH_KEY, payload.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
}

async function request<T>(path: string, init: RequestInit = {}, auth = false): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };
  if (auth) {
    const token = getStoredToken();
    if (!token) throw new Error("You are not signed in.");
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${KATALOK_API_BASE}${path}`, { ...init, headers });
  const body = await res.json().catch(() => ({} as any));
  if (!res.ok || body?.success === false) {
    const details = Array.isArray(body?.details)
      ? body.details.map((d: any) => (typeof d === "string" ? d : d?.message)).filter(Boolean).join(", ")
      : "";
    throw new Error(body?.error ? `${body.error}${details ? `: ${details}` : ""}` : `Request failed (${res.status})`);
  }
  return body.data as T;
}

// ---- Auth ----
export async function registerPro(input: {
  name: string;
  email: string;
  password: string;
}): Promise<KatalokUser> {
  const data = await request<{ user: KatalokUser; accessToken: string; refreshToken: string }>(
    "/auth/register",
    {
      method: "POST",
      body: JSON.stringify({ ...input, role: "PROFESSIONAL" }),
    },
  );
  saveSession(data);
  return data.user;
}

export async function login(email: string, password: string): Promise<KatalokUser> {
  const data = await request<{ user: KatalokUser; accessToken: string; refreshToken: string }>(
    "/auth/login",
    { method: "POST", body: JSON.stringify({ email, password }) },
  );
  saveSession(data);
  return data.user;
}

// ---- Professional profile ----
export type ProfessionalProfile = {
  id: string;
  userId: string;
  bio: string | null;
  location: string | null;
  isActive: boolean;
  rating: number;
  user: KatalokUser & { phone: string | null };
  services?: KatalokService[];
  portfolioImages?: any[];
};

export function getMyProfile() {
  return request<ProfessionalProfile>("/professionals/me/profile", { method: "GET" }, true);
}

export function updateMyProfile(patch: { bio?: string | null; location?: string | null }) {
  return request<ProfessionalProfile>(
    "/professionals/me/profile",
    { method: "PATCH", body: JSON.stringify(patch) },
    true,
  );
}

// ---- Services ----
export type KatalokService = {
  id: string;
  title: string;
  description: string;
  price: number;
  duration?: number | null;
  category?: string | null;
};

export function createService(input: {
  title: string;
  description: string;
  price: number;
  duration?: number | null;
  category?: string | null;
}) {
  return request<KatalokService>(
    "/services",
    { method: "POST", body: JSON.stringify(input) },
    true,
  );
}

export function listMyServices(professionalId: string) {
  return request<KatalokService[]>(`/services/professional/${professionalId}`, { method: "GET" });
}

export function deleteService(id: string) {
  return request<{ id: string }>(`/services/${id}`, { method: "DELETE" }, true);
}
