const IMAGES_BASE = "https://images-api.nasa.gov";
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
  const targetUrl = new URL(`${IMAGES_BASE}/${path}`);

  const incomingUrl = new URL(request.url);

  for (const [key, value] of incomingUrl.searchParams) {
    if (key === "api_key") continue;
    targetUrl.searchParams.append(key, value);
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
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const resolved = await params;
  return proxy(req, resolved);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const resolved = await params;
  return proxy(req, resolved);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const resolved = await params;
  return proxy(req, resolved);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const resolved = await params;
  return proxy(req, resolved);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const resolved = await params;
  return proxy(req, resolved);
}

export async function OPTIONS(
  req: Request,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const resolved = await params;
  return proxy(req, resolved);
}

export async function HEAD(
  req: Request,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const resolved = await params;
  return proxy(req, resolved);
}
