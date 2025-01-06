import { db } from "@/utils/dbConfig";
import { Attendance, Students } from "@/utils/schema";

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const year = searchParams.get("year");
  const month = searchParams.get("month");
  const email = searchParams.get("email");
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
    .where(and(eq(Students.year, year), eq(Students.email, email)))
    .where(or(eq(Attendance.date, month), isNull(Attendance.date)));

  return NextResponse.json(result);
}
