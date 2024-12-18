import { db } from "@/utils/dbConfig";
import { Years } from "@/utils/schema";
import { NextResponse } from "next/server";

export async function GET(req) {
  const result = await db.select().from(Years);
  return NextResponse.json(result);
}
