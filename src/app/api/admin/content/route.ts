import { isAdminPassword, readContent, writeContent } from "@/lib/store";
import type { SiteContent } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(request: NextRequest) {
  if (!isAdminPassword(request.headers.get("x-admin-password"))) return unauthorized();
  const content = await readContent();
  return NextResponse.json(content);
}

export async function PUT(request: NextRequest) {
  if (!isAdminPassword(request.headers.get("x-admin-password"))) return unauthorized();
  const body = (await request.json()) as SiteContent;
  await writeContent(body);
  return NextResponse.json({ ok: true });
}
