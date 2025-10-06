import Link from "next/link";
import React from "react";
import { SiPremierleague } from "react-icons/si";

const Navbar = () => {
  return (
    <div className="w-full h-16 bg-[#191022] border-b border-gray-700 text-white flex items-center px-8">
      <Link
        href="/"
        className="hidden md:block text-xl font-bold cursor-pointer"
      >
        Fantasy World
      </Link>
      <Link href="/" className="md:hidden ml-2 text-white">
        <SiPremierleague size={32} className="md:hidden ml-2 text-white" />
      </Link>
      <nav className="ml-auto">
        <Link href="/" className="mx-4 hover:underline font-semibold">
          Home
        </Link>
        <Link href="/teams" className="mx-4 hover:underline font-semibold">
          Teams
        </Link>
        <Link href="/fixtures" className="mx-4 hover:underline font-semibold">
          Fixtures
        </Link>
        <Link href="/compare" className="mx-4 hover:underline font-semibold">
          Compare players
        </Link>
      </nav>
    </div>
  );
};

export default Navbar;
