import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
// This function can be marked `async` if using `await` inside
// export async function middleware(request) {
//   const { isAuthenticated } = getKindeServerSession();

//   if (!(await isAuthenticated())) {
//     return NextResponse.redirect(
//       new URL("/api/auth/login?post_login_redirect_url=/dashboard", request.url)
//     );
//   }
// }

// // See "Matching Paths" below to learn more
// export const config = {
//   matcher: "/dashboard/:path*",
// };

import { NextResponse } from "next/server";

export async function middleware(request) {
  // const token = request.cookies.get("token");
  // if (!token) {
  //   return NextResponse.redirect(process.env.NEXT_PUBLIC_LOGIN_URL);
  // }

  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/dashboard")) {
    return NextResponse.next(); // Allow access to the dashboard
  }

  if (pathname.startsWith("/student-dashboard")) {
    return NextResponse.next(); // Allow access to the student dashboard
  }

  return NextResponse.redirect(process.env.NEXT_PUBLIC_LOGIN_URL);
}

export const config = {
  matcher: ["/dashboard/:path*", "/student-dashboard/:path*"],
};
