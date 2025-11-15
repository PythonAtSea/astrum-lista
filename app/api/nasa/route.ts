const NASA_BASE = "https://api.nasa.gov";
const API_KEY = process.env.NASA_API_KEY;

async function proxy(request: Request, params: { path?: string[] }) {
  if (!API_KEY) {
    return new Response(
      JSON.stringify({ error: "NASA_API_KEY not set on server" }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      }
    );
  }

  const path = params?.path
    ? params.path.map(encodeURIComponent).join("/")
    : "";
  const targetUrl = new URL(`${NASA_BASE}/${path}`);

  const incomingUrl = new URL(request.url);
  for (const [key, value] of incomingUrl.searchParams) {
    targetUrl.searchParams.append(key, value);
  }

  if (!targetUrl.searchParams.has("api_key")) {
    targetUrl.searchParams.append("api_key", API_KEY);
  }

  const headers = new Headers();
  for (const [key, value] of request.headers) {
    if (key.toLowerCase() === "host") continue;
    headers.set(key, value);
  }

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: "follow",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    const body = await request.arrayBuffer();
    init.body = body;
  }

  const upstream = await fetch(targetUrl.toString(), init);

  const responseHeaders = new Headers();
  for (const [key, value] of upstream.headers) {
    const lower = key.toLowerCase();
    if (
      lower === "transfer-encoding" ||
      lower === "connection" ||
      lower === "keep-alive" ||
      lower === "proxy-authenticate" ||
      lower === "proxy-authorization" ||
      lower === "te" ||
      lower === "trailers" ||
      lower === "upgrade"
    ) {
      continue;
    }
    responseHeaders.set(key, value);
  }

  const buffer = await upstream.arrayBuffer();
  return new Response(buffer, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

export async function GET(
  req: Request,
  { params }: { params: { path?: string[] } }
) {
  return proxy(req, params);
}

export async function POST(
  req: Request,
  { params }: { params: { path?: string[] } }
) {
  return proxy(req, params);
}

export async function PUT(
  req: Request,
  { params }: { params: { path?: string[] } }
) {
  return proxy(req, params);
}

export async function PATCH(
  req: Request,
  { params }: { params: { path?: string[] } }
) {
  return proxy(req, params);
}

export async function DELETE(
  req: Request,
  { params }: { params: { path?: string[] } }
) {
  return proxy(req, params);
}

export async function OPTIONS(
  req: Request,
  { params }: { params: { path?: string[] } }
) {
  return proxy(req, params);
}

export async function HEAD(
  req: Request,
  { params }: { params: { path?: string[] } }
) {
  return proxy(req, params);
}
