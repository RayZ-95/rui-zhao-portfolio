import { isAdminPassword, readContent, writeContent } from "@/lib/store";
import type { Asset } from "@/lib/types";
import { promises as fs } from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (!isAdminPassword(request.headers.get("x-admin-password"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const altText = String(form.get("altText") ?? "");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]+/g, "-");
  const filename = `${Date.now()}-${safeName}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), bytes);

  const asset: Asset = {
    filename,
    url: `/uploads/${filename}`,
    type: file.type,
    altText,
    createdAt: new Date().toISOString()
  };
  const content = await readContent();
  content.assets = [asset, ...content.assets];
  await writeContent(content);

  return NextResponse.json(asset);
}
