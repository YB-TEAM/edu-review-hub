"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useNavbar, useMobileMenu } from "@/hooks/useNavbar";
import "./navbar.scss";
import { NAV_ITEMS } from "@/features/landing/types/navbar.type";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { isScrolled } = useNavbar(); // Remove isVisible since we don't want it to hide
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
          // Base styles - Always sticky and always visible
          "navbar fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          // Conditional styles - Only add background when scrolled
          {
            "navbar--glass bg-white/95 shadow-sm navbar--scrolled": isScrolled,
            // Always visible - remove visibility conditions
            // "navbar--visible": isVisible,
            // "navbar--hidden": !isVisible,
            // No background when at top
            "bg-transparent navbar--transparent": !isScrolled,
          }
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <NavbarLogo isScrolled={isScrolled} />

            {/* Desktop Navigation */}
            <DesktopNavigation
              onNavClick={handleNavClick}
              isScrolled={isScrolled}
            />

            {/* Desktop CTA Buttons */}
            <DesktopCTAButtons isScrolled={isScrolled} />

            {/* Mobile Hamburger Button */}
            <HamburgerButton
              isOpen={isMobileMenuOpen}
              onClick={toggleMobileMenu}
              isScrolled={isScrolled}
            />
          </div>
        </div>

        {/* Mobile Menu */}
        <MobileMenu isOpen={isMobileMenuOpen} onNavClick={handleNavClick} />
      </nav>
    </>
  );
}

// Sub-components for better organization
function NavbarLogo({ isScrolled }: { isScrolled: boolean }) {
  return (
    <Link
      href="/"
      className="navbar__logo navbar__logo--pulse flex items-center space-x-2"
    >
      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-600 to-orange-500 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-lg lg:text-xl">E</span>
      </div>
      <span
        className={cn(
          "font-bold text-xl lg:text-2xl bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent transition-all duration-300",
          {
            // When scrolled, keep gradient text
            "bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent":
              isScrolled,
            // When transparent, use white text with shadow for better visibility
            "text-white drop-shadow-lg": !isScrolled,
          }
        )}
      >
        EduReview
      </span>
    </Link>
  );
}

function DesktopNavigation({
  onNavClick,
  isScrolled,
}: {
  onNavClick: (href: string) => void;
  isScrolled: boolean;
}) {
  return (
    <div className="hidden lg:flex items-center space-x-8">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => onNavClick(item.href)}
          className={cn(
            "navbar__nav-link navbar__nav-link--ripple px-3 py-2 text-sm font-medium transition-all duration-300",
            {
              // Active state colors based on scroll state
              "navbar__nav-link--active text-blue-600":
                item.isActive && isScrolled,
              "navbar__nav-link--active text-white drop-shadow-md":
                item.isActive && !isScrolled,
              // Normal state colors based on scroll state
              "text-gray-700 hover:text-blue-600": !item.isActive && isScrolled,
              "text-white/90 hover:text-white drop-shadow-md":
                !item.isActive && !isScrolled,
            }
          )}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

function DesktopCTAButtons({ isScrolled }: { isScrolled: boolean }) {
  return (
    <div className="hidden lg:flex items-center space-x-3">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "navbar__login-btn relative overflow-hidden font-medium transition-all duration-300 hover:scale-105",
          {
            // When scrolled (white background)
            "text-gray-700 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200":
              isScrolled,
            // When transparent (dark background)
            "text-white hover:text-white border border-white/30 hover:border-white hover:bg-white/10 backdrop-blur-sm":
              !isScrolled,
          }
        )}
      >
        <span className="relative z-10">Đăng nhập</span>
      </Button>

      <Button
        size="sm"
        className={cn(
          "navbar__cta-button relative overflow-hidden font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl",
          {
            // When scrolled - gradient background
            "bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white":
              isScrolled,
            // When transparent - white background with gradient text
            "bg-white hover:bg-gray-50 text-transparent bg-clip-text":
              !isScrolled,
          }
        )}
      >
        <span
          className={cn("relative z-10 transition-all duration-300", {
            "text-white": isScrolled,
            "bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent font-bold":
              !isScrolled,
          })}
        >
          Bắt đầu ngay
        </span>
        {/* Animated background effect */}
        <div
          className={cn(
            "absolute inset-0 opacity-0 transition-opacity duration-300",
            {
              "bg-gradient-to-r from-blue-700 to-orange-600 group-hover:opacity-100":
                isScrolled,
              "bg-gradient-to-r from-blue-50 to-orange-50 hover:opacity-100":
                !isScrolled,
            }
          )}
        />
      </Button>
    </div>
  );
}

function HamburgerButton({
  isOpen,
  onClick,
  isScrolled,
}: {
  isOpen: boolean;
  onClick: () => void;
  isScrolled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "navbar__hamburger lg:hidden p-2 rounded-md transition-all duration-300",
        {
          "navbar__hamburger--open": isOpen,
          // Colors based on scroll state
          "text-gray-700 hover:text-blue-600 hover:bg-gray-100": isScrolled,
          "text-white hover:text-white hover:bg-white/10 drop-shadow-md":
            !isScrolled,
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
            <Button
              variant="outline"
              className="w-full justify-center relative overflow-hidden border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10 font-medium">Đăng nhập</span>
            </Button>
            <Button
              variant="default"
              className="w-full justify-center relative overflow-hidden bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold"
            >
              <span className="relative z-10">Bắt đầu ngay</span>
              {/* Shimmer effect for mobile too */}
              <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-500 hover:left-[100%]" />
            </Button>
          </div>

          {/* Mobile Contact Info */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Cần hỗ trợ?
              <Link
                href="#contact"
                className="text-blue-600 hover:underline ml-1 font-medium"
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
