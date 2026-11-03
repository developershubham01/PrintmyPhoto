"use client";

import { PageShell, ToolCta } from "@/components/pages/PageShell";

export function PrivacyPolicyPage() {
  return (
    <PageShell
      title="Privacy Policy"
      lede="How printmyphoto handles your photos, your device and your choices — explained in plain language. The short version: your photos never leave your browser."
      crumbs={[{ label: "Privacy Policy" }]}
      updated="February 2025"
      showAds={false}
    >
      <div className="prose-alma">
        <h2>Overview</h2>
        <p>
          printmyphoto is a free web tool for cropping, adjusting and arranging
          passport-style photographs for printing. This policy explains what happens to your data
          when you use it. We have deliberately designed the tool so that the most sensitive thing
          you could share with us — your photograph — is never sent anywhere at all.
        </p>
        <blockquote>
          Your photos are processed locally in your browser wherever possible. We do not require an
          account to use this tool. Your photographs are not permanently stored by this website.
        </blockquote>
        <p>
          Everything below describes the whole picture in more detail: the small amount of data the
          site does handle, the optional third-party services that only activate with your consent,
          and the controls you have over all of it.
        </p>

        <h2>What we process: your photos</h2>
        <p>
          All photo processing happens entirely on your own device, inside your browser, using the
          HTML5 Canvas API. No photo you select is uploaded to us or to anyone else — there is
          simply no code on this site that transmits your image over the network.
        </p>
        <p>The life of your photo looks like this:</p>
        <ol>
          <li>
            <strong>Selection.</strong> You choose an image from your device. The browser decodes it
            into an <code>ImageBitmap</code> held in the tab&apos;s memory.
          </li>
          <li>
            <strong>Editing.</strong> Cropping, background adjustments and layout composition are
            drawn onto an in-memory canvas. Nothing is written to your disk by the site, and nothing
            is sent to a server.
          </li>
          <li>
            <strong>Export.</strong> When you download a PDF, JPG or PNG, the file is created in
            your browser and handed to you through a temporary blob URL. That URL is revoked
            automatically once you are done with it.
          </li>
          <li>
            <strong>Disposal.</strong> When you reset the editor or close the tab, the in-memory
            image data is discarded by the browser like any other web page data. We keep no copy.
          </li>
        </ol>
        <p>
          Because processing is local, your photo is never stored permanently anywhere by this
          website — there is no server-side photo library, no cloud storage bucket and no backup
          containing your images, because none is ever received.
        </p>

        <h2>Information we do NOT collect</h2>
        <p>We do not ask for, receive or store any of the following:</p>
        <ul>
          <li>Your photographs or any image content, in any form.</li>
          <li>Facial or biometric data. We never analyse who you are.</li>
          <li>
            Your name, email address, phone number or postal address as a condition of using the
            tool. There is no sign-up form.
          </li>
          <li>Payment details. The tool is free and always has been.</li>
          <li>
            Copies of the files you export. Downloads are generated in your browser via temporary
            blob URLs that are revoked automatically.
          </li>
        </ul>
        <p>
          We do not request sensitive personal information anywhere on this site. If you choose to
          contact us, you decide what to share.
        </p>

        <h2>Accounts</h2>
        <p>
          There are none. The tool works with no account, no login and no password. We cannot lose
          or leak credentials we never ask for, and there is no profile linking your usage to an
          identity.
        </p>

        <h2>Local storage on your device</h2>
        <p>
          The site itself sets exactly one item in your browser&apos;s local storage:
        </p>
        <ul>
          <li>
            <strong>Key:</strong> <code>pps-consent</code>
            <br />
            <strong>Purpose:</strong> remembers your cookie consent choice — either
            &quot;accepted&quot; (analytics and advertising allowed) or &quot;essential&quot; (only
            strictly necessary storage) — so the consent banner does not reappear on every visit.
            <br />
            <strong>Duration:</strong> until you clear your browser storage or use the &quot;Cookie
            preferences&quot; button in the footer, which resets the choice.
          </li>
        </ul>
        <p>
          No other cookies or storage keys are created by the site itself. Optional third-party
          storage is described below and is only used after you press &quot;Accept all&quot;.
        </p>

        <h2>Analytics</h2>
        <p>
          If, and only if, the site operator has configured an analytics provider (via the{" "}
          <code>NEXT_PUBLIC_GA_ID</code> environment variable) <em>and</em> you have pressed
          &quot;Accept all&quot; in the consent banner, aggregate usage events are recorded with
          Google Analytics. These events are limited to:
        </p>
        <ul>
          <li>Page views (which guide you looked at);</li>
          <li>The photo editor being opened;</li>
          <li>That a photo was selected (a count only — never the photo);</li>
          <li>Which photo size and paper size you selected;</li>
          <li>That a PDF, JPG or PNG was downloaded;</li>
          <li>That printing was started.</li>
        </ul>
        <p>
          These events never include photo content, facial data, file contents, or any personal
          information. Google Analytics is configured with IP anonymisation enabled. If you choose
          &quot;Essential only&quot;, no analytics script is loaded and no analytics events are
          recorded. If no analytics provider is configured, nothing is sent at all.
        </p>

        <h2>Advertising</h2>
        <p>
          The site may display advertising through Google AdSense. The advertising script is
          consent-gated: it loads only after you press &quot;Accept all&quot;. Advertising is also
          disabled entirely until the operator&apos;s publisher account is approved and configured
          through environment variables — so on many deployments you will never see an ad or an ad
          script at all.
        </p>
        <p>
          When enabled, Google and its partners may use cookies or device identifiers to serve and
          measure ads, including personalised ads based on your prior visits to this or other
          websites. You can review Google&apos;s own practices at{" "}
          <a
            href="https://policies.google.com/technologies/ads"
            target="_blank"
            rel="noopener noreferrer"
          >
            policies.google.com/technologies/ads
          </a>{" "}
          and opt out of personalised advertising in your Google Ad Settings. Choosing
          &quot;Essential only&quot; prevents the AdSense script from loading in the first place.
        </p>

        <h2>Children&apos;s privacy</h2>
        <p>
          This tool is not directed at children and we do not knowingly collect personal
          information from anyone, including children — the site has no registration, no forms that
          transmit data, and no photo collection. Because nothing personal is gathered, there is
          nothing to disclose or delete. If you are a parent or guardian with a concern, you are
          welcome to contact us via the details below.
        </p>

        <h2>Data security</h2>
        <p>
          The strongest security measure on this site is architectural: your photos are processed
          locally in your browser and never travel across a network, so there is no server database
          of photographs to breach, no transfer to intercept and no archive to subpoena. In
          production the site is served over HTTPS, which protects the page itself from tampering
          in transit. Exported files pass through short-lived blob URLs in your own browser and are
          revoked automatically.
        </p>
        <p>
          No method of transmission or storage is ever perfectly secure, but the design goal here
          is simple: minimise what can go wrong by minimising what we ever hold — which, for your
          photos, is nothing.
        </p>

        <h2>Your choices and controls</h2>
        <ul>
          <li>
            <strong>Consent banner.</strong> On your first visit you can choose &quot;Accept
            all&quot; or &quot;Essential only&quot;. Nothing optional loads before you decide.
          </li>
          <li>
            <strong>Change your mind.</strong> Use the &quot;Cookie preferences&quot; button in the
            site footer at any time to reset your choice and see the banner again.
          </li>
          <li>
            <strong>Clear everything.</strong> Clearing your browser&apos;s site data removes the{" "}
            <code>pps-consent</code> key and any third-party cookies; the site will simply ask for
            your choice again next visit.
          </li>
          <li>
            <strong>Blockers welcome.</strong> The tool keeps working with cookies blocked, ad
            blockers enabled and JavaScript storage disabled (consent is then kept in memory for
            the session only).
          </li>
        </ul>

        <h2>International transfers</h2>
        <p>
          The site itself does not transfer your data anywhere: your photos never leave your
          device. If you enable analytics or advertising, those third parties (Google) may process
          limited technical data in countries other than your own, under their own terms and
          safeguards. That processing only begins after you give consent, and it can be stopped at
          any time by resetting your cookie preferences.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          We may update this policy as the tool evolves — for example, if a third-party service is
          added or removed. The &quot;Last updated&quot; date at the top of this page always
          reflects the current version. Material changes to how data is handled will be described
          clearly rather than buried.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy or about how the tool handles data? Visit the{" "}
          <a href="#/contact">contact page</a>. The contact form simply composes a message in your
          own email application — nothing is transmitted by the website itself, so please never
          include a photograph in support requests; we do not need one to help.
        </p>
      </div>

      <ToolCta
        title="Put the privacy promise to the test"
        text="Open the maker with your network tab open and watch: no photo upload ever happens. Crop, arrange and print without your images leaving your device."
      />
    </PageShell>
  );
}
