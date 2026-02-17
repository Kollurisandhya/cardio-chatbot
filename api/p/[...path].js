// FUSEPLANE_RUNTIME: vercel
// FUSEPLANE_VERSION: 0.1.13

const GATEWAY_URL = process.env.FUSEPLANE_URL || "https://api.fuseplane.com";

// 1. configuration: FORCE "export default" instead of "module.exports"
export default async function handler(req, res) {
  // 2. Use req.url to get the full path (e.g., "/12345678/users")
  // This mirrors your Vite proxy behavior by capturing the raw URL.
  // We remove the leading slash if present to avoid double slashes.
  const path = req.url.startsWith("/") ? req.url.slice(1) : req.url;

  const url = `${GATEWAY_URL}/${path}`;

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.FUSEPLANE_SECRET_KEY || ""}`,
      },
      body:
        req.method !== "GET" && req.method !== "HEAD"
          ? JSON.stringify(req.body)
          : undefined,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Fuseplane proxy error:", error);
    res.status(500).json({ error: "Proxy failed" });
  }
}
