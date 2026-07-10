// components/Footer.jsx
import React from "react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-900 text-slate-400 py-4 px-6 text-center border-t border-slate-800">
      <p className="text-sm tracking-wide">
        &copy; {currentYear} <span className="font-semibold text-white">DevilHome</span>. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;