import { db } from "@/utils/dbConfig";
import { NextResponse } from "next/server";
import { Users } from "@/utils/schema";
// import { bcrypt } from "bcryptjs";
// import jwt from "jsonwebtoken";
import { and, eq } from "drizzle-orm";

// export async function POST(request) {
//   const { email, password } = await request.json();
//   const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);

//   if (!user) {
//     return NextResponse.json({ error: "User not found" }, { status: 404 });
//   }

//   const validPassword = await bcrypt.compare(password, user.password);
//   if (!validPassword) {
//     return NextResponse.json({ error: "Invalid Credentials" }, { status: 401 });
//   }

//   const token = jwt.sign(
//     { userId: user.id, role: user.role },
//     process.env.JWT_SECRET,
//     { expiresIn: "1d" }
//   );
//   return NextResponse.json({ token });
// }

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get("email");
  const password = searchParams.get("password");
  const result = await db
    .select({
      role: Users.role,
    })
    .from(Users)
    .where(and(eq(Users.email, email)), eq(Users.password, password));
  return NextResponse.json(result);
}
