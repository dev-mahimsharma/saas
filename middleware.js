export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/templates/:path*", "/web-development/:path*", "/app-selection/:path*", "/app-development/:path*", "/success/:path*"],
};
