"use client"

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // Import Lucide icons

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <div className="mb-2 font-bold">
        <Link href="/" className="relative">
          <span className="text-2xl">CodeOrb</span>
          <span className="absolute left-0 top-full text-xs w-max">
            Online Code Execution Platform
          </span>
        </Link>
      </div>

      {/* Desktop navigation links */}
      <div className="hidden md:flex space-x-8">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/about" className="hover:underline">
          About
        </Link>
        <Link href="/editor" className="hover:underline">
          Code Editor
        </Link>
      </div>

      {/* Hamburger Icon for smaller screens */}
      <div className="md:hidden">
        <button onClick={toggleMenu} className="text-white">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 right-6 bg-blue-700 p-4 rounded-md space-y-4">
          <Link href="/" className="block text-white hover:underline">
            Home
          </Link>
          <Link href="/about" className="block text-white hover:underline">
            About
          </Link>
          <Link href="/editor" className="block text-white hover:underline">
            Code Editor
          </Link>
        </div>
      )}
    </nav>
  );
};