import { NextResponse, type NextRequest } from "next/server";
import { env } from "./env";
import { fetchQuery } from "convex/nextjs";
import { api } from "convex/_generated/api";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // test.smp.com
  let hostname = req.headers.get("host")!;

  if (env.NODE_ENV === "development") {
    hostname = hostname?.replace(".localhost:3000", "");
  } else {
    hostname = hostname?.replace(`.${env.BASE_DOMAIN}`, "");
  }

  if (!hostname) {
    console.log("No subdomain, serving root domain content");

    return NextResponse.next();
  }
  const searchParams = req.nextUrl.searchParams.toString();
  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""
    }`;
  //
  // const schoolData = await fetchQuery(api.queries.school.findSchool, {
  //   domain: hostname,
  // });
  //
  // if (!schoolData?.domain) {
  //   console.log("No school data found return 404 or something");
  //   return NextResponse.next();
  // }
  //
  return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
}
