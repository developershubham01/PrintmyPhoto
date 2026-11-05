"use client";

import { PageShell, ToolCta } from "@/components/pages/PageShell";
import { Cookie, ShieldCheck, Eraser, MousePointerClick } from "lucide-react";

const STORAGE_ROWS = [
  {
    name: "pps-consent",
    type: "Local storage (site-set)",
    purpose:
      "Remembers your cookie consent choice — \"accepted\" or \"essential\" — so the consent banner does not reappear on every visit.",
    duration: "Until cleared, or until you press \"Cookie preferences\" in the footer",
    consent: "No — strictly necessary",
  },
  {
    name: "_ga, _ga_* (Google Analytics 4)",
    type: "HTTP cookie (third party)",
    purpose:
      "Aggregate, anonymous usage statistics (page views, tool events such as downloads or paper size selected). Loaded only after \"Accept all\" and only when the publisher has configured analytics.",
    duration: "Set by Google — typically up to 2 years",
    consent: "Yes — \"Accept all\"",
  },
  {
    name: "Google AdSense cookies",
    type: "HTTP cookies (third party)",
    purpose:
      "Ad measurement, frequency capping and, where enabled, personalised advertising. Loaded only after \"Accept all\" and only once advertising is approved and configured by the publisher.",
    duration: "Varies by cookie — set by Google",
    consent: "Yes — \"Accept all\"",
  },
];

export function CookiePolicyPage() {
  return (
    <PageShell
      title="Cookie Policy"
      lede="What cookies and browser storage this site uses, why there is only one item we set ourselves, and how to change or delete your choice at any time."
      crumbs={[{ label: "Cookie Policy" }]}
      updated="February 2025"
      showAds={false}
    >
      <div className="prose-alma">
        <h2>Cookies and local storage, in one paragraph</h2>
        <p>
          Cookies are small text files a website can ask your browser to store; local storage is a
          similar, slightly larger key–value store that stays on your device. Both are commonly
          used to remember settings between visits. We use as little of this as possible: the
          site&apos;s own code writes exactly one storage entry, and everything beyond that is
          strictly opt-in.
        </p>

        <h2>The one item the site itself sets</h2>
        <p>
          <code>pps-consent</code> is a single local-storage key that records your answer to the
          consent banner — either <code>accepted</code> (optional analytics and advertising
          allowed) or <code>essential</code> (only strictly necessary storage). Without it, the
          banner would nag you on every page load, which serves nobody. It contains no identifier,
          no personal data and nothing about your photos. You can delete it whenever you like; the
          site simply asks again next time.
        </p>

        <h2>Third-party storage — only with your consent</h2>
        <p>
          If, and only if, you press &quot;Accept all&quot;, two optional third parties may set
          their own cookies:
        </p>
        <ul>
          <li>
            <strong>Google Analytics</strong> (only where the publisher has configured it) sets the
            <code> _ga</code> cookie family for aggregate traffic statistics. Our event set is
            deliberately limited — page views, editor opens, download and print counts — and never
            includes photo content or personal data.
          </li>
          <li>
            <strong>Google AdSense</strong> (only once advertising is approved and configured) may
            set cookies for ad measurement, frequency capping and, where enabled, personalised
            advertising. Google&apos;s own policies and controls govern these.
          </li>
        </ul>
        <p>
          Press &quot;Essential only&quot; and neither script ever loads, so no third-party cookie
          is set at all. Without &quot;Accept all&quot;, the only item ever stored on your device
          by or for this site is the essential <code>pps-consent</code> entry.
        </p>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border bg-card shadow-card">
        <table className="w-full min-w-[640px] border-collapse text-left text-[13.5px]">
          <caption className="sr-only">
            Cookies and browser storage used by this site, with purpose, duration and consent
            status
          </caption>
          <thead>
            <tr className="border-b bg-secondary/70">
              <th scope="col" className="px-4 py-3 font-semibold">Name</th>
              <th scope="col" className="px-4 py-3 font-semibold">Type</th>
              <th scope="col" className="px-4 py-3 font-semibold">Purpose</th>
              <th scope="col" className="px-4 py-3 font-semibold">Duration</th>
              <th scope="col" className="px-4 py-3 font-semibold">Consent required</th>
            </tr>
          </thead>
          <tbody>
            {STORAGE_ROWS.map((row) => (
              <tr key={row.name} className="border-b align-top last:border-b-0">
                <td className="px-4 py-3 font-mono text-[12.5px] font-medium">{row.name}</td>
                <td className="px-4 py-3">{row.type}</td>
                <td className="px-4 py-3">{row.purpose}</td>
                <td className="px-4 py-3">{row.duration}</td>
                <td className="px-4 py-3">{row.consent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="prose-alma mt-8">
        <h2>How to control or delete storage</h2>
        <ul>
          <li>
            <strong>The easy way.</strong> Use the &quot;Cookie preferences&quot; button in the
            site footer. It clears the stored consent choice and reopens the banner, so you can
            switch between &quot;Accept all&quot; and &quot;Essential only&quot; whenever you want.
          </li>
          <li>
            <strong>Your browser.</strong> Every major browser lets you view and delete cookies and
            site data (usually under Privacy &amp; security → Cookies and site data). Clearing data
            for this site removes <code>pps-consent</code> and any third-party cookies in one go.
          </li>
          <li>
            <strong>Blocking outright.</strong> The tool keeps working with cookies fully blocked
            or an ad blocker enabled; your consent choice is then simply kept in memory for the
            session.
          </li>
        </ul>

        <h2>What we do not use cookies for</h2>
        <p>
          No tracking pixels of our own, no social-media widgets, no session identifiers, no
          advertising profiles created by us, and nothing that could identify you personally. For
          the full picture of how your photos and data are handled, read the{" "}
          <a href="/privacy-policy">privacy policy</a>.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border bg-card p-6 shadow-card">
          <Cookie className="h-5 w-5 text-alma-collard" aria-hidden="true" />
          <h3 className="mt-3 font-display text-[17px] font-semibold">One key, zero tracking</h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            The site sets a single storage item — your consent choice. Everything else waits for
            an explicit &quot;Accept all&quot;.
          </p>
        </div>
        <div className="rounded-2xl border bg-card p-6 shadow-card">
          <ShieldCheck className="h-5 w-5 text-alma-collard" aria-hidden="true" />
          <h3 className="mt-3 font-display text-[17px] font-semibold">Opt-in by design</h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            Analytics and ad scripts are not loaded before you consent — and not at all unless the
            publisher has configured them.
          </p>
        </div>
        <div className="rounded-2xl border bg-card p-6 shadow-card">
          <Eraser className="h-5 w-5 text-alma-collard" aria-hidden="true" />
          <h3 className="mt-3 font-display text-[17px] font-semibold">Delete anytime</h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            The footer&apos;s &quot;Cookie preferences&quot; button resets your choice instantly;
            clearing browser data works just as well.
          </p>
        </div>
        <div className="rounded-2xl border bg-card p-6 shadow-card">
          <MousePointerClick className="h-5 w-5 text-alma-collard" aria-hidden="true" />
          <h3 className="mt-3 font-display text-[17px] font-semibold">Decline with no penalty</h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            Every feature of the photo maker works identically whether you accept, decline or
            block cookies entirely.
          </p>
        </div>
      </div>

      <ToolCta
        title="Cookie-light by architecture"
        text="The tool works entirely in your browser, so it never needed much tracking in the first place. Try it and keep your cookies to yourself."
      />
    </PageShell>
  );
}
