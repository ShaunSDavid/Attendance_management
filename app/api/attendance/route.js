import { db } from "@/utils/dbConfig";
import { Attendance, Students } from "@/utils/schema";
import { and, eq, isNull, or } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const year = searchParams.get("year");
  const month = searchParams.get("month");
  const result = await db
    .select({
      name: Students.name,
      absent1: Attendance.absent1,
      absent2: Attendance.absent2,
      absent3: Attendance.absent3,
      day: Attendance.day,
      date: Attendance.date,
      year: Students.year,
      Rollno: Students.rollno,
      attendanceId: Attendance.id,
    })
    .from(Students)
    .leftJoin(Attendance, eq(Students.rollno, Attendance.Rollno))
    .where(eq(Students.year, year))
    .where(or(eq(Attendance.date, month), isNull(Attendance.date)));

  return NextResponse.json(result);
}

export async function POST(req, res) {
  const data = await req.json();
  const existingRecord = await db
    .select()
    .from(Attendance)
    .where(
      and(
        eq(Attendance.Rollno, data.Rollno),
        eq(Attendance.date, data.date),
        eq(Attendance.day, data.day)
      )
    );
  let result;

  if (existingRecord.length > 0) {
    result = await db
      .update(Attendance)
      .set({
        absent1: data.absent1 ?? existingRecord[0].absent1,
        absent2: data.absent2 ?? existingRecord[0].absent2,
        absent3: data.absent3 ?? existingRecord[0].absent3,
      })
      .where(eq(Attendance.id, existingRecord[0].id));
  } else {
    result = await db.insert(Attendance).values({
      Rollno: data.Rollno,
      absent1: data.absent1 ?? false,
      absent2: data.absent2 ?? false,
      absent3: data.absent3 ?? false,
      day: data.day,
      date: data.date,
    });
  }
  return NextResponse.json(result);
}

export async function DELETE(req) {
  const searchParams = req.nextUrl.searchParams;
  const Rollno = searchParams.get("Rollno");
  const date = searchParams.get("date");
  const day = searchParams.get("day");

  const result = await db
    .delete(Attendance)
    .where(
      and(
        eq(Attendance.Rollno, Rollno),
        eq(Attendance.date, date),
        eq(Attendance.day, day)
      )
    );

  return NextResponse.json(result);
}
