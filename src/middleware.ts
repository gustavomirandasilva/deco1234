import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Middleware adicional se necessário
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return token?.role === "ADMIN";
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};