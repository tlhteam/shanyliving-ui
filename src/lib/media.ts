import { apiBaseUrl } from "@/lib/api";

const IMAGE_EXTENSIONS = /\.(avif|gif|jpe?g|png|webp|svg)$/i;
const EMPTY_IMAGE_VALUES = new Set(["", "undefined", "null", "nan", "[object object]"]);

function cleanImagePath(path?: string | null) {
  if (path === undefined || path === null) {
    return "";
  }

  const trimmedPath = String(path).trim();

  return EMPTY_IMAGE_VALUES.has(trimmedPath.toLowerCase()) ? "" : trimmedPath;
}

export function isRawImagePayload(value: string) {
  const trimmedValue = cleanImagePath(value);

  if (!trimmedValue || /^data:image\//i.test(trimmedValue)) {
    return false;
  }

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
  const trimmedPath = cleanImagePath(path);

  if (!trimmedPath || isRawImagePayload(trimmedPath)) {
    return false;
  }

  if (/^(https?:|data:image\/|blob:)/i.test(trimmedPath)) {
    return true;
  }

  if (trimmedPath.length > 2048) {
    return false;
  }

  return trimmedPath.startsWith("/") || trimmedPath.startsWith("storage/") || trimmedPath.startsWith("uploads/") || IMAGE_EXTENSIONS.test(trimmedPath);
}

function normalizeImagePath(path: string) {
  let normalized = path.trim().replace(/\\/g, "/");

  if (/^(https?:|data:image\/|blob:)/i.test(normalized)) {
    return normalized;
  }

  if (normalized.startsWith("/images/")) {
    return normalized;
  }

  normalized = normalized
    .replace(/^\/+/, "")
    .replace(/^storage\/app\/public\//, "")
    .replace(/^public\//, "")
    .replace(/^storage\//, "");

  if (normalized.startsWith("uploads/")) {
    return `/storage/${normalized}`;
  }

  if (IMAGE_EXTENSIONS.test(normalized) && !normalized.includes("/")) {
    return `/storage/uploads/products/${normalized}`;
  }

  return `/${normalized}`;
}

export function mediaUrl(path?: string | null) {
  if (!isUsableImagePath(path)) {
    return null;
  }

  const normalized = normalizeImagePath(cleanImagePath(path));

  if (/^(https?:|data:image\/|blob:)/i.test(normalized) || normalized.startsWith("/images/")) {
    return normalized;
  }

  return apiBaseUrl ? `${apiBaseUrl}${normalized}` : normalized;
}
