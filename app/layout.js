import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/components/master/Footer";

const makaran = localFont({src:"./fonts/makaran.woff", variable:"--font-makaran"})

export const metadata = {
  title: "Mohi Holidays",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={makaran.variable}>
      <body >
        {children}
        {/* <Footer/> */}
      </body>
    </html>
  );
}
