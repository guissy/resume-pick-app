import mockScoreFile from '../utils/mockScoreFile';
import configDefault from '../../../app/constants/configDefault.json';
import trackWorkAge, {
  calcSentiment,
  getBlogByLink,
  getScoreMap,
  trackDegree,
  trackLinks,
  trackPhone,
  trackSalary,
  trackSchool,
} from '../../../app/features/parser/tractWorkAge';
import { Keyword } from '../../../app/features/type';

describe('trackWorkAge', () => {
  it('trackWorkAge', () => {
    expect(trackWorkAge('工作经验 7年')).toBe(7);
    expect(trackWorkAge('10年经验')).toBe(10);
  });
  it('trackPhone', () => {
    expect(trackPhone(`电话 1351234567890 `)).toBe('');
    expect(trackPhone(`电话 135-1234-5678 `)).toBe('13512345678');
    expect(trackPhone(`电话 135 1234 5678 `)).toBe('13512345678');
    Array(1000).forEach(() => {
      const p = (1e10 + 1e10 * Math.random()).toFixed(0);
      expect(trackPhone(`电话 ${p.toString()}`)).toBe(p.toString());
    });
  });
  it('trackSchool', () => {
    expect(trackSchool('负责华为大学业务')).toBeFalsy();
    expect(trackSchool('马云的湖畔学院')).toBeFalsy();
    expect(trackSchool('学院 深圳大学 2020')).toBe('深圳大学');
  });
  it('trackDegree', () => {
    expect(trackDegree('学历 ：博士')).toBe('博士');
    expect(trackDegree('学历 ：大专')).toBe('大专');
  });
  it('trackSalary', () => {
    expect(trackSalary('期望13-15k')).toBe('13-15k');
    expect(trackSalary('期望14K~22k')).toBe('14K~22k');
  });
  it('trackLinks', () => {
    expect(trackLinks('点击这里https://www.baidu.com/?q=3')[0]).toBe(
      'https://www.baidu.com/?q=3'
    );
  });
  it('getScoreMap', () => {
    expect(getScoreMap(mockScoreFile[0].keywords as Keyword[])).toMatchObject({
      vue: 1,
    });
    expect(getScoreMap(mockScoreFile[1].keywords as Keyword[])).toMatchObject({
      react: 1,
    });
  });
  it('calcSentiment', () => {
    expect(
      calcSentiment(mockScoreFile[0].text, configDefault as Keyword[])
    ).toBeGreaterThan(0);
  });
  it('getBlogByLink', () => {
    expect(getBlogByLink('https://github.com/guissy/cc')).toBe('github');
    expect(
      getBlogByLink('https://jiayili.gitbooks.io/fe-study-easier/content/')
    ).toBe('gitbooks');
    expect(getBlogByLink('https://blog.51cto.com/12131824')).toBe('51cto');
    expect(getBlogByLink('https://my.oschina.net/u/267941')).toBe('oschina');
    expect(getBlogByLink('https://www.imooc.com/u/1215284')).toBe('imooc');
    expect(getBlogByLink('https://segmentfault.com/u/jmxiao')).toBe(
      'segmentfault'
    );
    expect(getBlogByLink('https://www.jianshu.com/u/c7757daadf27')).toBe(
      'jianshu'
    );
    expect(getBlogByLink('https://www.zhihu.com/people/gui-zi-29/posts')).toBe(
      'zhihu'
    );
    expect(getBlogByLink('https://zhuanlan.zhihu.com/269840126')).toBe('zhihu');
    expect(getBlogByLink('https://blog.csdn.net/weixin_42134789')).toBe('csdn');
    expect(getBlogByLink('https://www.cnblogs.com/jiujuan/')).toBe('cnblogs');
    expect(getBlogByLink('https://juejin.im/user/3403743728515246/')).toBe(
      'juejin'
    );
  });
});
