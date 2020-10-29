// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as timeContent from 'resume-pick/lib/time-content';
import fs from 'fs';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import pdf from 'pdf-parse/lib/pdf-parse';
import textract from 'textract';
import { Config, Keyword, ParseResumeFn } from './type';
import trackWorkAge, { trackPhone } from './tractWorkAge';

function parseResumeText(
  path: string,
  config: Config,
  callback: ParseResumeFn,
  text: string
) {
  const phone = trackPhone(text);
  const workAge = trackWorkAge(text);
  if (text && text.length > 0) {
    const { score, keywords: kw } = timeContent.calcTotal(text, config);
    const kws = kw.items.map((k: Keyword) => ({
      ...k,
      children: k.children.filter((w) => w.gained !== 0),
    }));
    callback({ path, score, keywords: kws, text, workAge, phone });
  } else {
    callback({ path, score: 0, keywords: [], text, workAge, phone });
  }
}

type PdfItem = { page: number; text: string };

export default function parseResume(
  this: unknown,
  path: string,
  config: Config,
  callback: ParseResumeFn
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
    textract.fromFileWithPath(
      path,
      { preserveLineBreaks: true },
      (_err: unknown, docText: string) => {
        parseResumeText(path, config, callback, docText);
      }
    );
  }
}
