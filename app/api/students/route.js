import { db } from "@/utils/dbConfig";
import { Students } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req, resp) {
  const data = await req.json();

  const result = await db.insert(Students).values({
    name: data?.name,
    year: data?.year,
    regno: data?.regno,
    rollno: data?.rollno,
  });

  return NextResponse.json(result);
}

export async function GET(req) {
  const result = await db.select().from(Students);
  return NextResponse.json(result);
}

export async function DELETE(req) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");

  const result = await db.delete(Students).where(eq(Students.id, id));
  return NextResponse.json(result);
}
