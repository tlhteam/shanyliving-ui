import { apiBaseUrl } from "@/lib/api";

export function isRawImagePayload(value: string) {
  const trimmedValue = value.trim();
  const decodedValue = (() => {
    try {
      return decodeURIComponent(trimmedValue);
    } catch {
      return trimmedValue;
    }
  })();
  const pathValue = decodedValue.replace(/^https?:\/\/[^/]+\/?/i, "").replace(/^\/+/, "");
  const payloadMarkers = ["9j/", "iVBORw0KGgo", "R0lGOD", "UklGR"];

  return payloadMarkers.some((marker) => pathValue.startsWith(marker) || pathValue.includes(`/${marker}`));
}

export function isUsableImagePath(path?: string | null) {
  if (!path) {
    return false;
  }

  const trimmedPath = path.trim();

  return Boolean(trimmedPath) && !isRawImagePayload(trimmedPath) && (trimmedPath.length <= 2048 || /^(data:|blob:)/.test(trimmedPath));
}

export function mediaUrl(path?: string | null) {
  if (!isUsableImagePath(path)) {
    return null;
  }

  const trimmedPath = path.trim();

  if (/^(https?:|data:|blob:)/.test(trimmedPath)) {
    return trimmedPath;
  }

  if (trimmedPath.startsWith("/images/")) {
    return trimmedPath;
  }

  const normalized = trimmedPath.startsWith("/") ? trimmedPath : `/storage/${trimmedPath}`;

  return apiBaseUrl ? `${apiBaseUrl}${normalized}` : normalized;
}
