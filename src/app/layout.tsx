import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SAYED HASAN",
  description: "SAYED HASAN SAYED HASAN SAYED HASAN",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
