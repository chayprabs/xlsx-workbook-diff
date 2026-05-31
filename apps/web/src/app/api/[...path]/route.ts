import { NextRequest, NextResponse } from "next/server";

function workerBase(): string {
  return (
    process.env.API_PROXY_TARGET ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8080"
  ).replace(/\/$/, "");
}

async function proxy(request: NextRequest, path: string[]) {
  const target = `${workerBase()}/${path.join("/")}${request.nextUrl.search}`;
  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);

  const init: RequestInit = {
    method: request.method,
    headers,
    body: request.method !== "GET" && request.method !== "HEAD" ? await request.arrayBuffer() : undefined,
  };

  const res = await fetch(target, init);
  const outHeaders = new Headers();
  const ct = res.headers.get("content-type");
  if (ct) outHeaders.set("content-type", ct);
  const cd = res.headers.get("content-disposition");
  if (cd) outHeaders.set("content-disposition", cd);

  return new NextResponse(res.body, { status: res.status, headers: outHeaders });
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxy(request, path);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxy(request, path);
}
