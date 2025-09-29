import React from "react";

const Navbar = () => {
  return (
    <div className="w-full h-16 bg-[#191022] border-b border-gray-700 text-white flex items-center px-8">
      <h1 className="text-xl font-bold">Fantasy World</h1>
      <nav className="ml-auto">
        <a href="/" className="mx-4 hover:underline">
          Home
        </a>
        <a href="/teams" className="mx-4 hover:underline">
          Teams
        </a>
        <a href="/fixtures" className="mx-4 hover:underline">
          Fixtures
        </a>
      </nav>
    </div>
  );
};

export default Navbar;
