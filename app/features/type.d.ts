import * as Electron from 'electron';
import configDefault from './configDefault.json';

export type DocFile = { name: string; path: string };
export type Keyword = {
  name: number;
  score: number;
  children: Keyword[];
  gained: number;
};
export type ScoreFile = DocFile & {
  score: number;
  keywords: Keyword[];
  text: string;
};
export type ParseResumeFn = (
  p: string,
  score: number,
  keywords: Keyword[],
  text: string
) => void;
export type MyApp = Electron.App & {
  parseResume: (path: string, config: Config, fn: ParseResumeFn) => void;
};

export type Config = typeof configDefault;
export type ConfigFile = Record<string, Config>;
