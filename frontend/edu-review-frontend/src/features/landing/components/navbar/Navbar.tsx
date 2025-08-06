"use client";

import { cn } from "@/lib/utils";
import { useNavbar, useMobileMenu } from "@/hooks/useNavbar";
import "./navbar.scss";
import { NAV_ITEMS } from "@/features/landing/types/navbar.type";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { AvatarDropdown } from "@/components/ui/avatar-dropdown";
import { useAuth } from "@/hooks/useAuth";

export function Navbar({ rightSlot }: { rightSlot?: React.ReactNode } = {}) {
  const { isScrolled } = useNavbar();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } =
    useMobileMenu();
  const [activeSection, setActiveSection] = useState("home");

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "home",
        "problem",
        "solution",
        "features",
        "reviews",
        "contact",
      ];
      const scrollPosition = window.scrollY + 120; // Offset for navbar height

      // Find the current section
      let currentSection = "home";

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = window.scrollY + rect.top;

          if (scrollPosition >= elementTop) {
            currentSection = sectionId;
          }
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    closeMobileMenu();

    // Smooth scroll for anchor links
    if (href.startsWith("#")) {
      const targetId = href.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        const navbarHeight = 80; // Navbar height
        const elementPosition = element.offsetTop - navbarHeight;

        window.scrollTo({
          top: elementPosition,
          behavior: "smooth",
        });

        // Update active section immediately for better UX
        setActiveSection(targetId);
      }
    }
  };

  // Update NAV_ITEMS with active states
  const navItemsWithActive = NAV_ITEMS.map((item) => ({
    ...item,
    isActive: activeSection === item.href.substring(1),
  }));

  return (
    <>
      <nav
        className={cn(
          "navbar fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          {
            "navbar--glass bg-white/95 shadow-sm navbar--scrolled": isScrolled,
            "bg-transparent navbar--transparent": !isScrolled,
          }
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <NavbarLogo
              isScrolled={isScrolled}
              onLogoClick={() => handleNavClick("#home")}
            />

            {/* Desktop Navigation */}
            <DesktopNavigation
              navItems={navItemsWithActive}
              onNavClick={handleNavClick}
              isScrolled={isScrolled}
            />

            {/* Desktop CTA Buttons + rightSlot */}
            <div className="flex items-center gap-2">
              <DesktopCTAButtons
                isScrolled={isScrolled}
                onStartClick={() => handleNavClick("#solution")}
              />
              {rightSlot}
            </div>

            {/* Mobile Hamburger Button */}
            <HamburgerButton
              isOpen={isMobileMenuOpen}
              onClick={toggleMobileMenu}
              isScrolled={isScrolled}
            />
          </div>
        </div>

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onNavClick={handleNavClick}
          navItems={navItemsWithActive}
        />
      </nav>
    </>
  );
}

export { NavbarLogo };

// Sub-components
function NavbarLogo({
  isScrolled,
  onLogoClick,
}: {
  isScrolled: boolean;
  onLogoClick: () => void;
}) {
  return (
    <button
      onClick={onLogoClick}
      className="navbar__logo navbar__logo--pulse flex items-center space-x-2 cursor-pointer transition-transform duration-300 hover:scale-105"
    >
      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-600 to-orange-500 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-lg lg:text-xl">E</span>
      </div>
      <span
        className={cn(
          "font-bold text-xl lg:text-2xl transition-all duration-300",
          {
            "bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent":
              isScrolled,
            "text-white drop-shadow-lg": !isScrolled,
          }
        )}
      >
        EduReview
      </span>
    </button>
  );
}

function DesktopNavigation({
  navItems,
  onNavClick,
  isScrolled,
}: {
  navItems: Array<{
    label: string;
    href: string;
    isActive: boolean;
    badge?: string;
  }>;
  onNavClick: (href: string) => void;
  isScrolled: boolean;
}) {
  return (
    <div className="hidden lg:flex items-center space-x-8">
      {navItems.map((item) => {
        // Sử dụng Link cho các trang khác, button cho anchor links
        const isAnchorLink = item.href.startsWith("#");
        
        if (isAnchorLink) {
          return (
            <button
              key={item.href}
              onClick={() => onNavClick(item.href)}
              className={cn(
                "navbar__nav-link navbar__nav-link--ripple px-3 py-2 text-sm font-medium transition-all duration-300 relative group",
                {
                  // Active state colors
                  "text-blue-600 font-semibold": item.isActive && isScrolled,
                  "text-white font-semibold drop-shadow-md":
                    item.isActive && !isScrolled,
                  // Normal state colors
                  "text-gray-700 hover:text-blue-600": !item.isActive && isScrolled,
                  "text-white/90 hover:text-white drop-shadow-md":
                    !item.isActive && !isScrolled,
                }
              )}
            >
              <span className="relative inline-flex items-center">
                {item.label}
                {/* Badge - positioned to not overlap text */}
                {item.badge && (
                  <span className="ml-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                    {item.badge}
                  </span>
                )}
              </span>

              {/* Active indicator */}
              {item.isActive && (
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 w-full h-0.5 rounded-full transition-all duration-300",
                    {
                      "bg-gradient-to-r from-blue-600 to-orange-500": isScrolled,
                      "bg-white shadow-sm": !isScrolled,
                    }
                  )}
                />
              )}

              {/* Hover indicator */}
              {!item.isActive && (
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 w-0 h-0.5 rounded-full transition-all duration-300 group-hover:w-full",
                    {
                      "bg-gradient-to-r from-blue-600 to-orange-500": isScrolled,
                      "bg-white": !isScrolled,
                    }
                  )}
                />
              )}
            </button>
          );
        } else {
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "navbar__nav-link navbar__nav-link--ripple px-3 py-2 text-sm font-medium transition-all duration-300 relative group",
                {
                  // Active state colors
                  "text-blue-600 font-semibold": item.isActive && isScrolled,
                  "text-white font-semibold drop-shadow-md":
                    item.isActive && !isScrolled,
                  // Normal state colors
                  "text-gray-700 hover:text-blue-600": !item.isActive && isScrolled,
                  "text-white/90 hover:text-white drop-shadow-md":
                    !item.isActive && !isScrolled,
                }
              )}
            >
              <span className="relative inline-flex items-center">
                {item.label}
                {/* Badge - positioned to not overlap text */}
                {item.badge && (
                  <span className="ml-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                    {item.badge}
                  </span>
                )}
              </span>

              {/* Active indicator */}
              {item.isActive && (
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 w-full h-0.5 rounded-full transition-all duration-300",
                    {
                      "bg-gradient-to-r from-blue-600 to-orange-500": isScrolled,
                      "bg-white shadow-sm": !isScrolled,
                    }
                  )}
                />
              )}

              {/* Hover indicator */}
              {!item.isActive && (
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 w-0 h-0.5 rounded-full transition-all duration-300 group-hover:w-full",
                    {
                      "bg-gradient-to-r from-blue-600 to-orange-500": isScrolled,
                      "bg-white": !isScrolled,
                    }
                  )}
                />
              )}
            </Link>
          );
        }
      })}
    </div>
  );
}

function DesktopCTAButtons({ isScrolled, onStartClick }: { isScrolled: boolean; onStartClick: () => void; }) {
  const { user, isAuthenticated, isLoading } = useAuth();



  return (
    <div className="hidden lg:flex items-center space-x-3">
      {isAuthenticated && user ? (
        <div className={cn(
          "transition-all duration-300",
          {
            "opacity-90": isScrolled,
            "opacity-100": !isScrolled,
          }
        )}>
          <AvatarDropdown profile={user} isScrolled={isScrolled} />
        </div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "navbar__login-btn relative overflow-hidden font-medium transition-all duration-300 hover:scale-105",
            {
              "text-gray-700 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200":
                isScrolled,
              "text-white hover:text-white border border-white/30 hover:border-white hover:bg-white/10 backdrop-blur-sm":
                !isScrolled,
            }
          )}
          asChild
        >
          <Link href="/auth/login">Đăng nhập</Link>
        </Button>
      )}
      <Button
        variant="default"
        size="sm"
        className={cn(
          "font-semibold shadow-md hover:shadow-lg transition-all duration-300",
          {
            "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700": isScrolled,
            "bg-gradient-to-r from-blue-500 via-purple-500 to-orange-400 hover:from-blue-600 hover:via-purple-600 hover:to-orange-500": !isScrolled,
          }
        )}
        onClick={onStartClick}
      >
        Bắt đầu
      </Button>
      <ModeToggle />
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
  navItems,
}: {
  isOpen: boolean;
  onNavClick: (href: string) => void;
  navItems: Array<{
    label: string;
    href: string;
    isActive: boolean;
    badge?: string;
  }>;
}) {
  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "lg:hidden fixed inset-0 z-40 transition-all duration-300",
        {
          "pointer-events-auto opacity-100": isOpen,
          "pointer-events-none opacity-0": !isOpen,
        }
      )}
      aria-hidden={!isOpen}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => onNavClick("#home")}
      />
      <div className="absolute top-0 right-0 w-4/5 max-w-xs h-full bg-white shadow-lg p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between mb-4">
          <NavbarLogo
            isScrolled={true}
            onLogoClick={() => onNavClick("#home")}
          />
          <ModeToggle />
        </div>
        <div className="flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => onNavClick(item.href)}
              className={cn(
                "text-left px-4 py-3 rounded-lg font-medium transition-all duration-200",
                {
                  "bg-blue-50 text-blue-700": item.isActive,
                  "text-gray-700 hover:bg-blue-50 hover:text-blue-700":
                    !item.isActive,
                }
              )}
            >
              {item.label}
              {item.badge && (
                <span className="ml-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
