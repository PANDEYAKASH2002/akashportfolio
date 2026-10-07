import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Akash Pandey — Full-Stack Developer | React & Node.js",
  description: "Personal portfolio of Akash Pandey — Full-Stack Developer (MERN), React.js & Node.js Engineer specializing in production web systems, relational PostgreSQL architectures, real-time GPS telemetry, and enterprise RBAC.",
  keywords: [
    "Akash Pandey",
    "Full-Stack Developer",
    "React Developer",
    "Node.js Developer",
    "Express.js",
    "PostgreSQL",
    "Prisma ORM",
    "MongoDB",
    "Leaflet.js",
    "PayU Integration",
    "MERN Stack",
    "Software Engineer",
    "Surat Developer"
  ],
  authors: [{ name: "Akash Pandey", url: "mailto:pandeyaakash7491@gmail.com" }],
  creator: "Akash Pandey",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://akashpandey.dev",
    title: "Akash Pandey — Full-Stack Developer | React & Node.js",
    description: "Production-grade Full-Stack Engineering with React, Node.js, PostgreSQL, and Linux/Nginx infrastructure.",
    siteName: "Akash Pandey Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Akash Pandey — Full-Stack Developer | React & Node.js",
    description: "Engineering real production systems across Frontend, Backend, Databases, and DevOps.",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export const viewport: Viewport = {
  themeColor: "#F5F4F1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}
    >
      <body className="min-h-screen bg-[#F5F4F1] text-[#111111] antialiased selection:bg-[#B15F2C] selection:text-white">
        {children}
      </body>
    </html>
  );
}
