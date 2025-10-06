"use client";
import Link from "next/link";
import React, { useState } from "react";
import { SiPremierleague } from "react-icons/si";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full bg-[#191022]  text-white ">
      <div className="flex items-center justify-between h-16 px-4 md:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center text-xl font-bold cursor-pointer"
        >
          <SiPremierleague size={28} className="mr-2 md:hidden" />
          <span className="hidden md:block">Fantasy World</span>
        </Link>

        {/* Hamburger for mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none"
          >
            {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>

        {/* Menu */}
        <nav className="hidden md:flex items-center">
          <Link
            href="/teams"
            className="mx-2 md:mx-4 hover:underline font-semibold text-sm md:text-xl"
          >
            Teams
          </Link>
          <Link
            href="/fixtures"
            className="mx-2 md:mx-4 hover:underline font-semibold text-sm md:text-xl"
          >
            Fixtures
          </Link>
          <Link
            href="/compare"
            className="mx-2 md:mx-4 hover:underline font-semibold text-sm md:text-xl"
          >
            Compare players
          </Link>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#191022] border-t border-gray-700 px-4 py-2 flex flex-col">
          <Link
            href="/teams"
            className="py-2 hover:underline font-semibold text-lg"
            onClick={() => setIsOpen(false)}
          >
            Teams
          </Link>
          <Link
            href="/fixtures"
            className="py-2 hover:underline font-semibold text-lg"
            onClick={() => setIsOpen(false)}
          >
            Fixtures
          </Link>
          <Link
            href="/compare"
            className="py-2 hover:underline font-semibold text-lg"
            onClick={() => setIsOpen(false)}
          >
            Compare players
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
