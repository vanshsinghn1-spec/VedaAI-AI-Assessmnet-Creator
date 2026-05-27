import { IAssignment } from '../models/Assignment';

/**
 * Generates an HTML string for the question paper that can be rendered as PDF
 */
export function generatePaperHTML(assignment: IAssignment): string {
  const paper = assignment.generatedPaper;
  if (!paper) throw new Error('No generated paper found');

  const sectionsHTML = paper.sections
    .map(
      (section) => `
      <div class="section">
        <h2 class="section-title">${section.title}</h2>
        <p class="section-instruction"><strong>${section.instruction}</strong></p>
        <div class="questions">
          ${section.questions
            .map(
              (q) => `
            <div class="question">
              <div class="question-row">
                <span class="question-number">${q.number}.</span>
                <span class="question-badge badge-${q.difficulty.toLowerCase()}">[${q.difficulty}]</span>
                <span class="question-text">${q.text}</span>
                <span class="question-marks">[${q.marks} Marks]</span>
              </div>
              ${
                q.options && q.options.length > 0
                  ? `<div class="options">
                    ${q.options
                      .map(
                        (opt, i) =>
                          `<div class="option">${String.fromCharCode(97 + i)}) ${opt}</div>`
                      )
                      .join('')}
                  </div>`
                  : ''
              }
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `
    )
    .join('');

  const answerKeyHTML = paper.answerKey
    .map(
      (ak) => `
    <div class="answer-item">
      <strong>${ak.number}.</strong> ${ak.answer}
    </div>
  `
    )
    .join('');

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        font-family: 'Times New Roman', Times, serif;
        font-size: 14px;
        line-height: 1.6;
        color: #000;
        padding: 40px 50px;
        max-width: 800px;
        margin: 0 auto;
      }
      .header {
        text-align: center;
        margin-bottom: 24px;
        border-bottom: 2px solid #000;
        padding-bottom: 16px;
      }
      .header h1 {
        font-size: 22px;
        font-weight: bold;
        margin-bottom: 4px;
      }
      .header .subject {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 2px;
      }
      .header .class-info {
        font-size: 14px;
        font-weight: bold;
      }
      .meta-row {
        display: flex;
        justify-content: space-between;
        margin: 16px 0;
        font-size: 14px;
      }
      .instructions {
        margin: 12px 0;
        font-style: italic;
        font-size: 13px;
      }
      .student-info {
        margin: 20px 0;
        font-size: 14px;
      }
      .student-info p {
        margin-bottom: 8px;
      }
      .student-info .line {
        display: inline-block;
        width: 200px;
        border-bottom: 1px solid #000;
        margin-left: 8px;
      }
      .section {
        margin-top: 28px;
      }
      .section-title {
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 8px;
      }
      .section-instruction {
        font-size: 13px;
        font-style: italic;
        margin-bottom: 16px;
      }
      .question {
        margin-bottom: 12px;
        page-break-inside: avoid;
      }
      .question-row {
        display: flex;
        align-items: flex-start;
        gap: 6px;
      }
      .question-number {
        font-weight: bold;
        min-width: 24px;
      }
      .question-badge {
        font-size: 11px;
        font-weight: bold;
        padding: 1px 6px;
        border-radius: 3px;
        white-space: nowrap;
      }
      .badge-easy { color: #2e7d32; }
      .badge-moderate { color: #e65100; }
      .badge-hard { color: #c62828; }
      .question-text { flex: 1; }
      .question-marks {
        white-space: nowrap;
        font-weight: bold;
        color: #333;
      }
      .options {
        margin: 8px 0 8px 40px;
      }
      .option { margin-bottom: 4px; }
      .end-marker {
        text-align: center;
        font-weight: bold;
        color: #c62828;
        margin-top: 24px;
        font-size: 14px;
      }
      .answer-key {
        margin-top: 40px;
        border-top: 2px solid #000;
        padding-top: 16px;
      }
      .answer-key h2 {
        font-size: 18px;
        margin-bottom: 16px;
      }
      .answer-item {
        margin-bottom: 10px;
        font-size: 13px;
        line-height: 1.5;
      }
      @media print {
        body { padding: 20px; }
        .answer-key { page-break-before: always; }
      }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>${assignment.schoolName}</h1>
      <div class="subject">Subject: ${assignment.subject}</div>
      <div class="class-info">Class: ${assignment.className}</div>
    </div>

    <div class="meta-row">
      <span><strong>Time Allowed:</strong> ${assignment.timeAllowed}</span>
      <span><strong>Maximum Marks:</strong> ${assignment.maximumMarks}</span>
    </div>

    <div class="instructions">
      All questions are compulsory unless stated otherwise.
    </div>

    <div class="student-info">
      <p>Name: <span class="line"></span></p>
      <p>Roll Number: <span class="line"></span></p>
      <p>Class: ${assignment.className} Section: <span class="line" style="width:80px"></span></p>
    </div>

    ${sectionsHTML}

    <div class="end-marker">End of Question Paper</div>

    <div class="answer-key">
      <h2>Answer Key:</h2>
      ${answerKeyHTML}
    </div>
  </body>
  </html>
  `;
}

/**
 * Generate PDF buffer using puppeteer
 */
export async function generatePDF(assignment: IAssignment): Promise<Buffer> {
  // Dynamic import puppeteer to avoid issues if not installed
  const puppeteer = await import('puppeteer');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    const html = generatePaperHTML(assignment);
    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}
