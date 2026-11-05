"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ArrowRight,
  BookOpen,
  Camera,
  HelpCircle,
  Home,
  Menu,
  Printer,
  Ruler,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useHashRoute, type RouteId } from "@/lib/router";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  route: RouteId;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", route: "home", icon: Home },
  { label: "Photo Maker", href: "/passport-photo-maker", route: "maker", icon: Camera },
  { label: "Photo Sizes", href: "/passport-photo-sizes", route: "sizes", icon: Ruler },
  { label: "Printing Guide", href: "/photo-printing-guide", route: "printing-guide", icon: Printer },
  { label: "How It Works", href: "/how-it-works", route: "how-it-works", icon: BookOpen },
  { label: "FAQ", href: "/faq", route: "faq", icon: HelpCircle },
];

export function Navbar() {
  const { route, navigate } = useHashRoute();
  const [open, setOpen] = useState(false);

  const go = (href: string) => {
    setOpen(false);
    navigate(href);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-md transition-colors">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 w-full max-w-[1240px] items-center justify-between px-4 sm:px-6 lg:h-[72px] lg:px-8"
      >
        {/* Brand logo */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            go("/");
          }}
          className="group shrink-0 rounded-xl outline-none transition-opacity hover:opacity-95 focus-visible:ring-2 focus-visible:ring-alma-accent"
          aria-label="printmyphoto — home"
        >
          <Logo />
        </a>

        {/* Desktop navigation links (compact on 1024px, spacious on 1280px+) */}
        <div className="hidden items-center gap-0.5 xl:gap-1.5 lg:flex">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item);
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  go(item.href);
                }}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-xl px-2.5 py-1.5 text-[13.5px] font-medium transition-all duration-150 xl:px-3.5 xl:py-2 xl:text-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alma-accent",
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
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <ThemeToggle />

          <Button
            className="btn-gradient hidden h-10 rounded-xl px-4 text-[13.5px] font-semibold sm:inline-flex xl:h-10.5 xl:px-5 xl:text-[14px]"
            onClick={() => go("/passport-photo-maker")}
          >

            Start Creating
          </Button>

          {/* Mobile hamburger menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-xl lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="flex w-[320px] max-w-[85vw] flex-col p-0 rounded-l-2xl">
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
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          go(item.href);
                        }}
                        className={cn(
                          "flex items-center justify-between rounded-xl px-3.5 py-3 text-[14.5px] transition-colors",
                          active
                            ? "bg-alma-collard/10 font-semibold text-alma-collard dark:bg-alma-kiwi/15 dark:text-alma-kiwi"
                            : "font-medium text-foreground/80 hover:bg-secondary/70 hover:text-foreground",
                        )}
                      >
                        <span className="flex items-center gap-3">
                          <Icon className={cn("h-4.5 w-4.5", active ? "text-alma-collard dark:text-alma-kiwi" : "text-muted-foreground")} />
                          {item.label}
                        </span>
                        {active ? (
                          <span className="h-2 w-2 rounded-full bg-alma-collard dark:bg-alma-kiwi" />
                        ) : (
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/60" />
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
