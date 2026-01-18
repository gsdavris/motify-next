import { NextResponse } from "next/server";

import { createWpApolloClient } from "@/apollo/client";
import { SEND_MESSAGE } from "@/apollo/mutations/send-message";
import {
  buildContactEmailHtml,
  buildContactReplyHtml,
} from "@/lib/email-templates";
import { getTranslations } from "@/lib/i18n";
import { defaultLocale, locales, type Locale } from "@/lib/locales";

type ContactPayload = {
  name: string;
  email: string;
  company?: string;
  projectType?: string;
  message: string;
  source?: string;
  locale?: "el" | "en";
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ContactPayload;
    const locale: Locale =
      payload?.locale && locales.includes(payload.locale as Locale)
        ? (payload.locale as Locale)
        : defaultLocale;
    const t = getTranslations(locale);

    if (!payload?.name || !payload?.email || !payload?.message) {
      return NextResponse.json(
        { error: t.contact_error_missing_fields ?? "Missing required fields." },
        { status: 400 }
      );
    }

    const originHeader = request.headers.get("origin") || "";
    const siteBase = process.env.NEXT_PUBLIC_SITE_URL || originHeader;
    const baseUrl = siteBase.replace(/\/$/, "");
    const isLocalhost =
      baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1");
    const logoUrl = isLocalhost
      ? undefined
      : process.env.EMAIL_LOGO_URL || (baseUrl ? `${baseUrl}/logo-motify.png` : undefined);
    const fromEmail = process.env.CONTACT_FROM_EMAIL || "info@motify.gr";
    const fromName = process.env.CONTACT_FROM_NAME || "Motify";
    const from = `${fromName} <${fromEmail}>`;
    const subject = `${t.contact_email_subject ?? "New Project Inquiry"} — ${payload.name}`;
    const html = buildContactEmailHtml({
      ...payload,
      locale,
      siteName: "Motify",
      logoUrl,
    });

    const input = {
      replyTo: payload.email,
      subject,
      body: html,
      from,
      clientMutationId: crypto.randomUUID()
    };

    const client = createWpApolloClient(
      originHeader ? { headers: { origin: originHeader } } : undefined
    );
    const result = await client.mutate({
      mutation: SEND_MESSAGE,
      variables: { input },
    });

    const sent = result.data?.sendEmail?.sent;
    if (!sent) {
      const message =
        result.data?.sendEmail?.message ||
        t.contact_error_send_failed ||
        "Email send failed.";
      return NextResponse.json({ error: message }, { status: 500 });
    }

    const replySubject =
      t.contact_email_reply_subject ?? "Thanks — we received your message";

    const replyHtml = buildContactReplyHtml({
      ...payload,
      locale,
      siteName: "Motify",
      logoUrl,
    });

    await client.mutate({
      mutation: SEND_MESSAGE,
      variables: {
        input: {
          to: payload.email,
          subject: replySubject,
          body: replyHtml,
          from,
          clientMutationId: crypto.randomUUID(),
        },
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[Contact API] send failed", error);
    return NextResponse.json(
      { error: getTranslations(defaultLocale).contact_error_server ?? "Server error." },
      { status: 500 }
    );
  }
}
