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
     * 5. all image files (e.g. .jpg, .png, .gif, etc.)
     */
    "/((?!api/|_next/|_static/|_vercel|images/|[\\w-]+\\.(?:jpg|jpeg|gif|png|svg|ico)$).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Check if the request is for an image
  if (
    url.pathname.startsWith("/images/") ||
    /\.(jpg|jpeg|png|gif|ico|svg)$/.exec(url.pathname)
  ) {
    return NextResponse.next();
  }

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
  console.log(path);
  if (
    hostname === "localhost:3000"
    // hostname === env.NEXT_PUBLIC_ROOT_DOMAIN
  ) {
    return NextResponse.next();
    // return NextResponse.rewrite(
    //   new URL(`/${hostname}${path === "/" ? "" : path}`, req.url),
    // );
  }
  // Uncomment and adjust the following block if you need to fetch school data
  // const schoolData = await fetchQuery(api.queries.school.findSchool, {
  //   domain: hostname,
  // });
  //
  // if (!schoolData?.domain) {
  //   console.log("No school data found return 404 or something");
  //   return NextResponse.next();
  // }

  return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
}
