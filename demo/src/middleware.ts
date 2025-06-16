import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  let response = NextResponse.next();

  if (!response) {
    response = NextResponse.next();
  }

  // カスタムヘッダーを追加する処理
  response.headers.set("x-pathname", request.nextUrl.pathname);
  response.headers.set("x-origin", request.nextUrl.origin);

  return response;
}

export const config = {
  // Match only internationalized pathnames
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
