import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "./AppProvider";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "CodeOrb - Open Source Code Execution Engine",
  description: "CodeOrb is an Open Source Code Execution engine for running code in multiple programmnig languages",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
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
