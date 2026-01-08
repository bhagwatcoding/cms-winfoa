import "./globals.css";
import { Toaster } from "@/ui/toaster";
import { ErrorBoundary } from "@/ui/error-boundary";

export const metadata = {
  title: "WINFOA - Education Management System",
  description: "Comprehensive education management platform with multi-subdomain architecture",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ErrorBoundary>
          <Toaster />
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
