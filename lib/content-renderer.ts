const inlineBold = (text: string) =>
  text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

const convertMarkdownToHtml = (source: string) => {
  const lines = source.split(/\r?\n/);
  let html = "";
  let inList = false;

  const closeList = () => {
    if (inList) {
      html += "</ul>";
      inList = false;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      closeList();
      continue;
    }

    const heading3 = line.match(/^###\s+(.+)/);
    if (heading3) {
      closeList();
      html += `<h3>${inlineBold(heading3[1])}</h3>`;
      continue;
    }

    const heading2 = line.match(/^##\s+(.+)/);
    if (heading2) {
      closeList();
      html += `<h2>${inlineBold(heading2[1])}</h2>`;
      continue;
    }

    const listItem = line.match(/^(-|–|—)\s+(.+)/);
    if (listItem) {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      html += `<li>${inlineBold(listItem[2])}</li>`;
      continue;
    }

    closeList();
    html += `<p>${inlineBold(line)}</p>`;
  }

  closeList();
  return html;
};

// Render markdown-ish content to HTML. If it is already proper HTML and does not contain markdown
// tokens, return as-is. If HTML wraps markdown (e.g. <p>## Title</p>) we strip tags and render.
export const renderContentToHtml = (content: string): string => {
  if (!content) return "";
  const normalized = content
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>\s*<p>/gi, "\n\n")
    .trim();

  const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(normalized);
  const stripped = normalized.replace(/<\/?[^>]+>/g, "").trim();
  const hasMarkdown =
    /(^|\s)#{1,3}\s/.test(stripped) ||
    /\*\*[^*]+\*\*/.test(stripped) ||
    /(^|\n)[-–—]\s+/.test(stripped);

  if (hasMarkdown) {
    return convertMarkdownToHtml(stripped);
  }

  if (looksLikeHtml) return normalized;

  return convertMarkdownToHtml(normalized);
};
