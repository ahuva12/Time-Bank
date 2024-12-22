"use client";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/components/Footer/Footer";
import ReactQueryProvider from '@/providers/ReactQueryProvider';
import { useAuthStore } from "@/store/authStore";
import { HeaderLogin, HeaderLogout, HeaderLoading } from "@/components";
import { useState, useEffect } from "react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isLoggedIn } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isLoggedIn !== undefined) {
      setIsReady(true);
    }
  }, [isLoggedIn]);
 
  return (
    <html lang="en" dir="rtl">
      <head>
        <title>TimeRepublik</title>
        <link href="/images/heands.png" rel="icon" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
        {isReady ? (isLoggedIn ? <HeaderLogin /> : <HeaderLogout />) :
        <HeaderLoading/>}
        {children}
        <Footer /> 
        </ReactQueryProvider>
        
      </body>
    </html>
  );
}

