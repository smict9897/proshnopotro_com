"use server";
import { put } from "@vercel/blob";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { staff } from "@/lib/guard";

export async function addResource(fd: FormData): Promise<void> {
  await staff();
  const d = z.object({ title: z.string().min(2), category: z.enum(["Academic", "Admission", "NTRCA", "Library", "Video"]), price: z.coerce.number().int().min(0), link: z.string() }).parse(Object.fromEntries(fd));
  let fileUrl = d.link;
  const file = fd.get("file");
  if (file instanceof File && file.size > 0) {
    if (file.type !== "application/pdf" || file.size > 4_000_000) throw new Error("Upload a PDF up to 4 MB, or paste a link instead.");
    fileUrl = (await put(`notes/${Date.now()}-${file.name}`, file, { access: "public" })).url;
  }
  if (!fileUrl) throw new Error("Add a PDF or a link.");
  await db.resource.create({ data: { title: d.title, category: d.category, fileUrl, priceBdt: d.price } });
  revalidatePath("/", "layout");
}
