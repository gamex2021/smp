import { api } from "~/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { NextResponse } from "next/server";
import { env } from "./env";
import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  isAuthenticatedNextjs,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isPublicPage = createRouteMatcher(["/sign-in", "/register", "/"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  // Redirect user to sign in if route is not public and user is not authenticated
  if (!isPublicPage(request) && !(await isAuthenticatedNextjs())) {
    return nextjsMiddlewareRedirect(request, "/sign-in");
  }
  //TODO: Redirect user away from the sign-in page if authenticated
  const url = request.nextUrl;
  let hostname = request.headers.get("host")!;
  if (env.NODE_ENV === "development") {
    hostname = hostname?.replace(".localhost:3000", "");
  } else {
    hostname = hostname?.replace(`.${env.BASE_DOMAIN}`, "");
  }
  if (!hostname) {
    console.log("No subdomain, serving root domain content");
    return NextResponse.next();
  }
  const searchParams = url.searchParams.toString();
  const path = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;
  console.log(path);
  console.log(searchParams);    
  if (hostname === "localhost:3000") {
    return NextResponse.next();
    // return NextResponse.rewrite(
    //   new URL(`/${hostname}${path === "/" ? "" : path}`, req.url),
    // );
  }
  // Uncomment and adjust the following block if you need to fetch school data
  
  const schoolData = await fetchQuery(api.queries.school.findSchool, {
    domain: hostname,
  });
  
  console.log(schoolData);
  if (!schoolData?.domain) {
    console.log("No school data found return 404 or something");
    return NextResponse.next();
  }

  return NextResponse.rewrite(new URL(`/${hostname}${path}`, request.nextUrl));
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
// import { NextResponse, type NextRequest } from "next/server";
// import { fetchQuery } from "convex/nextjs";
//
// export const config = {
//   matcher: [
//     /*
//      * Match all paths except for:
//      * 1. /api routes
//      * 2. /_next (Next.js internals)
//      * 3. /_static (inside /public)
//      * 4. all root files inside /public (e.g. /favicon.ico)
//      * 5. all image files (e.g. .jpg, .png, .gif, etc.)
//      */
//     "/((?!api/|_next/|_static/|_vercel|images/|[\\w-]+\\.(?:jpg|jpeg|gif|png|svg|ico)$).*)",
//   ],
// };
//
// export default async function middleware(req: NextRequest) {
//   const url = req.nextUrl;
//
//   // Check if the request is for an image
//   if (
//     url.pathname.startsWith("/images/") ||
//     /\.(jpg|jpeg|png|gif|ico|svg)$/.exec(url.pathname)
//   ) {
//     return NextResponse.next();
//   }
//
//   // test.smp.com
//   let hostname = req.headers.get("host")!;
//   console.log(hostname)
//   if (env.NODE_ENV === "development") {
//     hostname = hostname?.replace(".localhost:3000", "");
//   } else {
//     hostname = hostname?.replace(`.${env.BASE_DOMAIN}`, "");
//   }
//
//   if (!hostname) {
//     console.log("No subdomain, serving root domain content");
//     return NextResponse.next();
//   }
//
//   const searchParams = req.nextUrl.searchParams.toString();
//   // Get the pathname of the request (e.g. /, /about, /blog/first-post)
//   const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""
//     }`;
//   console.log(path);
//   if (
//     hostname === "localhost:3000"
//     // hostname === env.NEXT_PUBLIC_ROOT_DOMAIN
//   ) {
//     return NextResponse.next();
//     // return NextResponse.rewrite(
//     //   new URL(`/${hostname}${path === "/" ? "" : path}`, req.url),
//     // );
//   }
//   // Uncomment and adjust the following block if you need to fetch school data
//   // const schoolData = await fetchQuery(api.queries.school.findSchool, {
//   //   domain: hostname,
//   // });
//   //
//   // if (!schoolData?.domain) {
//   //   console.log("No school data found return 404 or something");
//   //   return NextResponse.next();
//   // }
//
//   return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
// }
