import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  title: "App : Management System",
  description: "Application Branch Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
