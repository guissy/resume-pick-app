import mockScoreFile from '../utils/mockScoreFile';
import configDefault from '../../../app/constants/configDefault.json';
import trackWorkAge, {
  calcSentiment,
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
});
