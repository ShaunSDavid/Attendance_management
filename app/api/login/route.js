import { db } from "@/utils/dbConfig"; // Importing database configuration
import { NextResponse } from "next/server"; // Importing Next.js response utility
import { Users } from "@/utils/schema"; // Importing database schema for Users
import jwt from "jsonwebtoken"; // Importing JWT for token generation
import { and, eq } from "drizzle-orm"; // Importing Drizzle ORM query functions

// Secret key for JWT authentication, stored in environment variables
const SECRET_KEY = process.env.JWT_SECRET;

// Handler for GET request - Handles user authentication
export async function GET(request) {
  try {
    // Extracting query parameters from the request URL
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email");
    const password = searchParams.get("password");

    console.log("Query Parameters:", { email, password });

    // Querying the database to check if a user exists with the provided email and password
    const result = await db
      .select({
        role: Users.role, // Selecting user role
        email: Users.email, // Selecting email (though not used further)
      })
      .from(Users)
      .where(and(eq(Users.email, email), eq(Users.password, password))); // Matching email and password

    console.log("Query Result:", result);

    // If no matching user is found, return an error response
    if (result.length === 0) {
      return NextResponse.json(
        { error: "Invalid Credentials" },
        { status: 401 } // Unauthorized status
      );
    }

    // Extracting user role from the query result
    const { role } = result[0];

    // Ensure the JWT secret key is available
    if (!SECRET_KEY) {
      throw new Error(
        "JWT_SECRET is not defined in the environment variables."
      );
    }

    // Generating JWT token with email and role, valid for 1 day
    const token = jwt.sign({ email, role }, SECRET_KEY, { expiresIn: "1d" });

    // Creating a response object with a success message and role
    const response = NextResponse.json({
      message: "Login Successful",
      role: role,
    });

    // Setting an authentication token in cookies
    response.cookies.set("auth_token", token, {
      httpOnly: false, // Not using httpOnly to allow access from client-side scripts
      maxAge: 60 * 60 * 24, // Expiration time: 1 day
      path: "/", // Cookie accessible across all routes
      secure: process.env.NODE_ENV === "production", // Secure cookie in production
    });

    return response;
  } catch (error) {
    // Logging the error and returning an internal server error response
    console.error("Error during login:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 } // Server error status
    );
  }
}
