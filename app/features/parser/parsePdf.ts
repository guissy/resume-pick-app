import { PDFPageProxy } from 'pdfjs-dist';

const pdfjs = require('pdfjs-dist');

pdfjs.GlobalWorkerOptions.workerSrc =
  'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.5.207/build/pdf.worker.min.js';

function renderPage(pageData: PDFPageProxy) {
  return pageData.getTextContent().then((textContent) => {
    let lastY = -1;
    let text = '';
    // eslint-disable-next-line no-restricted-syntax
    for (const item of textContent.items) {
      if (lastY === item.transform[5] || !lastY) {
        text += item.str;
      } else {
        text += `\n${item.str}`;
      }
      // eslint-disable-next-line prefer-destructuring
      lastY = item.transform[5];
    }
    return text;
  });
}

export default async function parsePdf(url: string) {
  const pdf = await pdfjs.getDocument(url).promise;
  const texts = await Promise.allSettled(
    Array(pdf.numPages)
      .fill(0)
      .map((_v, i) => pdf.getPage(i + 1).then(renderPage))
  );
  return texts
    .map((v) => ((v as unknown) as { value: string }).value || '')
    .join('\n\n');
}
