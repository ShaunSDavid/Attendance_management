import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request) {
  const token = request.cookies.get("auth_token")?.value || null;
  const pathname = request.nextUrl.pathname;
  if (!token) {
    return NextResponse.redirect(process.env.NEXT_PUBLIC_LOGIN_URL);
  }
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    console.log("Decoded Token:", payload);
    //const decoded = jwt.verify(token, SECRET_KEY);
    if (pathname.startsWith("/dashboard") && payload.role === "teacher") {
      return NextResponse.next();
    }
    if (
      pathname.startsWith("/student-dashboard") &&
      payload.role === "student"
    ) {
      return NextResponse.next();
    }
    return NextResponse.redirect(process.env.NEXT_PUBLIC_LOGIN_URL);
  } catch (error) {
    console.log("Invalid Token", error);
    return NextResponse.redirect(process.env.NEXT_PUBLIC_LOGIN_URL);
  }

  //return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/student-dashboard/:path*"],
};

// const protectedRoutes = ["/dashboard", "/student-dashboard"];
// if (protectedRoutes.some((route) => pathname.startsWith(route))) {
//   if (!token) {
//     return NextResponse.redirect(process.env.NEXT_PUBLIC_LOGIN_URL);
//   }
//   try {

//     return NextResponse.next();
//   }
// }
