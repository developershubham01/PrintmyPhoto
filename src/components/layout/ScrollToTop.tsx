"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScrollToTopProps {
  className?: string;
  threshold?: number;
}

export function ScrollToTop({ className, threshold = 280 }: ScrollToTopProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY || document.documentElement.scrollTop;
      setVisible(currentScrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.8, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 12 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          onClick={scrollToTop}
          aria-label="Scroll to top of page"
          title="Scroll to top"
          className={cn(
            "fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 group flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-border/70 bg-card/90 dark:bg-card/90 shadow-lift backdrop-blur-md transition-all hover:border-alma-collard/50 hover:bg-card hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alma-accent cursor-pointer",
            className,
          )}
        >
          <ArrowUp className="h-5 w-5 text-alma-collard dark:text-alma-kiwi transition-transform group-hover:-translate-y-0.5" aria-hidden="true" />
          <span className="sr-only">Scroll to top</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
