"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { CookieConsent } from "@/components/consent/CookieConsent";
import { useHashRoute } from "@/lib/router";
import { HomePage } from "@/components/home/HomePage";
import { MakerPage } from "@/components/editor/MakerPage";
import { SizesPage } from "@/components/pages/SizesPage";
import { PrintingGuidePage } from "@/components/pages/PrintingGuidePage";
import { HowItWorksPage } from "@/components/pages/HowItWorksPage";
import { FaqPage } from "@/components/pages/FaqPage";
import { AboutPage } from "@/components/pages/AboutPage";
import { ContactPage } from "@/components/pages/ContactPage";
import { PrivacyPolicyPage } from "@/components/pages/PrivacyPolicyPage";
import { TermsPage } from "@/components/pages/TermsPage";
import { DisclaimerPage } from "@/components/pages/DisclaimerPage";
import { CookiePolicyPage } from "@/components/pages/CookiePolicyPage";
import { BlogPage } from "@/components/pages/BlogPage";
import { BlogArticlePage } from "@/components/pages/BlogArticlePage";

export function AppShell() {
  const { route, param } = useHashRoute();

  // Clear in-memory photo data when the tab is closed/refreshed (privacy default).
  useEffect(() => {
    const handler = () => {
      // Nothing persistent exists — this documents intent and clears any stray state.
      sessionStorage.removeItem("pps-editor");
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  // Smooth scroll to top whenever the route or parameter changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [route, param]);

  const view = (() => {
    switch (route) {
      case "maker":
      case "editor":
        return <MakerPage mode={route === "editor" ? "editor" : "maker"} />;
      case "sizes":
        return <SizesPage />;
      case "country":
        return <SizesPage initialCountry={param} />;
      case "printing-guide":
        return <PrintingGuidePage />;
      case "how-it-works":
        return <HowItWorksPage />;
      case "faq":
        return <FaqPage />;
      case "about":
        return <AboutPage />;
      case "contact":
        return <ContactPage />;
      case "privacy-policy":
        return <PrivacyPolicyPage />;
      case "terms":
        return <TermsPage />;
      case "disclaimer":
        return <DisclaimerPage />;
      case "cookie-policy":
        return <CookiePolicyPage />;
      case "blog":
        return <BlogPage />;
      case "blog-article":
        return <BlogArticlePage slug={param} />;
      default:
        return <HomePage />;
    }
  })();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${route}-${param ?? ""}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            {view}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <ScrollToTop />
      <CookieConsent />
    </div>
  );
}
