// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as timeContent from 'resume-pick/lib/time-content';
import fs from 'fs';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import pdf from 'pdf-parse/lib/pdf-parse';
import textract from 'textract';
import { Config, Keyword } from './type';

function parseResumeText(
  path: string,
  config: Config,
  callback: (path: string, score: number, keywords: Keyword[]) => void,
  data: string
) {
  if (data && data.length > 0) {
    const { score, keywords: kw } = timeContent.calcTotal(data, config);
    callback(path, score, kw.items);
  } else {
    callback(path, 0, []);
  }
}

type PdfItem = { page: number; text: string };

export default function parseResume(
  this: unknown,
  path: string,
  config: Config,
  callback: (path: string, score: number, keywords: Keyword[]) => void
) {
  if (path.endsWith('.pdf')) {
    fs.readFile(path, (_e, buffer) => {
      pdf(buffer)
        .then((data: PdfItem) => {
          return parseResumeText(path, config, callback, data.text);
        })
        .catch(() => {
          parseResumeText(path, config, callback, '');
        });
    });
  } else {
    textract.fromFileWithPath(path, (_err: unknown, docText: string) => {
      parseResumeText(path, config, callback, docText);
    });
  }
}
