import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import NextAuthSessionProvider from "@/providers/sessionProvider";
import { UserProvider } from "@/providers/user-provider";

export const metadata: Metadata = {
  "title": "Boilerplate Next JS + Prisma",
  "description": "",
  "icons": [],
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NextAuthSessionProvider>
          <UserProvider>
            {children}
          </UserProvider>
        </NextAuthSessionProvider>
          <Toaster/>
      </body>
    </html>
  );
}
