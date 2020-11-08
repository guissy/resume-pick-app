import Sentiment from 'sentiment';
import { Config } from './type';

export default function trackWorkAge(text: string) {
  // 工作年限：3年
  let years = '';
  if (text) {
    const match1 = text.match(
      /(工作)?(年限|经验|开发)[^\d\n]*([\d一二三四五六七八九十]+)\s*年/
    );
    years = match1 ? String(match1.pop()) : '';
  }
  if (!years && text) {
    const match2 = text.match(/([\d一二三四五六七八九十]+)\s*年(工作)?(经验)/);
    years = match2 ? String(match2[1]) : '';
  }
  return years ? `${years}年` : '-';
}

export function trackPhone(text: string) {
  return (text || '').match(/1\d{10}/g)?.[0] || '';
}

export function trackLinks(text: string) {
  const urls =
    (text || '').match(
      /(https?:\/\/)?([@a-z0-9.]+)\.(com|cn|io|org|net|cc|info|biz|co|ai)\b\/?[^\n\s()]*/g
    ) || [];
  return Array.from(new Set(urls.filter((url) => !url.includes('@'))));
}

export function getScoreMap(configs: Config) {
  return configs
    .map((k) =>
      k.children.map((w) => {
        let alias: { name: string; score: number }[] = [];
        if (Array.isArray(w.alias)) {
          alias = w.alias.map((a) => ({ name: a, score: w.score }));
        } else if (typeof w.alias === 'string' && w.alias.length > 0) {
          alias = [{ name: w.alias, score: w.score }];
        }
        return [{ name: w.name, score: w.score }, ...alias];
      })
    )
    .flat(3)
    .reduce((result, it) => ({ ...result, [it.name]: it.score }), {});
}

const sentiment = new Sentiment();
export function calcSentiment(text: string, config: Config) {
  const textOk = text.replace(/(\b[\w-]+\b)/g, ' $1 ');
  const result = sentiment.analyze(textOk, { extras: getScoreMap(config) });
  return result.comparative;
}
