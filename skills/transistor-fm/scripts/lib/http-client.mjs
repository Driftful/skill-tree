export class TransistorApiError extends Error {
  constructor(message, { status, details } = {}) {
    super(message);
    this.name = "TransistorApiError";
    this.status = status;
    this.details = details;
  }
}

function buildUrl(baseUrl, pathname, query = {}) {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/u, "");
  const url =
    pathname === "" || pathname === "."
      ? new URL(normalizedBaseUrl)
      : new URL(pathname, `${normalizedBaseUrl}/`);
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue;
    url.searchParams.set(key, String(value));
  }
  return url;
}

function isStreamingBody(body) {
  if (!body) {
    return false;
  }

  if (typeof body === "string") {
    return false;
  }

  if (body instanceof ArrayBuffer || ArrayBuffer.isView(body)) {
    return false;
  }

  return (
    typeof body.pipe === "function" ||
    typeof body.getReader === "function" ||
    typeof body[Symbol.asyncIterator] === "function"
  );
}

export function createHttpClient({
  apiKey,
  apiBaseUrl,
  fetchImpl = globalThis.fetch,
} = {}) {
  if (!apiKey) {
    throw new Error("createHttpClient requires an apiKey.");
  }
  if (typeof fetchImpl !== "function") {
    throw new Error("createHttpClient requires a fetch implementation.");
  }

  async function request({
    method = "GET",
    path = "",
    query,
    body,
    headers = {},
  } = {}) {
    const url = buildUrl(apiBaseUrl, path, query);
    const response = await fetchImpl(url, {
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    const text = await response.text();
    let payload = null;
    if (text) {
      try {
        payload = JSON.parse(text);
      } catch {
        payload = { raw: text };
      }
    }

    if (!response.ok) {
      const message =
        response.status === 429
          ? "Transistor API rate limit exceeded. Wait a few seconds and retry."
          : payload?.errors?.[0]?.detail ||
            payload?.message ||
            `Transistor API request failed with status ${response.status}.`;
      throw new TransistorApiError(message, {
        status: response.status,
        details: payload,
      });
    }

    return payload;
  }

  async function upload({
    url,
    contentType,
    contentLength,
    body,
    headers = {},
  } = {}) {
    if (!url) {
      throw new Error("Audio upload requires a destination URL.");
    }
    if (!contentType) {
      throw new Error("Audio upload requires a content type.");
    }
    if (body === undefined) {
      throw new Error("Audio upload requires a request body.");
    }

    const requestHeaders = {
      "Content-Type": contentType,
      ...headers,
    };
    if (contentLength !== undefined && contentLength !== null) {
      requestHeaders["Content-Length"] = String(contentLength);
    }

    const requestOptions = {
      method: "PUT",
      headers: requestHeaders,
      body,
    };
    if (isStreamingBody(body)) {
      requestOptions.duplex = "half";
    }

    const response = await fetchImpl(url, requestOptions);

    if (!response.ok) {
      const text = (await response.text()).trim();
      const suffix = text ? ` ${text}` : "";
      throw new Error(`Audio upload failed with status ${response.status}.${suffix}`);
    }

    return {
      status: response.status,
    };
  }

  return {
    request,
    upload,
    getAuthenticatedUser() {
      return request({ method: "GET", path: "" });
    },
  };
}
