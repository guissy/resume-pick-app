import Sentiment from 'sentiment';
import { Config } from '../type';

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
      /(https?:\/\/)?([@a-z0-9.-]+)\.(com|cn|io|org|net|cc|info|biz|co|ai)\b\/?(?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)*/g
    ) || [];
  return Array.from(
    new Set(urls.filter((url) => !url.includes('@')))
  ).map((url) => (url.endsWith('/') ? url.slice(0, url.length - 1) : url));
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
  const textOk = (text || '').replace(/(\b[\w-]+\b)/g, ' $1 ');
  const result = sentiment.analyze(textOk, { extras: getScoreMap(config) });
  return result.comparative;
}

export function getBlogByLink(link: string) {
  // https://juejin.im/user/3403743728515246/
  // https://www.cnblogs.com/jiujuan/
  // https://blog.csdn.net/weixin_42134789
  // https://zhuanlan.zhihu.com/269840126
  // https://www.zhihu.com/people/gui-zi-29/posts
  // https://www.jianshu.com/u/c7757daadf27
  // https://segmentfault.com/u/jmxiao
  // https://my.oschina.net/u/267941
  // https://www.imooc.com/u/1215284
  // https://blog.51cto.com/12131824
  // https://cloud.tencent.com/developer/user/1307425
  // https://yq.aliyun.com/users/mgzlkjdaehkdc
  // https://jiayili.gitbooks.io/fe-study-easier/content/
  // https://github.com/guissy?tab=repositories
  // https://github.com/guissy/cc
  const csdn = /blog\.csdn\.net\/[A-z0-9_-]+/;
  const cnblogs = /www\.cnblogs\.com\/[A-z0-9_-]+/;
  const juejin = /juejin\.im\/user\/[A-z0-9_-]+/;
  const zhihuUser = /www\.zhihu\.com\/people\/[A-z0-9_-]+/;
  const zhihuZhuan = /zhuanlan\.zhihu\.com\/[A-z0-9_-]+/;
  const jianshu = /www\.jianshu\.com\/u\/[A-z0-9_-]+/;
  const segmentfault = /segmentfault\.com\/u\/[A-z0-9_-]+/;
  const oschina = /my\.oschina\.net\/u\/[A-z0-9_-]+/;
  const imooc = /www\.imooc\.com\/u\/[A-z0-9_-]+/;
  const cto = /blog\.51cto\.com\/[A-z0-9_-]+/;
  const tencent = /cloud\.tencent\.com\/developer\/user\/[A-z0-9_-]+/;
  const aliyun = /yq\.aliyun\.com\/users\/[A-z0-9_-]+/;
  const gitbooks = /jiayili\.gitbooks\.io\/[A-z0-9_-]+/;
  const github = /github\.com\/[A-z0-9_-]+/;
  const gitee = /gitee\.com\/[A-z0-9_-]+/;
  const n = [
    csdn,
    cnblogs,
    juejin,
    zhihuUser,
    zhihuZhuan,
    jianshu,
    segmentfault,
    oschina,
    imooc,
    cto,
    tencent,
    aliyun,
    gitbooks,
    github,
    gitee,
  ].findIndex((regexp) => regexp.test(link));
  const names = 'csdn,cnblogs,juejin,zhihu,zhihu,jianshu,segmentfault,oschina,imooc,51cto,tencent,aliyun,gitbooks,github,gitee'.split(
    ','
  );
  return n >= 0 ? names[n] : '';
}

export function getGithubByLink(links: string[]) {
  const github = /(github|giteeee)\.com\/[A-z0-9_-]+/g;
  return Array.from(
    new Set(
      links
        .map((link) => link.match(github)?.[0] || '')
        .filter(Boolean)
        .map((link) => `https://${link}`)
    )
  );
}
