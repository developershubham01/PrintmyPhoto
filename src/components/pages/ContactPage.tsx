"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/pages/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Clock,
  ListChecks,
  Info,
  Send,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

const SUPPORT_EMAIL = "hello@passport-photo-studio.example";

const SUBJECTS = ["Feedback", "Bug report", "Feature request", "Privacy question", "Other"] as const;
type Subject = (typeof SUBJECTS)[number];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState<Subject>("Feedback");
  const [message, setMessage] = useState("");

  const emailError =
    email.trim() === ""
      ? "Please add your email address so we can reply."
      : EMAIL_RE.test(email.trim())
        ? ""
        : "That email address does not look right — please check it.";

  const messageError =
    message.trim().length >= 10 ? "" : "Please write at least 10 characters so we can help.";

  const isValid = emailError === "" && messageError === "";

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isValid) return;

    const trimmedEmail = email.trim();
    const trimmedName = name.trim();
    const mailSubject = subject + (trimmedName ? ` — from ${trimmedName}` : "");
    const mailBody = [
      trimmedName ? `Name: ${trimmedName}` : null,
      `Reply-to: ${trimmedEmail}`,
      "",
      message.trim(),
    ]
      .filter((line): line is string => line !== null)
      .join("\n");

    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
      mailSubject,
    )}&body=${encodeURIComponent(mailBody)}`;

    toast.success("Your email app is opening", {
      description: "Nothing was sent from the website — the message is composed in your own mail app.",
    });
  }

  return (
    <PageShell
      title="Contact"
      lede="Found a bug, spotted an outdated size guide, or just want to say the tool saved you a trip to the photo shop? We read everything."
      crumbs={[{ label: "Contact" }]}
      updated="February 2025"
    >
      <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border bg-card p-6 shadow-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
              <Mail className="h-5 w-5 text-alma-collard" aria-hidden="true" />
            </div>
            <h2 className="mt-4 font-display text-[17px] font-semibold">Email us</h2>
            <p className="mt-1 font-mono text-[13.5px] text-foreground">{SUPPORT_EMAIL}</p>
            <div className="mt-3 flex gap-2 rounded-xl border border-dashed bg-secondary/50 p-3 text-[12.5px] leading-relaxed text-muted-foreground">
              <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <p>
                Placeholder address — replace with the live support address before production. The
                form below always composes mail with whatever address is published here.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
              <Clock className="h-5 w-5 text-alma-collard" aria-hidden="true" />
            </div>
            <h2 className="mt-4 font-display text-[17px] font-semibold">Response time</h2>
            <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
              We are a small editorial team running a free tool, so we aim to reply within a few
              business days. Urgent passport questions are usually best answered by the official
              issuing authority first.
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
              <ListChecks className="h-5 w-5 text-alma-collard" aria-hidden="true" />
            </div>
            <h2 className="mt-4 font-display text-[17px] font-semibold">What to include</h2>
            <ul className="mt-3 space-y-2 text-[14px] leading-relaxed text-muted-foreground">
              <li>The page URL (for example the guide you were reading).</li>
              <li>Your browser and version (Chrome 121, Safari 17, and so on).</li>
              <li>A short description of what happened and what you expected.</li>
            </ul>
            <p className="mt-3 text-[12.5px] leading-relaxed text-muted-foreground">
              Please never attach photographs to support email — we do not need them and prefer not
              to receive personal images.
            </p>
          </div>

          <a
            href="#/privacy-policy"
            className="flex items-center justify-between gap-3 rounded-2xl border bg-card p-5 shadow-card transition-transform hover:-translate-y-0.5"
          >
            <span className="flex items-center gap-2.5 text-[14px] font-medium">
              <ShieldCheck className="h-4 w-4 text-alma-collard" aria-hidden="true" />
              How we handle data
            </span>
            <ExternalLink className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </a>
        </div>

        <div>
          <div className="rounded-2xl border bg-card p-6 shadow-card md:p-8">
            <h2 className="font-display text-2xl font-semibold">Send a message</h2>
            <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">
              Fill in the form and press send. Your own email application will open with the
              message pre-filled — review it, add anything you like, and send from there.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contact-name">
                    Name <span className="font-normal text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="contact-name"
                    name="name"
                    autoComplete="name"
                    placeholder="How should we address you?"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email</Label>
                  <Input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={emailError !== ""}
                    aria-describedby={emailError !== "" ? "contact-email-error" : undefined}
                  />
                  {emailError !== "" && (
                    <p id="contact-email-error" className="text-[13px] text-destructive">
                      {emailError}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-subject">Subject</Label>
                <select
                  id="contact-subject"
                  name="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value as Subject)}
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-message">Message</Label>
                <Textarea
                  id="contact-message"
                  name="message"
                  rows={6}
                  placeholder="Tell us what is on your mind — the more detail, the faster we can help."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  aria-invalid={messageError !== ""}
                  aria-describedby={messageError !== "" ? "contact-message-error" : undefined}
                />
                {messageError !== "" && (
                  <p id="contact-message-error" className="text-[13px] text-destructive">
                    {messageError}
                  </p>
                )}
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={!isValid}
                  className="h-11 w-full rounded-xl text-[15px] font-semibold sm:w-auto sm:px-8"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  Compose in my email app
                </Button>
                <p className="mt-3 text-[12.5px] leading-relaxed text-muted-foreground">
                  This opens your own email app — nothing is sent from the website.
                </p>
              </div>
            </form>
          </div>

          <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
            Prefer not to use a form? Email{" "}
            <span className="font-mono text-[12.5px] text-foreground">{SUPPORT_EMAIL}</span>{" "}
            directly — the address composes in your mail client either way.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
