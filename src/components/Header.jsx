import React from "react";
import { NavLink } from "react-router-dom";

const navLinks = [
  { label: "Home", to: "/" }
];

export function Header() {
  return (
    <header className="relative top-0 left-0 w-full bg-black bg-opacity-80 backdrop-blur-sm z-30">
      <nav className="max-w-7xl mx-auto px-8 py-4 flex space-x-6">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `text-white hover:text-gray-300 transition ${isActive ? "underline" : ""}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}