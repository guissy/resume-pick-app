import '../utils/mockElectron';
import fs from 'fs';
import exportExcel from '../../../app/features/parser/exportExcel';
import configDefault from '../../../app/constants/configDefault.json';
import mockScoreFile from '../utils/mockScoreFile';
import { Config, ScoreFile } from '../../../app/features/type';

describe('exportExcel', () => {
  const filePath = './test/test.xlsx';
  afterAll(() => {
    fs.unlinkSync(filePath);
  });
  it('should exist file', async () => {
    expect(fs.existsSync(filePath)).toBeFalsy();
    await exportExcel(
      (configDefault as unknown) as Config,
      (mockScoreFile as unknown) as ScoreFile[]
    );
    expect(fs.existsSync(filePath)).toBeTruthy();
  });
});
