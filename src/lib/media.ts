import { apiBaseUrl } from "@/lib/api";

export function mediaUrl(path?: string | null) {
  if (!path) {
    return null;
  }

  if (/^(https?:|data:|blob:)/.test(path)) {
    return path;
  }

  if (path.startsWith("/images/")) {
    return path;
  }

  const normalized = path.startsWith("/") ? path : `/storage/${path}`;

  return apiBaseUrl ? `${apiBaseUrl}${normalized}` : normalized;
}
