"use client";

import { PageShell, ToolCta } from "@/components/pages/PageShell";

export function TermsPage() {
  return (
    <PageShell
      title="Terms and Conditions"
      lede="The ground rules for using Passport Photo Print Studio — a free browser tool for making and printing passport-style photos. Written to be read, not to hide surprises."
      crumbs={[{ label: "Terms and Conditions" }]}
      updated="February 2025"
      showAds={false}
    >
      <div className="prose-alma">
        <h2>Acceptance of these terms</h2>
        <p>
          By accessing or using Passport Photo Print Studio (the &quot;site&quot; or the
          &quot;tool&quot;), you agree to these Terms and Conditions. If you do not agree with any
          part of them, please do not use the site. These terms apply to every visitor, whether you
          make one photo or a hundred, and they apply from the moment you first load the page.
        </p>

        <h2>What this service is — and what it is not</h2>
        <p>
          The site is a free, browser-based utility that helps you crop, adjust, arrange and export
          passport-style photographs at standard sizes, along with editorial guides about photo
          requirements and printing. It is provided &quot;as is&quot; and &quot;as
          available&quot;. It is not a government service, not a photography studio, not an
          immigration adviser and not affiliated with any passport office, consulate or issuing
          authority. We offer no account, no payment and no promise of availability; the tool may
          change or be discontinued at any time.
        </p>

        <h2>Acceptable use</h2>
        <p>You agree to use the site lawfully and honestly. Specifically, you must not:</p>
        <ul>
          <li>
            Use the tool to produce photographs for unlawful purposes, or to create or support any
            misleading, forged or fraudulent document;
          </li>
          <li>
            Upload, select or process images you have no right to use — you confirm that any photo
            you work with is yours or that you have the right holder&apos;s permission;
          </li>
          <li>
            Attempt to interfere with the site&apos;s operation, probe or scan its infrastructure,
            or bypass any technical restriction;
          </li>
          <li>
            Copy the site&apos;s code, text or design for republication without permission;
          </li>
          <li>
            Use automated means to scrape, overload or monetise access to the site.
          </li>
        </ul>
        <p>
          Because photo processing happens in your browser, your use of the tool is largely outside
          our reach — these rules exist so that everyone understands what the tool is for, and what
          it is decidedly not for.
        </p>

        <h2>No guarantee of document acceptance</h2>
        <p>
          Photo requirements differ between countries, document types, application channels and
          over time. While we work hard to reflect published specifications accurately and to link
          official sources, we cannot guarantee that a photo produced with this tool will be
          accepted by any government agency, consulate or other authority, nor that any size,
          background or quality preset matches the rules that apply to your specific application.
          Always verify current requirements with the official issuing authority before you submit
          an application or pay for printing. Our <a href="#/disclaimer">disclaimer</a> expands on
          this point.
        </p>

        <h2>Intellectual property</h2>
        <p>
          <strong>Your photos remain yours.</strong> Images you process with the tool never leave
          your device, and we claim no licence over them — we never receive them, so we could not
          use them even if we wanted to.
        </p>
        <p>
          <strong>The site itself is not yours to reuse.</strong> The site&apos;s code, written
          guides, design and branding belong to the site operator or its licensors and are
          protected by copyright and other laws. You may use the outputs you create (your composed
          photo sheets) freely for their intended personal purpose. Third-party names, marks and
          official requirements referenced in our guides belong to their respective owners and are
          cited for reference only.
        </p>

        <h2>Disclaimer of warranties</h2>
        <p>
          To the fullest extent permitted by law, the site and all content are provided without
          warranties of any kind, whether express or implied, including but not limited to implied
          warranties of merchantability, fitness for a particular purpose and non-infringement. We
          do not warrant that the tool will be uninterrupted, error-free, accurate in every
          jurisdiction, or compatible with every device and browser. Guides are editorial
          summaries, not certified specifications.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the maximum extent permitted by applicable law, the site operator will not be liable
          for any indirect, incidental, special, consequential or punitive damages, or for any loss
          of data, profits, opportunities, time or money — including, without limitation, costs of
          re-shooting photos, re-printing, expedited shipping, missed appointments or rejected
          applications — arising from or related to your use of, or inability to use, the site or
          its content. Your sole remedy for dissatisfaction with the tool is to stop using it.
          Nothing in these terms excludes liability that cannot be excluded under the law that
          applies to you.
        </p>

        <h2>Third-party services</h2>
        <p>
          The site may load optional third-party services — analytics (Google Analytics) and
          advertising (Google AdSense) — but only where the operator has enabled them and you have
          consented via the cookie banner. Those services are governed by the third parties&apos;
          own terms and privacy policies, not these terms. Links from our guides to official and
          other external websites are provided for convenience; we do not control and are not
          responsible for their content or availability.
        </p>

        <h2>Changes to the service and these terms</h2>
        <p>
          We may modify or discontinue any part of the service, and we may update these terms from
          time to time. The &quot;Last updated&quot; date at the top of this page shows the current
          version. Continuing to use the site after changes take effect means you accept the
          revised terms; if you do not, please stop using the site.
        </p>

        <h2>Governing law</h2>
        <p>
          These terms, and any dispute arising out of your use of the site, are governed by the
          laws of the jurisdiction in which the site operator is established. Nothing in these
          terms limits mandatory consumer rights you may have under the laws of your country of
          residence.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these terms? Get in touch through the <a href="#/contact">contact
          page</a> — the form composes an email in your own mail application, so nothing is
          transmitted by the website itself.
        </p>
      </div>

      <ToolCta
        title="Simple tool, simple terms"
        text="No sign-up, no payment, no strings. If the terms above feel reasonable to you, the maker is one click away."
      />
    </PageShell>
  );
}
