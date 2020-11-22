import * as Electron from 'electron';

export type DocFile = { name: string; path: string };
export type WorkDate = {
  startDate: string;
  endDate: string;
  workContent: string;
};
export type Keyword = {
  name: string;
  score: number;
  alias: string[] | string | undefined;
  children: Keyword[];
  works: WorkDate[];
  gained: number;
};
export type ScoreFile = DocFile & {
  score: number;
  keywords: Keyword[];
  text: string;
  phone: string;
  workAge: number;
  level: string;
  levelValue: number;
  school: string;
  degree: string;
  salary: string;
  sentiment: number;
  links: string[];
};
export type ParsedResume = {
  path: string;
  score: number;
  workAge: number;
  level: string;
  levelValue: number;
  school: string;
  degree: string;
  salary: string;
  phone: string;
  keywords: Keyword[];
  text: string;
  links: string[];
  sentiment: number;
  search: string;
};
export type ParseResumeFn = (resume: ParsedResume) => void;
export type MyApp = Electron.App & {
  parseResume: (
    path: string,
    config: Config,
    search: string,
    // level: number,
    fn: ParseResumeFn
  ) => void;
  parseResumeText: (
    path: string,
    config: Config,
    search: string,
    // level: number,
    callback: ParseResumeFn,
    text: string
  ) => void;
};

export type Config = Keyword[];
export type ConfigFile = Record<string, Config>;
export type KeywordUtil = {
  calc: (items: Keyword[]) => number;
  walk: (items: Keyword[]) => void;
  items: Keyword[];
  walked: Keyword[];
};
export type KeywordCalcResult = {
  score: number;
  level: string;
  levelValue: number;
  workAge: number;
  keywords: KeywordUtil;
};
export type GhOpt = {
  repos: number | string;
  contrib: number | string;
  followers: number | string;
  calendar: string;
};
export type HTMLWebview = HTMLWebViewElement & {
  executeJavaScript: (
    js: string,
    b: false,
    fn?: (opt: unknown) => void
  ) => Promise<string>;
};

export type SortKey =
  | ''
  | 'workAgeUp'
  | 'workAgeDown'
  | 'scoreUp'
  | 'scoreDown'
  | 'sentimentUp'
  | 'sentimentDown';
