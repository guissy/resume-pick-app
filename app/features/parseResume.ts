import * as timeContent from 'resume-pick/lib/time-content';
import PDFParser from 'pdf2json';
import textract from 'textract';
import { Keyword } from './type';

export default function parseResume(
  path: string,
  callback: (path: string, score: number, keywords: Keyword[]) => void
) {
  if (path.endsWith('.pdf')) {
    const pdfParser = new PDFParser(this, 1);
    pdfParser.loadPDF(path);
    pdfParser.on('pdfParser_dataReady', () => {
      const data = pdfParser.getRawTextContent();
      if (data && data.length > 0) {
        const { score, keywords: kw } = timeContent.calcTotal(data);
        callback(path, score, kw.items);
      } else {
        callback(path, 0, []);
      }
    });
  } else {
    textract.fromFileWithPath(path, (_err: unknown, data: string) => {
      if (data && data.length > 0) {
        const { score, keywords: kw } = timeContent.calcTotal(data);
        callback(path, score, kw.items);
      } else {
        callback(path, 0, []);
      }
    });
  }
}
