"use client";
import { SignInButton, UserButton, SignedOut, SignedIn } from "@clerk/nextjs";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Bot } from "lucide-react";

function Header() {
  const path = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = useCallback(() => {
    if (typeof window !== "undefined") {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    }
  }, [lastScrollY]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);
      return () => window.removeEventListener("scroll", controlNavbar);
    }
  }, [controlNavbar]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);

    if (!isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = "unset";
  };

  // Keeping your original nav items
  const navItems = [
    { href: "/docs", label: "Docs" },
    { href: "/about", label: "About" },
    { href: "/dashboard", label: "Dashboard" },
    // { href: "/early-access", label: "Early Access" },
  ];

  const externalLinks = [
    { href: "https://discord.com", label: "Discord" },
    { href: "https://x.com", label: "X" },
  ];

  return (
    <>
      {/* Desktop header - keeping this exactly the same as your original */}
      <header
        className={`
          fixed top-0 left-0 right-0 
          flex justify-between items-center 
          p-4 sm:p-5 
          
          z-50 
          transition-all duration-300 ease-in-out
          ${isVisible ? "translate-y-0" : "-translate-y-full"}
        `}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label="ReMa AI Home"
          onClick={closeMobileMenu}
        >
        <span className="font-bold text-2xl nohemi text-indigo-600">ReMa<span className="text-gray-800">.ai</span></span>

        </Link>

        {/* Desktop Navigation - unchanged */}
        <div className="hidden md:flex items-center gap-4">
          <nav
            className="flex items-center bg-white/90 backdrop-blur-md rounded-full px-6 py-2 shadow-md"
            aria-label="Main Navigation"
          >
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                path={path}
                href={item.href}
                label={item.label}
                onClick={closeMobileMenu}
              />
            ))}
          </nav>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="focus:outline-none text-white bg-black rounded-lg p-2 hover:text-gray-300 transition-colors"
            aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={12} /> : <Menu size={12} />}
          </button>
        </div>

        {/* Desktop Authentication - unchanged */}
        <div className="hidden md:block">
          <SignedOut>
            <SignInButton mode="modal">
              <button
                className="
                  px-4 py-2 
                  bg-white text-gray-900 
                  rounded-full 
                  hover:bg-gray-200 
                  transition-colors
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-white 
                  focus:ring-offset-2
                  focus:ring-offset-gray-900
                "
              >
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-10 h-10",
                },
              }}
            />
          </SignedIn>
        </div>
      </header>

      {/* Mobile Menu Overlay - Updated to match the design in the image */}
      {isMobileMenuOpen && (
        <div
          className="
            fixed right-6 top-14 
            bg-black z-40 md:hidden 
            overflow-hidden rounded-xl
            flex flex-col 
            p-6
          "
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
         
          {/* Navigation menu items with larger text - using YOUR original nav items */}
          <nav className="space-y-6 flex-grow pt-10">
            {navItems.map((item) => (
              <div key={item.href} className="border-b border-gray-800 pb-4 last:border-0">
                <Link
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="block text-gray-300 hover:text-white transition-colors text-xl font-light"
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </nav>
          
         
        </div>
      )}
    </>
  );
}

function NavItem({ path, href, label, mobile, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        block 
        transition-all duration-300 ease-in-out 
        cursor-pointer 
        
        ${mobile
          ? "w-full text-lg py-3 text-center text-white hover:text-gray-300"
          : "px-4 py-2 text-gray-700 hover:text-gray-900"}
        ${path === href ? "text-gray-900 font-semibold" : "text-gray-700"}
      `}
    >
      {label}
    </Link>
  );
}

export default Header;