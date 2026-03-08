const uploadUrl = process.env.FILE_SERVICE_UPLOAD_URL;
const uploadBypassToken = process.env.FILE_SERVICE_BYPASS_TOKEN;
const uploadBearerToken = process.env.FILE_SERVICE_AUTH_BEARER;

function buildUploadUrl() {
  if (!uploadUrl) {
    throw new Error("FILE_SERVICE_UPLOAD_URL is not configured.");
  }

  const url = new URL(uploadUrl);

  if (uploadBypassToken) {
    url.searchParams.set("x-vercel-protection-bypass", uploadBypassToken);
  }

  return url.toString();
}

export async function uploadFileToStorage(file: File): Promise<string> {
  const resolvedUploadUrl = buildUploadUrl();

  const formData = new FormData();
  formData.append("file", file);

  const headers: Record<string, string> = {
    accept: "application/json",
  };

  if (uploadBearerToken) {
    headers.Authorization = `Bearer ${uploadBearerToken}`;
  }

  if (uploadBypassToken) {
    headers["x-vercel-protection-bypass"] = uploadBypassToken;
  }

  const response = await fetch(resolvedUploadUrl, {
    method: "POST",
    body: formData,
    headers,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Upload service failed: ${response.status} ${text}`);
  }

  const data = (await response.json()) as { url?: string };

  if (!data.url) {
    throw new Error("Upload service did not return a file URL.");
  }

  return data.url;
}
