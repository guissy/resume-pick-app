import fs from 'fs';
import parseResume, {
  parseResumeText,
} from '../../../app/features/parser/parseResume';
import configDefault from '../../../app/constants/configDefault.json';
import { Config } from '../../../app/features/type';

const resumeText = '15K-20K 2019-08 ~ 2020-08 react';
describe('parseResume', () => {
  it('parseResumeText', () => {
    parseResumeText(
      'file.txt',
      (configDefault as unknown) as Config,
      '',
      ({
        score,
        workAge,
        sentiment,
        keywords,
        level,
        levelValue,
        levelSalary,
      }) => {
        expect(score).toBeGreaterThan(0);
        expect(workAge).toBeGreaterThan(0);
        expect(sentiment).toBeGreaterThan(0);
        expect(levelSalary).toBeGreaterThan(0);
        expect(levelValue).toBeGreaterThan(0);
        expect(/p\d+(\+){0,2}/.test(level)).toBeTruthy();
        expect(keywords).toMatchSnapshot();
      },
      resumeText
    );
  });
  it('parseResume', () => {
    const file = 'file.txt';
    fs.writeFileSync(file, resumeText);
    parseResume(
      file,
      (configDefault as unknown) as Config,
      '',
      ({
        score,
        workAge,
        sentiment,
        keywords,
        level,
        levelValue,
        levelSalary,
      }) => {
        expect(score).toBeGreaterThan(0);
        expect(workAge).toBeGreaterThan(0);
        expect(sentiment).toBeGreaterThan(0);
        expect(levelSalary).toBeGreaterThan(0);
        expect(levelValue).toBeGreaterThan(0);
        expect(/p\d+(\+){0,2}/.test(level)).toBeTruthy();
        expect(keywords).toMatchSnapshot();
      }
    );
  });
});
