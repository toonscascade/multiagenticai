import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { Home, Users, FileText, Book } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MultiAgent AI - Transform Your Workflow with AI-Powered Agents",
  description: "Revolutionize your productivity with our suite of intelligent AI agents for coding, marketing, content creation, research, and more.",
  keywords: ["AI", "Artificial Intelligence", "Automation", "Productivity", "Software Development", "Marketing", "Content Creation"],
  authors: [{ name: "MultiAgent AI" }],
  openGraph: {
    title: "MultiAgent AI - Transform Your Workflow with AI-Powered Agents",
    description: "Revolutionize your productivity with our suite of intelligent AI agents.",
    type: "website",
  },
};

const navItems = [
  { name: 'Home', url: '/', icon: Home },
  { name: 'Agents', url: '/agents', icon: Users },
  { name: 'Pricing', url: '/#pricing', icon: FileText },
  { name: 'Docs', url: '/docs', icon: Book },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NavBar items={navItems} />
        {children}
      </body>
    </html>
  );
}
