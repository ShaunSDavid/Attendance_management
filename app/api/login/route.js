import { db } from "@/utils/dbConfig";
import { NextResponse } from "next/server";
import { Users } from "@/utils/schema";
import jwt from "jsonwebtoken";
import { and, eq } from "drizzle-orm";

const SECRET_KEY = process.env.JWT_SECRET;

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email");
    const password = searchParams.get("password");

    console.log("Query Parameters:", { email, password });

    const result = await db
      .select({
        role: Users.role,
        email: Users.email,
      })
      .from(Users)
      .where(and(eq(Users.email, email), eq(Users.password, password)));

    console.log("Query Result:", result);

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Invalid Credentials" },
        { status: 401 }
      );
    }

    const { role } = result[0];

    if (!SECRET_KEY) {
      throw new Error(
        "JWT_SECRET is not defined in the environment variables."
      );
    }

    const token = jwt.sign({ email, role }, SECRET_KEY, { expiresIn: "1d" });

    const response = NextResponse.json({
      message: "Login Successful",
      role: role,
    });

    response.cookies.set("auth_token", token, {
      httpOnly: false,
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
