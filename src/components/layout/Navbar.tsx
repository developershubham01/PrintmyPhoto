"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
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
  { label: "About", href: "/about", route: "about" },
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
    <header className="sticky top-0 z-40 border-b border-border/70 bg-alma-aioli/85 backdrop-blur-md dark:bg-background/85">
      <nav
        aria-label="Main navigation"
        className="container-editorial flex h-16 items-center justify-between gap-3 md:h-[72px]"
      >
        <a
          href="#/"
          onClick={(e) => {
            e.preventDefault();
            go("/");
          }}
          className="rounded-xl focus-visible:outline-2"
          aria-label="Passport Photo Print Studio — home"
        >
          <Logo />
        </a>

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={`#${item.href}`}
              onClick={(e) => {
                e.preventDefault();
                go(item.href);
              }}
              aria-current={isActive(item) ? "page" : undefined}
              className={cn(
                "rounded-lg px-3.5 py-2.5 text-[14.5px] font-medium transition-colors hover:bg-secondary/70 focus-visible:outline-2",
                isActive(item)
                  ? "text-alma-collard dark:text-alma-kiwi"
                  : "text-foreground/80",
              )}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            className="btn-gradient hidden h-11 rounded-xl px-5 text-[14.5px] font-semibold sm:inline-flex"
            onClick={() => go("/passport-photo-maker")}
          >
            Start Creating
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-11 w-11 rounded-xl lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] rounded-l-2xl">
              <SheetHeader>
                <SheetTitle asChild>
                  <div>
                    <Logo />
                  </div>
                </SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile navigation" className="mt-2 flex flex-col gap-1 px-4">
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item.href}
                    href={`#${item.href}`}
                    onClick={(e) => {
                      e.preventDefault();
                      go(item.href);
                    }}
                    className={cn(
                      "rounded-xl px-4 py-3 text-[15px] font-medium transition-colors",
                      isActive(item)
                        ? "bg-secondary text-alma-collard dark:text-alma-kiwi"
                        : "hover:bg-secondary/60",
                    )}
                  >
                    {item.label}
                  </a>
                ))}
                <Button
                  className="btn-gradient mt-3 h-12 rounded-xl font-semibold"
                  onClick={() => go("/passport-photo-maker")}
                >
                  Start Creating
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
