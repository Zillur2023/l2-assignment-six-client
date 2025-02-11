import { getUser } from "@/services/AuthSerivce";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
// import { getUser } from "./services/AuthSerivce";

const AuthRoutes = ["/login", "/register"];

type Role = keyof typeof roleBasedRoutes;

const roleBasedRoutes = {
  user: [/^\/profile/],
  admin: [/^\/admin/],
};

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log("pathNAME zillur", pathname)
  console.log("request zillur", request)

  const user = await getUser();

  console.log("middle ware USER", user)


  if (!user) {
    if (AuthRoutes.includes(pathname)) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(
        new URL(`/login?redirect=${pathname}`, request.url),
      );
    }
  }

  if (user?.role && roleBasedRoutes[user?.role as Role]) {
    const routes = roleBasedRoutes[user?.role as Role];

    if (routes.some((route) => pathname.match(route))) {
      return NextResponse.next();
    }
  }

  return NextResponse.redirect(new URL("/", request.url));
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/profile", "/profile/:page*","/admin", "/admin/:page*", "/login", "/register"],
};