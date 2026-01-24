import "./globals.css";
import { Toaster, ErrorBoundary } from "@/shared/components/ui";
import { ThemeProvider } from "@/shared/components/providers/theme-provider";

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ErrorBoundary>
            <Toaster />
            {children}
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
