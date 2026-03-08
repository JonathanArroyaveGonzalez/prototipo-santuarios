const allowedMediaTypes = new Set(["imagen", "video", "audio", "documento"]);

export function normalizeMediaType(input: string | null | undefined) {
  const value = (input ?? "").trim().toLowerCase();
  if (allowedMediaTypes.has(value)) {
    return value;
  }

  return "documento";
}

export function inferMediaTypeFromMime(mime: string | null | undefined) {
  if (!mime) {
    return "documento";
  }

  if (mime.startsWith("image/")) {
    return "imagen";
  }

  if (mime.startsWith("video/")) {
    return "video";
  }

  if (mime.startsWith("audio/")) {
    return "audio";
  }

  return "documento";
}
