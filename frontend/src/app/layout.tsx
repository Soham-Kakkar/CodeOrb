import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "./AppProvider";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "CodeOrb - Open Source Code Execution Engine",
  description: "CodeOrb is an Open Source Code Execution engine for running code in multiple programmnig languages",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="flex flex-col min-h-screen">
        <AppProvider>
          <Navbar />
          <main className="bg-gray-200">
            {children}
          </main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
