const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

type ContactTemplateProps = {
  name: string;
  email: string;
  company?: string;
  projectType?: string;
  message: string;
  source?: string;
  locale?: "el" | "en";
  siteName?: string;
  logoUrl?: string;
};

const buildLogoHtml = (logoUrl?: string) => {
  if (logoUrl) {
    return `<img src="${logoUrl}" alt="Motify" style="width:140px; height:auto; display:block;" />`;
  }
  return `
    <div style="font-size:20px; font-weight:700; letter-spacing:0.5px; line-height:1; color:#ffffff;">
      Motify<span style="color:#22d3ee;">.</span>
    </div>
  `;
};

const emailCopy = {
  en: {
    inquiryTitle: "New Project Inquiry",
    sourceLabel: "Source",
    nameLabel: "Name",
    emailLabel: "Email",
    companyLabel: "Company",
    projectTypeLabel: "Project Type",
    messageLabel: "Message",
    footer:
      "This message was sent from the contact form on the Motify website.",
    replyTitle: "Thanks for reaching out!",
    replyIntro:
      "We received your message and a member of our team will get back to you within 24 hours.",
    replySummary: "Your submission",
  },
  el: {
    inquiryTitle: "Νέο Αίτημα Έργου",
    sourceLabel: "Πηγή",
    nameLabel: "Όνομα",
    emailLabel: "Email",
    companyLabel: "Εταιρεία",
    projectTypeLabel: "Τύπος Project",
    messageLabel: "Μήνυμα",
    footer: "Το μήνυμα εστάλη από τη φόρμα επικοινωνίας της Motify.",
    replyTitle: "Ευχαριστούμε για το μήνυμά σας!",
    replyIntro:
      "Λάβαμε το αίτημά σας και θα επικοινωνήσουμε μαζί σας μέσα σε 24 ώρες.",
    replySummary: "Η υποβολή σας",
  },
};

const resolveCopy = (locale?: "el" | "en") =>
  emailCopy[locale === "el" ? "el" : "en"];

export const buildContactEmailHtml = (props: ContactTemplateProps) => {
  const copy = resolveCopy(props.locale);
  const name = escapeHtml(props.name);
  const email = escapeHtml(props.email);
  const company = props.company ? escapeHtml(props.company) : "—";
  const projectType = props.projectType ? escapeHtml(props.projectType) : "—";
  const message = escapeHtml(props.message).replace(/\n/g, "<br />");
  const source = props.source ? escapeHtml(props.source) : "Website";
  const logoHtml = buildLogoHtml(props.logoUrl);

  return `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background:#f7f7f8; padding:24px;">
      <div style="max-width:640px; margin:0 auto; background:#ffffff; border-radius:16px; border:1px solid #e8e9ec; overflow:hidden;">
        <div style="padding:24px 28px; background:linear-gradient(135deg,#0ea5a4,#22d3ee); color:#ffffff;">
          <div style="margin-bottom:12px;">${logoHtml}</div>
          <h1 style="margin:0; font-size:22px; font-weight:600;">${copy.inquiryTitle}</h1>
          <p style="margin:8px 0 0; font-size:14px; opacity:0.9;">${copy.sourceLabel}: ${source}</p>
        </div>
        <div style="padding:24px 28px;">
          <table style="width:100%; border-collapse:collapse; font-size:14px;">
            <tr>
              <td style="padding:8px 0; color:#6b7280; width:140px;">${copy.nameLabel}</td>
              <td style="padding:8px 0; color:#111827; font-weight:600;">${name}</td>
            </tr>
            <tr>
              <td style="padding:8px 0; color:#6b7280;">${copy.emailLabel}</td>
              <td style="padding:8px 0; color:#111827;">${email}</td>
            </tr>
            <tr>
              <td style="padding:8px 0; color:#6b7280;">${copy.companyLabel}</td>
              <td style="padding:8px 0; color:#111827;">${company}</td>
            </tr>
            <tr>
              <td style="padding:8px 0; color:#6b7280;">${copy.projectTypeLabel}</td>
              <td style="padding:8px 0; color:#111827;">${projectType}</td>
            </tr>
          </table>
          <div style="margin-top:20px; padding:16px; border-radius:12px; background:#f9fafb; border:1px solid #eef0f4;">
            <div style="font-size:12px; text-transform:uppercase; letter-spacing:0.08em; color:#9ca3af; margin-bottom:8px;">${copy.messageLabel}</div>
            <div style="font-size:15px; color:#111827; line-height:1.5;">${message}</div>
          </div>
          <div style="margin-top:20px; padding-top:16px; border-top:1px solid #eef0f4; font-size:12px; color:#9ca3af;">
            ${copy.footer}
          </div>
        </div>
      </div>
    </div>
  `;
};

export const buildContactEmailText = (props: ContactTemplateProps) => {
  const copy = resolveCopy(props.locale);
  const lines = [
    copy.inquiryTitle,
    `${copy.sourceLabel}: ${props.source ?? "Website"}`,
    "",
    `${copy.nameLabel}: ${props.name}`,
    `${copy.emailLabel}: ${props.email}`,
    `${copy.companyLabel}: ${props.company || "—"}`,
    `${copy.projectTypeLabel}: ${props.projectType || "—"}`,
    "",
    `${copy.messageLabel}:`,
    props.message,
  ];
  return lines.join("\n");
};

export const buildContactReplyHtml = (props: ContactTemplateProps) => {
  const copy = resolveCopy(props.locale);
  const name = escapeHtml(props.name);
  const email = escapeHtml(props.email);
  const company = props.company ? escapeHtml(props.company) : "—";
  const projectType = props.projectType ? escapeHtml(props.projectType) : "—";
  const message = escapeHtml(props.message).replace(/\n/g, "<br />");
  const logoHtml = buildLogoHtml(props.logoUrl);

  return `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background:#f7f7f8; padding:24px;">
      <div style="max-width:640px; margin:0 auto; background:#ffffff; border-radius:16px; border:1px solid #e8e9ec; overflow:hidden;">
        <div style="padding:24px 28px; background:linear-gradient(135deg,#0ea5a4,#22d3ee); color:#ffffff;">
          <div style="margin-bottom:12px;">${logoHtml}</div>
          <h1 style="margin:0; font-size:22px; font-weight:600;">${copy.replyTitle}</h1>
        </div>
        <div style="padding:24px 28px;">
          <p style="margin:0 0 16px; font-size:15px; color:#111827;">${copy.replyIntro}</p>
          <div style="margin-top:16px; padding:16px; border-radius:12px; background:#f9fafb; border:1px solid #eef0f4;">
            <div style="font-size:12px; text-transform:uppercase; letter-spacing:0.08em; color:#9ca3af; margin-bottom:8px;">${copy.replySummary}</div>
            <table style="width:100%; border-collapse:collapse; font-size:14px;">
              <tr>
                <td style="padding:6px 0; color:#6b7280; width:140px;">${copy.nameLabel}</td>
                <td style="padding:6px 0; color:#111827;">${name}</td>
              </tr>
              <tr>
                <td style="padding:6px 0; color:#6b7280;">${copy.emailLabel}</td>
                <td style="padding:6px 0; color:#111827;">${email}</td>
              </tr>
              <tr>
                <td style="padding:6px 0; color:#6b7280;">${copy.companyLabel}</td>
                <td style="padding:6px 0; color:#111827;">${company}</td>
              </tr>
              <tr>
                <td style="padding:6px 0; color:#6b7280;">${copy.projectTypeLabel}</td>
                <td style="padding:6px 0; color:#111827;">${projectType}</td>
              </tr>
            </table>
            <div style="margin-top:12px; font-size:14px; color:#111827; line-height:1.5;">${message}</div>
          </div>
          <div style="margin-top:20px; padding-top:16px; border-top:1px solid #eef0f4; font-size:12px; color:#9ca3af;">
            ${copy.footer}
          </div>
        </div>
      </div>
    </div>
  `;
};

export const buildContactReplyText = (props: ContactTemplateProps) => {
  const copy = resolveCopy(props.locale);
  const lines = [
    copy.replyTitle,
    copy.replyIntro,
    "",
    `${copy.nameLabel}: ${props.name}`,
    `${copy.emailLabel}: ${props.email}`,
    `${copy.companyLabel}: ${props.company || "—"}`,
    `${copy.projectTypeLabel}: ${props.projectType || "—"}`,
    "",
    `${copy.messageLabel}:`,
    props.message,
  ];
  return lines.join("\n");
};
