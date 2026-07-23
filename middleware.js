export const config = {
  matcher: "/:path*",
};

export default function middleware(request) {
  const url = new URL(request.url);

  if (url.hostname !== "cannaclear-landing.vercel.app") {
    return;
  }

  url.protocol = "https:";
  url.hostname = "www.cannaclear.app";
  url.port = "";

  return Response.redirect(url, 308);
}
