"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ArrowRight, Menu, ShieldCheck, Sparkles } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useHashRoute, type RouteId } from "@/lib/router";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  route: RouteId;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", route: "home" },
  { label: "Photo Maker", href: "/passport-photo-maker", route: "maker" },
  { label: "Photo Sizes", href: "/passport-photo-sizes", route: "sizes" },
  { label: "Printing Guide", href: "/photo-printing-guide", route: "printing-guide" },
  { label: "How It Works", href: "/how-it-works", route: "how-it-works" },
  { label: "FAQ", href: "/faq", route: "faq" },
];

export function Navbar() {
  const { route, navigate } = useHashRoute();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  void pathname; // single-route app; kept for future real-route migration

  const go = (href: string) => {
    setOpen(false);
    navigate(href);
  };

  const isActive = (item: NavItem) => {
    if (item.route === "maker" || item.route === "editor") {
      return route === "maker" || route === "editor";
    }
    if (item.route === "sizes") return route === "sizes" || route === "country";
    if (item.route === "home") return route === "home";
    return route === item.route;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/90 backdrop-blur-md transition-colors">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 w-full max-w-[1240px] items-center justify-between px-4 sm:px-6 lg:h-[72px] lg:px-8"
      >
        {/* Brand logo */}
        <a
          href="#/"
          onClick={(e) => {
            e.preventDefault();
            go("/");
          }}
          className="shrink-0 rounded-xl outline-none transition-transform hover:opacity-95 focus-visible:ring-2 focus-visible:ring-alma-accent"
          aria-label="printmyphoto — home"
        >
          <Logo />
        </a>

        {/* Desktop navigation links */}
        <div className="hidden items-center gap-1 xl:gap-1.5 lg:flex">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item);
            return (
              <a
                key={item.href}
                href={`#${item.href}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(item.href);
                }}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-xl px-3.5 py-2 text-[14px] font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alma-accent",
                  active
                    ? "bg-alma-collard/10 font-semibold text-alma-collard dark:bg-alma-kiwi/15 dark:text-alma-kiwi shadow-xs"
                    : "text-foreground/75 hover:bg-secondary/70 hover:text-foreground",
                )}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <ThemeToggle />

          <Button
            className="btn-gradient hidden h-10.5 rounded-xl px-5 text-[14px] font-semibold sm:inline-flex"
            onClick={() => go("/passport-photo-maker")}
          >
            <Sparkles className="mr-1.5 h-3.5 w-3.5 text-alma-orange" aria-hidden="true" />
            Start Creating
          </Button>

          {/* Mobile hamburger menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-10.5 w-10.5 rounded-xl lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="flex w-[320px] flex-col p-0 rounded-l-2xl">
              <SheetDescription className="sr-only">
                Navigation menu for mobile devices
              </SheetDescription>

              <SheetHeader className="border-b border-border/70 p-5">
                <SheetTitle asChild>
                  <div>
                    <Logo />
                  </div>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-1 flex-col justify-between overflow-y-auto p-5">
                <nav aria-label="Mobile navigation links" className="flex flex-col gap-1.5">
                  {NAV_ITEMS.map((item) => {
                    const active = isActive(item);
                    return (
                      <a
                        key={item.href}
                        href={`#${item.href}`}
                        onClick={(e) => {
                          e.preventDefault();
                          go(item.href);
                        }}
                        className={cn(
                          "flex items-center justify-between rounded-xl px-4 py-3 text-[15px] transition-colors",
                          active
                            ? "bg-alma-collard/10 font-semibold text-alma-collard dark:bg-alma-kiwi/15 dark:text-alma-kiwi"
                            : "font-medium text-foreground/80 hover:bg-secondary/70 hover:text-foreground",
                        )}
                      >
                        <span>{item.label}</span>
                        {active && (
                          <span className="h-2 w-2 rounded-full bg-alma-collard dark:bg-alma-kiwi" />
                        )}
                      </a>
                    );
                  })}
                </nav>

                <div className="mt-6 space-y-3 pt-4 border-t border-border/70">
                  <Button
                    className="btn-gradient w-full h-12 rounded-xl text-[15px] font-semibold justify-center"
                    onClick={() => go("/passport-photo-maker")}
                  >
                    Start Creating
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Button>

                  <div className="flex items-center justify-center gap-1.5 text-[12px] text-muted-foreground pt-1">
                    <ShieldCheck className="h-4 w-4 text-alma-collard dark:text-alma-kiwi" />
                    <span>Photos processed 100% in browser</span>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
