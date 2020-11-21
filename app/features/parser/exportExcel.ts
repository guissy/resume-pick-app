import fs from 'fs';
import ExcelJS, { Column } from 'exceljs';
import { remote } from 'electron';
import dayjs from 'dayjs';
import { Config, ScoreFile } from '../type';

export default async function exportExcel(config: Config, scores: ScoreFile[]) {
  const conf = {
    cols: [
      ['文件', 42],
      ['电话', 20],
      ['经验', 10],
      ['分数', 10],
      ['评级', 10],
      ...config[0].children.map((w) => [
        w.name,
        Math.max(w.name.length * 1.6, 10),
      ]),
      ['文件路径', 62],
    ],
    rows: scores.map((s) => [
      s.name,
      s.phone,
      s.workAge,
      s.level,
      parseFloat(s.score.toFixed(1)),
      ...config[0].children.map((w) => {
        const found = s.keywords[0].children.find((w2) => w.name === w2.name);
        return found ? parseFloat(found.gained.toFixed(1)) : 0;
      }),
      s.path,
    ]),
  };
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Resume Pick');
  worksheet.columns = conf.cols.map(
    ([header, width]) => ({ header, width } as Column)
  );
  worksheet.addRows(conf.rows);
  const row = worksheet.getRow(1);
  row.eachCell((cell) => {
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.font = { name: 'Arial Black', bold: true, size: 14 };
  });
  conf.cols.forEach((_r, i) => {
    const col = worksheet.getColumn(i + 1);
    col.eachCell({ includeEmpty: true }, (cell) => {
      cell.font = { name: 'Arial', size: 14 };
    });
  });
  conf.rows
    .map((_r, i) => 'ABC'.split('').map((c) => `${c}${i + 2}`))
    .flat()
    .forEach((pos) => {
      const cell = worksheet.getCell(pos);
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.font = { name: 'Arial', size: 14 };
    });
  const day = dayjs().format('YYYY-MM-DD');
  const filePath = await remote.dialog
    .showSaveDialog({
      defaultPath: `简历评估 ${day}.xlsx`,
      filters: [{ name: 'xls Files', extensions: ['xlsx'] }],
      properties: [],
    })
    .then((file) => {
      if (!file.canceled && file.filePath) {
        return file.filePath.toString();
      }
      return '';
    })
    .catch(() => {
      // console.log(err);
    });
  if (filePath) {
    workbook.xlsx
      .writeBuffer()
      .then((buf) => {
        return fs.writeFileSync(filePath, buf, 'binary');
      })
      .catch(() => {
        // console.log(err);
      });
  }
}
