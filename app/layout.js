import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/components/master/Footer";
import RequestCallbackButton from "@/components/master/RequestCallbackButton";
import { Red_Hat_Display } from 'next/font/google';
const makaran = localFont({ src: "./fonts/makaran.woff", variable: "--font-makaran" })

export const redHatDisplay = Red_Hat_Display({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-red-hat-display',
});

export const metadata = {
  title: "Mohi Holidays",
  description: "We are Mohi Holidays — your trusted travel partner for the Andaman & Nicobar Islands. We take you beyond the resort and into the heart of the islands, where every moment becomes a lasting memory.",
  icons: {
    icon: "/favicon.ico",
  },
};

import ThemeProvider from "@/components/master/ThemeProvider";
import { AuthProvider } from "@/components/master/AuthContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${makaran.variable} ${redHatDisplay.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider>
            {children}
            <Footer />
            <RequestCallbackButton />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
