import type { Prisma } from "@prisma/client";

export type Filter = {
  category?: string;
  subject?: string;
  topic?: string;
  status?: string;
  q?: string;
};

export function buildWhere(f: Filter): Prisma.QuestionWhereInput {
  const w: Prisma.QuestionWhereInput = {};
  if (f.category) w.category = f.category;
  if (f.subject) w.subject = f.subject;
  if (f.topic) w.topic = f.topic;
  if (f.status === "approved") w.approved = true;
  if (f.status === "pending") w.approved = false;
  if (f.q) w.text = { contains: f.q, mode: "insensitive" };
  return w;
}
