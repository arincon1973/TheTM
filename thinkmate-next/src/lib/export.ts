/**
 * Export Utilities
 * Functions to export notes to various formats
 */

import jsPDF from 'jspdf';
import TurndownService from 'turndown';

/**
 * Export note to PDF
 */
export async function exportToPDF(note: {
  title: string;
  content: string;
  isRichText?: boolean;
  createdAt?: Date;
}) {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Add title
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  const titleLines = pdf.splitTextToSize(note.title, maxWidth);
  pdf.text(titleLines, margin, yPosition);
  yPosition += titleLines.length * 10;

  // Add metadata
  if (note.createdAt) {
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100);
    pdf.text(`Created: ${new Date(note.createdAt).toLocaleDateString()}`, margin, yPosition);
    yPosition += 10;
  }

  yPosition += 5;

  // Add content
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0);
  
  // Strip HTML if rich text
  let textContent = note.content;
  if (note.isRichText) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = note.content;
    textContent = tempDiv.textContent || tempDiv.innerText || '';
  }

  const contentLines = pdf.splitTextToSize(textContent, maxWidth);
  
  contentLines.forEach((line: string) => {
    if (yPosition > pdf.internal.pageSize.getHeight() - margin) {
      pdf.addPage();
      yPosition = margin;
    }
    pdf.text(line, margin, yPosition);
    yPosition += 7;
  });

  // Save PDF
  pdf.save(`${note.title.replace(/[^a-z0-9]/gi, '_')}.pdf`);
}

/**
 * Export note to Markdown
 */
export function exportToMarkdown(note: {
  title: string;
  content: string;
  isRichText?: boolean;
  tags?: string[];
  createdAt?: Date;
}) {
  let markdown = `# ${note.title}\n\n`;

  if (note.createdAt) {
    markdown += `*Created: ${new Date(note.createdAt).toLocaleDateString()}*\n\n`;
  }

  if (note.tags && note.tags.length > 0) {
    markdown += `**Tags:** ${note.tags.map((t) => `#${t}`).join(', ')}\n\n`;
  }

  markdown += '---\n\n';

  if (note.isRichText) {
    // Convert HTML to Markdown
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
    });
    markdown += turndownService.turndown(note.content);
  } else {
    markdown += note.content;
  }

  // Download
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${note.title.replace(/[^a-z0-9]/gi, '_')}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export note to HTML
 */
export function exportToHTML(note: {
  title: string;
  content: string;
  isRichText?: boolean;
  createdAt?: Date;
}) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${note.title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      line-height: 1.6;
      color: #333;
    }
    h1 {
      color: #16a34a;
      border-bottom: 2px solid #16a34a;
      padding-bottom: 10px;
    }
    .metadata {
      color: #666;
      font-size: 14px;
      margin-bottom: 20px;
    }
    pre {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
    }
    code {
      background: #f5f5f5;
      padding: 2px 6px;
      border-radius: 3px;
    }
  </style>
</head>
<body>
  <h1>${note.title}</h1>
  ${note.createdAt ? `<div class="metadata">Created: ${new Date(note.createdAt).toLocaleDateString()}</div>` : ''}
  <div class="content">
    ${note.isRichText ? note.content : `<pre>${note.content}</pre>`}
  </div>
</body>
</html>`;

  // Download
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${note.title.replace(/[^a-z0-9]/gi, '_')}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export note to plain text
 */
export function exportToText(note: {
  title: string;
  content: string;
  isRichText?: boolean;
}) {
  let text = `${note.title}\n${'='.repeat(note.title.length)}\n\n`;

  if (note.isRichText) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = note.content;
    text += tempDiv.textContent || tempDiv.innerText || '';
  } else {
    text += note.content;
  }

  // Download
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${note.title.replace(/[^a-z0-9]/gi, '_')}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export note to JSON
 */
export function exportToJSON(note: any) {
  const json = JSON.stringify(note, null, 2);

  // Download
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${note.title.replace(/[^a-z0-9]/gi, '_')}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
