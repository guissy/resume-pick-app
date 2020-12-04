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
} from '../type';
import {
  calcLevelSalaryRate,
  calcSentiment,
  trackDegree,
  trackLinks,
  trackPhone,
  trackSalary,
  trackSchool,
} from './tractWorkAge';

const cache = new Map<
  string,
  {
    text: string;
    workAge: number;
    phone: string;
    keywords: KeywordUtil;
    links: string[];
    sentiment: number;
  }
>();

export function parseResumeText(
  path: string,
  config: Config,
  search: string,
  callback: ParseResumeFn,
  text: string
) {
  const phone = trackPhone(text);
  const links = trackLinks(text);
  const school = trackSchool(text);
  const degree = trackDegree(text);
  const salary = trackSalary(text);
  const configPure = config.filter((v) => v.name !== 'search');
  const searchs = search
    .trim()
    .split(' ')
    .map((n) => ({
      name: n,
      score: 2,
      alias: [],
      works: [],
      gained: 0,
      children: [],
    }));
  const configOk = search?.trim()
    ? [
        ...configPure,
        {
          name: 'search',
          children: searchs,
          score: 2,
          gained: 0,
          alias: [],
          works: [],
        } as Keyword,
      ]
    : configPure;
  const sentiment = calcSentiment(text, configOk);
  if (text && text.length > 0) {
    const {
      score,
      workAge,
      level,
      levelValue,
      keywords: kw,
    } = timeContent.calcTotal(text, configOk) as KeywordCalcResult;
    const levelSalary = calcLevelSalaryRate(salary, levelValue);
    const kws = kw.items.map((k: Keyword) => ({
      ...k,
      children: k.children
        .filter((w) => w.gained !== 0)
        .map((w) => ({
          ...w,
          works: w.works.map((x) => ({
            ...x,
            startDate: String(x.startDate),
            endDate: String(x.endDate),
          })),
        })),
    }));
    callback({
      path,
      score,
      keywords: kws,
      text,
      workAge,
      level,
      levelValue,
      levelSalary,
      school,
      degree,
      salary,
      links,
      phone,
      sentiment,
      search,
    });
  } else {
    callback({
      path,
      score: 0,
      keywords: [],
      text,
      workAge: 0,
      level: '-',
      levelValue: 0,
      levelSalary: 0,
      school,
      degree: '',
      salary: '',
      links,
      phone,
      sentiment,
      search,
    });
  }
}

type PdfItem = { page: number; text: string };

export default function parseResume(
  this: unknown,
  path: string,
  config: Config,
  search: string,
  callback: ParseResumeFn
) {
  const kwUtil = cache.get(path);
  if (!kwUtil) {
    if (path.endsWith('.pdf')) {
      fs.readFile(path, (_e, buffer) => {
        pdf(buffer)
          .then((data: PdfItem) => {
            return parseResumeText(path, config, search, callback, data.text);
          })
          .catch(() => {
            parseResumeText(path, config, search, callback, '');
          });
      });
    } else {
      textract.fromFileWithPath(
        path,
        { preserveLineBreaks: true },
        (_err: unknown, docText: string) => {
          parseResumeText(path, config, search, callback, docText);
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
    callback({
      ...kwUtil,
      path,
      score,
      search,
      level: '',
      levelValue: 0,
      levelSalary: 0,
      school: '',
      degree: '',
      salary: '',
      keywords: kws,
    });
  }
}
