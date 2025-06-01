import { middleware as createMiddleware } from "nextra/locales";
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  let response = createMiddleware(request);

  if (!response) {
    response = NextResponse.next();
  }

  // カスタムヘッダーを追加する処理
  response.headers.set("x-pathname", request.nextUrl.pathname);


  return response;
}

export const config = {
  // Match only internationalized pathnames
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
