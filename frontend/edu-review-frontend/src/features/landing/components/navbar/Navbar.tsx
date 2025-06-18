"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useNavbar, useMobileMenu } from "@/hooks/useNavbar";
import "./navbar.scss";
import { NAV_ITEMS } from "@/features/landing/types/navbar.type";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { isScrolled, isVisible } = useNavbar();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } =
    useMobileMenu();

  const handleNavClick = (href: string) => {
    closeMobileMenu();

    // Smooth scroll for anchor links
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <nav
        className={cn(
          // Base styles
          "navbar fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          // Conditional styles
          {
            "navbar--glass": isScrolled,
            "navbar--visible": isVisible,
            "navbar--hidden": !isVisible,
            "bg-white/95 shadow-sm": isScrolled,
            "bg-transparent": !isScrolled,
          }
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <NavbarLogo />

            {/* Desktop Navigation */}
            <DesktopNavigation onNavClick={handleNavClick} />

            {/* Desktop CTA Buttons */}
            <DesktopCTAButtons />

            {/* Mobile Hamburger Button */}
            <HamburgerButton
              isOpen={isMobileMenuOpen}
              onClick={toggleMobileMenu}
            />
          </div>
        </div>

        {/* Mobile Menu */}
        <MobileMenu isOpen={isMobileMenuOpen} onNavClick={handleNavClick} />
      </nav>

      {/* Spacer */}
      <div className="h-16 lg:h-20"></div>
    </>
  );
}

// Sub-components for better organization
function NavbarLogo() {
  return (
    <Link
      href="/"
      className="navbar__logo navbar__logo--pulse flex items-center space-x-2"
    >
      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-600 to-orange-500 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-lg lg:text-xl">E</span>
      </div>
      <span className="font-bold text-xl lg:text-2xl bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
        EduReview
      </span>
    </Link>
  );
}

function DesktopNavigation({
  onNavClick,
}: {
  onNavClick: (href: string) => void;
}) {
  return (
    <div className="hidden lg:flex items-center space-x-8">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => onNavClick(item.href)}
          className={cn(
            "navbar__nav-link navbar__nav-link--ripple px-3 py-2 text-sm font-medium transition-colors duration-200",
            {
              "navbar__nav-link--active text-blue-600": item.isActive,
              "text-gray-700 hover:text-blue-600": !item.isActive,
            }
          )}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

function DesktopCTAButtons() {
  return (
    <div className="hidden lg:flex items-center space-x-4">
      <Button variant="ghost" size="sm">
        Đăng nhập
      </Button>
      <Button size="sm" className="navbar__cta-button navbar__cta-button--glow">
        Bắt đầu ngay
      </Button>
    </div>
  );
}

function HamburgerButton({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "navbar__hamburger lg:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200",
        {
          "navbar__hamburger--open": isOpen,
        }
      )}
      aria-label="Toggle mobile menu"
    >
      <div className="w-6 h-6 flex flex-col justify-center space-y-1">
        <span className="line w-full h-0.5 bg-current rounded-full"></span>
        <span className="line w-full h-0.5 bg-current rounded-full"></span>
        <span className="line w-full h-0.5 bg-current rounded-full"></span>
      </div>
    </button>
  );
}

function MobileMenu({
  isOpen,
  onNavClick,
}: {
  isOpen: boolean;
  onNavClick: (href: string) => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 top-16 bg-black/20 backdrop-blur-sm">
      <div
        className={cn(
          "navbar__mobile-menu bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-lg",
          "navbar__mobile-menu--enter-active"
        )}
      >
        <div className="px-4 py-6 space-y-4">
          {/* Mobile Navigation Links */}
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onNavClick(item.href)}
              className={cn(
                "block px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200",
                {
                  "bg-blue-50 text-blue-600 border-l-4 border-blue-600":
                    item.isActive,
                  "text-gray-700 hover:bg-gray-50 hover:text-blue-600":
                    !item.isActive,
                }
              )}
            >
              {item.label}
            </Link>
          ))}

          {/* Mobile CTA Buttons */}
          <div className="pt-4 space-y-3 border-t border-gray-200">
            <Button variant="outline" className="w-full justify-center">
              Đăng nhập
            </Button>
            <Button
              variant="default"
              className="w-full justify-center navbar__cta-button"
            >
              Bắt đầu ngay
            </Button>
          </div>

          {/* Mobile Contact Info */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Cần hỗ trợ?
              <Link
                href="#contact"
                className="text-blue-600 hover:underline ml-1"
              >
                Liên hệ với chúng tôi
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
