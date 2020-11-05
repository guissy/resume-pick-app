// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as timeContent from 'resume-pick/lib/time-content';
import fs from 'fs';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import pdf from 'pdf-parse/lib/pdf-parse';
import textract from 'textract';
import {
  Config,
  Keyword,
  KeywordCalcResult,
  KeywordUtil,
  ParseResumeFn,
} from './type';
import trackWorkAge, {
  calcSentiment,
  trackLinks,
  trackPhone,
} from './tractWorkAge';

const cache = new Map<
  string,
  {
    text: string;
    workAge: string;
    phone: string;
    keywords: KeywordUtil;
    links: string[];
    sentiment: number;
  }
>();

function parseResumeText(
  path: string,
  config: Config,
  callback: ParseResumeFn,
  text: string
) {
  const phone = trackPhone(text);
  const workAge = trackWorkAge(text);
  const links = trackLinks(text);
  const sentiment = calcSentiment(text, config);
  if (text && text.length > 0) {
    const { score, keywords: kw } = timeContent.calcTotal(
      text,
      config
    ) as KeywordCalcResult;
    // cache.set(path, { keywords: kw, text, workAge, phone });
    const kws = kw.items.map((k: Keyword) => ({
      ...k,
      children: k.children.filter((w) => w.gained !== 0),
    }));
    callback({
      path,
      score,
      keywords: kws,
      text,
      workAge,
      links,
      phone,
      sentiment,
    });
  } else {
    callback({
      path,
      score: 0,
      keywords: [],
      text,
      workAge,
      links,
      phone,
      sentiment,
    });
  }
}

type PdfItem = { page: number; text: string };

export default function parseResume(
  this: unknown,
  path: string,
  config: Config,
  callback: ParseResumeFn
) {
  const kwUtil = cache.get(path);
  if (!kwUtil) {
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
  } else {
    const scoreMap = new Map<string, number>();
    config.forEach((k) => k.children.map((w) => scoreMap.set(w.name, w.score)));
    // kwUtil.keywords.walk(kwUtil.keywords.items);
    kwUtil.keywords.walked = kwUtil.keywords.walked.map((w) => ({
      ...w,
      score: scoreMap.get(w.name) || 0,
      gained: (w.gained * (scoreMap.get(w.name) || 0)) / w.score,
    }));
    const score = kwUtil.keywords.calc(kwUtil.keywords.items);
    const kws = kwUtil.keywords.items.map((k: Keyword) => ({
      ...k,
      children: k.children.filter((w) => w.gained !== 0),
    }));
    callback({ ...kwUtil, path, score, keywords: kws });
  }
}
