import { CookieService } from '@/core/services/cookie.service';
import './globals.css';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookie = await CookieService.getSessionToken();
  const cookie2 = await CookieService.getSessionToken();
  console.log('cookie', cookie);
  console.log('cookie2', cookie2);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
