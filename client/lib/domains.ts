/**
 * Subdomain and Domain Configuration & Helpers for Nextume.in
 */

export const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "nextume.in";

export const SYSTEM_SUBDOMAINS = [
  "app",
  "ats",
  "coverletter",
  "cover-letter",
  "pricing",
  "community",
  "support",
  "api",
  "admin",
  "www",
  "mail",
  "blog",
  "status",
] as const;

export type SystemSubdomain = (typeof SYSTEM_SUBDOMAINS)[number];

/**
 * Extracts subdomain from a hostname (e.g. "jerin.nextume.in" -> "jerin")
 */
export function extractSubdomain(host: string | null): string | null {
  if (!host) return null;

  // Remove port if present (e.g. "jerin.localhost:3000" -> "jerin.localhost")
  const hostname = host.split(":")[0].toLowerCase();

  // If IP address or plain localhost
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === ROOT_DOMAIN.toLowerCase() ||
    hostname === `www.${ROOT_DOMAIN.toLowerCase()}`
  ) {
    return null;
  }

  // Handle localhost subdomains: e.g. "jerin.localhost"
  if (hostname.endsWith(".localhost")) {
    const sub = hostname.replace(".localhost", "");
    return sub && sub !== "www" ? sub : null;
  }

  // Handle production root domain subdomains: e.g. "jerin.nextume.in"
  if (hostname.endsWith(`.${ROOT_DOMAIN.toLowerCase()}`)) {
    const sub = hostname.replace(`.${ROOT_DOMAIN.toLowerCase()}`, "");
    return sub && sub !== "www" ? sub : null;
  }

  // Handle Vercel preview URLs (e.g. "subdomain---preview.vercel.app")
  if (hostname.includes("vercel.app") && hostname.includes("---")) {
    const parts = hostname.split("---");
    return parts[0] || null;
  }

  return null;
}

/**
 * Generates an absolute URL for a given subdomain and path.
 */
export function getSubdomainUrl(subdomain?: string | null, path = ""): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const isDev = typeof window !== "undefined" && window.location.hostname.includes("localhost");

  if (!subdomain || subdomain === "www") {
    if (isDev) {
      return `${window.location.protocol}//localhost:${window.location.port || "3000"}${normalizedPath}`;
    }
    return `https://${ROOT_DOMAIN}${normalizedPath}`;
  }

  if (isDev) {
    return `${window.location.protocol}//${subdomain}.localhost:${window.location.port || "3000"}${normalizedPath}`;
  }

  return `https://${subdomain}.${ROOT_DOMAIN}${normalizedPath}`;
}

/**
 * Generates user portfolio URL on their custom subdomain
 * Example: "jerin" -> "https://jerin.nextume.in"
 */
export function getUserPortfolioUrl(username: string): string {
  const cleanUsername = sanitizeUsername(username);
  return getSubdomainUrl(cleanUsername);
}

/**
 * Generates a clean URL-safe subdomain handle from a user's full name or custom input.
 * Example: "Jerin Jerome Justin" -> "jerin"
 */
export function sanitizeUsername(name: string): string {
  if (!name) return "user";

  // If multiple words (like "Jerin Jerome Justin"), take the first name as default subdomain handle
  const firstWord = name.trim().split(/\s+/)[0];

  const cleaned = firstWord
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "")
    .trim();

  return cleaned || "user";
}
