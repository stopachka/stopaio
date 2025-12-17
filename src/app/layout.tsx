import type { Metadata } from "next";
import { Spectral } from "next/font/google";

import "./globals.css";
import { cookies } from "next/headers";
import { InstantProvider } from "@/InstantProvider";

const serif = Spectral({
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  subsets: ["latin-ext"],
  display: "block",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const userJSON = cookieStore.get("instant_user");
  const user = userJSON ? JSON.parse(userJSON.value) : null;
  return (
    <html className={serif.variable} lang="en">
      <body className="font-serif">
        <div className="p-4">
          <InstantProvider user={user}>{children}</InstantProvider>
        </div>
      </body>
    </html>
  );
}
