import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";

// Secret key used for JWT verification
const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request) {
  // Retrieve authentication token from cookies
  const token = request.cookies.get("auth_token")?.value || null;

  // Get the requested path
  const pathname = request.nextUrl.pathname;

  // If token is missing, redirect to login page
  if (!token) {
    return NextResponse.redirect(process.env.NEXT_PUBLIC_LOGIN_URL);
  }

  try {
    // Verify and decode the JWT token
    const { payload } = await jwtVerify(token, SECRET_KEY);
    console.log("Decoded Token:", payload);

    // Check if the user is a teacher accessing the dashboard
    if (pathname.startsWith("/dashboard") && payload.role === "teacher") {
      return NextResponse.next();
    }

    // Check if the user is a student accessing the student dashboard
    if (
      pathname.startsWith("/student-dashboard") &&
      payload.role === "student"
    ) {
      return NextResponse.next();
    }

    // If the role doesn't match the required path, redirect to login
    return NextResponse.redirect(process.env.NEXT_PUBLIC_LOGIN_URL);
  } catch (error) {
    console.log("Invalid Token", error);
    return NextResponse.redirect(process.env.NEXT_PUBLIC_LOGIN_URL);
  }
}

// Apply middleware to specific routes
export const config = {
  matcher: ["/dashboard/:path*", "/student-dashboard/:path*"],
};
