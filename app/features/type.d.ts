import * as Electron from 'electron';

export type DocFile = { name: string; path: string };
export type Keyword = {
  name: string;
  score: number;
  children: Keyword[];
  gained: number;
};
export type ScoreFile = DocFile & {
  score: number;
  keywords: Keyword[];
  text: string;
  phone: string;
  workAge: string;
};
export type ParsedResume = {
  path: string;
  score: number;
  workAge: string;
  phone: string;
  keywords: Keyword[];
  text: string;
};
export type ParseResumeFn = (resume: ParsedResume) => void;
export type MyApp = Electron.App & {
  parseResume: (path: string, config: Config, fn: ParseResumeFn) => void;
};

export type Config = Keyword[];
export type ConfigFile = Record<string, Config>;
