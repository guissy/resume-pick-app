import * as Electron from 'electron';

export type DocFile = { name: string; path: string };
export type Keyword = {
  name: number;
  score: number;
  children: Keyword[];
  gained: number;
};
export type ScoreFile = DocFile & { score: number; keywords: Keyword[] };
export type ParseResumeFn = (
  p: string,
  score: number,
  keywords: Keyword[]
) => void;
export type MyApp = Electron.App & {
  parseResume: (path: string, fn: ParseResumeFn) => void;
};
