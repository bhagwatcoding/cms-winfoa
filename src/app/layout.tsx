import "./globals.css";
import { Toaster, ErrorBoundary } from "@/ui";

export const metadata = {
  title: {
    template: "%s - Education Management System",
    default: "Winfoa - Education Management System"
  },
  description: "Comprehensive cms management platform with multi-subdomain architecture",
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
