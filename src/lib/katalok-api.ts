// Browser-side client for the Katalok backend API.
// Docs: https://katalok.onrender.com/api/docs/
//
// All calls go directly from the browser to the production API. JWT tokens
// are persisted in localStorage under `katalok.tokens` and refreshed on 401.

export const KATALOK_API_URL = "https://katalok.onrender.com";

const TOKENS_KEY = "katalok.tokens";
const USER_KEY = "katalok.user";

export type ApiUser = {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  role: "CLIENT" | "PROFESSIONAL" | "ADMIN";
  avatarUrl?: string | null;
};

export type Tokens = { accessToken: string; refreshToken: string };

export type ApiErrorDetail = { field?: string; message: string };

export class ApiError extends Error {
  status: number;
  details: ApiErrorDetail[];
  constructor(message: string, status: number, details: ApiErrorDetail[] = []) {
    super(message);
    this.status = status;
    this.details = details;
  }
  /** Human-friendly multi-line message including per-field validation issues. */
  formatted(): string {
    if (this.details.length === 0) return this.message;
    const lines = this.details.map((d) =>
      d.field ? `• ${d.field}: ${d.message}` : `• ${d.message}`,
    );
    return `${this.message}\n${lines.join("\n")}`;
  }
}

export function getTokens(): Tokens | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(TOKENS_KEY);
    return raw ? (JSON.parse(raw) as Tokens) : null;
  } catch {
    return null;
  }
}

export function setTokens(t: Tokens | null) {
  if (typeof window === "undefined") return;
  if (t) localStorage.setItem(TOKENS_KEY, JSON.stringify(t));
  else localStorage.removeItem(TOKENS_KEY);
}

export function getStoredUser(): ApiUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as ApiUser) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(u: ApiUser | null) {
  if (typeof window === "undefined") return;
  if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
  else localStorage.removeItem(USER_KEY);
}

export function clearAuth() {
  setTokens(null);
  setStoredUser(null);
}

type ApiSuccess<T = unknown> = { success: true; data: T; message?: string };
type ApiFailure = { success: false; error: string; details?: ApiErrorDetail[] | string[]; statusCode?: number };

async function parseResponse<T>(res: Response): Promise<T> {
  let json: ApiSuccess<T> | ApiFailure | null = null;
  try {
    json = (await res.json()) as ApiSuccess<T> | ApiFailure;
  } catch {
    throw new ApiError(`Request failed (${res.status})`, res.status);
  }
  if (!res.ok || !json || (json as ApiFailure).success === false) {
    const fail = json as ApiFailure;
    const rawDetails = fail?.details ?? [];
    const details: ApiErrorDetail[] = Array.isArray(rawDetails)
      ? rawDetails.map((d) =>
          typeof d === "string" ? { message: d } : { field: (d as any).field, message: (d as any).message },
        )
      : [];
    throw new ApiError(fail?.error || `Request failed (${res.status})`, res.status, details);
  }
  return (json as ApiSuccess<T>).data;
}

async function refreshAccessToken(): Promise<Tokens | null> {
  const current = getTokens();
  if (!current?.refreshToken) return null;
  try {
    const res = await fetch(`${KATALOK_API_URL}/api/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: current.refreshToken }),
    });
    const data = await parseResponse<{ accessToken: string; refreshToken?: string }>(res);
    const next: Tokens = {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken ?? current.refreshToken,
    };
    setTokens(next);
    return next;
  } catch {
    clearAuth();
    return null;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  body?: unknown;
  form?: FormData;
  auth?: boolean; // attach bearer token (default true)
};

async function apiRequest<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, form, auth = true } = opts;
  const send = async (token: string | null): Promise<Response> => {
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    let payload: BodyInit | undefined;
    if (form) {
      payload = form;
    } else if (body !== undefined) {
      headers["Content-Type"] = "application/json";
      payload = JSON.stringify(body);
    }
    return fetch(`${KATALOK_API_URL}${path}`, { method, headers, body: payload });
  };

  const tokens = getTokens();
  let res = await send(auth ? tokens?.accessToken ?? null : null);
  if (res.status === 401 && auth && tokens?.refreshToken) {
    const refreshed = await refreshAccessToken();
    if (refreshed) res = await send(refreshed.accessToken);
  }
  return parseResponse<T>(res);
}

// ------ Auth ------

export type RegisterInput = {
  name: string;
  phone: string;
  password: string;
  confirmPassword?: string;
  email?: string;
  role?: "CLIENT" | "PROFESSIONAL";
  plan?: "STARTER" | "GROWTH" | "PREMIUM";
};

export async function register(input: RegisterInput): Promise<{ user: ApiUser; tokens: Tokens }> {
  const data = await apiRequest<{ user: ApiUser; accessToken: string; refreshToken: string }>(
    "/api/auth/register",
    { method: "POST", body: input, auth: false },
  );
  const tokens = { accessToken: data.accessToken, refreshToken: data.refreshToken };
  setTokens(tokens);
  setStoredUser(data.user);
  return { user: data.user, tokens };
}

export async function login(phone: string, password: string): Promise<{ user: ApiUser; tokens: Tokens }> {
  const data = await apiRequest<{ user: ApiUser; accessToken: string; refreshToken: string }>(
    "/api/auth/login",
    { method: "POST", body: { phone, password }, auth: false },
  );
  const tokens = { accessToken: data.accessToken, refreshToken: data.refreshToken };
  setTokens(tokens);
  setStoredUser(data.user);
  return { user: data.user, tokens };
}

export async function getMe(): Promise<ApiUser> {
  const user = await apiRequest<ApiUser>("/api/auth/me");
  setStoredUser(user);
  return user;
}

export type UpdateMyProfileInput = Partial<Pick<ApiUser, "name" | "email" | "phone">> & {
  avatarUrl?: string;
  headerUrl?: string;
};

export async function updateMyProfile(input: UpdateMyProfileInput): Promise<ApiUser> {
  const user = await apiRequest<ApiUser>("/api/auth/me", { method: "PATCH", body: input });
  setStoredUser(user);
  return user;
}

export async function upgradeToProfessional(plan: "STARTER" | "GROWTH" | "PREMIUM" = "STARTER") {
  return apiRequest<{ user: ApiUser }>("/api/auth/me/upgrade", { method: "PATCH", body: { plan } });
}

// ------ Professional profile ------

export type ProfessionalPortfolioImage = {
  id: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  createdAt: string;
};

export type ProfessionalProfile = {
  id: string;
  userId: string;
  bio: string | null;
  location: string | null;
  availability: unknown[];
  isActive: boolean;
  rating: number;
  subscriptionPlan: "STARTER" | "GROWTH" | "PREMIUM";
  subscriptionStatus: string;
  user: ApiUser;
  services?: KatalokService[];
  portfolioImages?: ProfessionalPortfolioImage[];
};

export async function getMyProfessionalProfile(): Promise<ProfessionalProfile> {
  return apiRequest<ProfessionalProfile>("/api/professionals/me/profile");
}

export async function updateMyProfessionalProfile(input: {
  bio?: string;
  location?: string;
  isActive?: boolean;
}): Promise<ProfessionalProfile> {
  return apiRequest<ProfessionalProfile>("/api/professionals/me/profile", {
    method: "PATCH",
    body: input,
  });
}

export async function getPortfolio(professionalId: string): Promise<ProfessionalPortfolioImage[]> {
  return apiRequest<ProfessionalPortfolioImage[]>(`/api/professionals/${professionalId}/portfolio`);
}

// ------ Uploads ------

/** Upload a portfolio image file. Also creates the portfolio metadata record. */
export async function uploadPortfolioImage(file: File): Promise<ProfessionalPortfolioImage> {
  const form = new FormData();
  form.append("image", file);
  return apiRequest<ProfessionalPortfolioImage>("/api/upload/portfolio", {
    method: "POST",
    form,
  });
}

export async function uploadServiceFeatured(file: File): Promise<{ fileUrl: string }> {
  const form = new FormData();
  form.append("image", file);
  return apiRequest<{ fileUrl: string }>("/api/upload/service-featured", {
    method: "POST",
    form,
  });
}

export async function deletePortfolioImage(imageId: string): Promise<void> {
  await apiRequest(`/api/professionals/me/portfolio/${imageId}`, { method: "DELETE" });
}

// ------ Services ------

export const SERVICE_CATEGORIES = [
  "BRAIDS",
  "NAILS",
  "MAKEUP",
  "HAIR_CUT_MEN",
  "HAIR_CUT_WOMEN",
  "WIG_INSTALLATION",
  "DREADLOCKS",
  "NATURAL_HAIR_STYLING",
  "LASH_EXTENSIONS",
  "MICRO_BLADING",
  "MANICURE_PEDICURE",
  "HAIR_MAINTENANCE",
  "HAIR_EXTENSIONS",
  "MASSAGE",
  "FACIALS",
] as const;
export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

/** Human-friendly UI labels → API enum. */
export const CATEGORY_LABEL_TO_ENUM: Record<string, ServiceCategory> = {
  "Braids": "BRAIDS",
  "Nails": "NAILS",
  "Make up": "MAKEUP",
  "Hair Cut (Men)": "HAIR_CUT_MEN",
  "Hair Cut (Women)": "HAIR_CUT_WOMEN",
  "Wig Installation": "WIG_INSTALLATION",
  "Dreadlocks": "DREADLOCKS",
  "Natural Hair Styling": "NATURAL_HAIR_STYLING",
  "Lash Extensions": "LASH_EXTENSIONS",
  "Micro Blading": "MICRO_BLADING",
  "Manicure & Pedicure": "MANICURE_PEDICURE",
  "Hair Maintenance": "HAIR_MAINTENANCE",
  "Hair Extensions": "HAIR_EXTENSIONS",
  "Massage": "MASSAGE",
  "Facials": "FACIALS",
};

export const CATEGORY_ENUM_TO_LABEL: Record<ServiceCategory, string> = Object.fromEntries(
  Object.entries(CATEGORY_LABEL_TO_ENUM).map(([label, e]) => [e, label]),
) as Record<ServiceCategory, string>;

export type KatalokService = {
  id: string;
  professionalId: string;
  title: string;
  description: string | null;
  price: number;
  durationHours: number | null;
  durationMinutes: number | null;
  category: ServiceCategory;
  caption: string;
  brandName: string | null;
  town: string | null;
  location: string | null;
  status: "DRAFT" | "PUBLISHED";
  featuredImageUrl: string | null;
  galleryImageUrls: string[];
  createdAt: string;
  updatedAt: string;
};

export type CreateServiceInput = {
  title: string;
  description?: string;
  price: number;
  durationHours?: number;
  durationMinutes?: number;
  category: ServiceCategory;
  caption: string;
  brandName?: string;
  town?: string;
  location?: string;
  status?: "DRAFT" | "PUBLISHED";
  featuredImageUrl?: string;
  galleryImageUrls?: string[];
};

export async function createService(input: CreateServiceInput): Promise<KatalokService> {
  return apiRequest<KatalokService>("/api/services", { method: "POST", body: input });
}

export async function getServicesForProfessional(professionalId: string): Promise<KatalokService[]> {
  return apiRequest<KatalokService[]>(`/api/services/professional/${professionalId}`);
}

export async function deleteService(id: string): Promise<void> {
  await apiRequest(`/api/services/${id}`, { method: "DELETE" });
}

export async function updateService(id: string, input: Partial<CreateServiceInput>): Promise<KatalokService> {
  return apiRequest<KatalokService>(`/api/services/${id}`, { method: "PATCH", body: input });
}
