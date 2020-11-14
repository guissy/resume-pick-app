import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// import cloc from 'node-cloc';
import path from 'path';
import fs from 'fs';
import execa from 'execa';
import { remote } from 'electron';

export const resourcesPath = remote.app.isPackaged
  ? path.dirname(remote.app.getAppPath())
  : path.resolve('resources');

async function cloc(folder: string) {
  const { stdout, stderr, failed, killed, timedOut } = await execa(
    path.join(resourcesPath, '.bin/cloc'),
    ['--json', folder]
  );
  if (stderr !== '') throw new Error(stderr.trim());
  if (failed !== false) throw new Error('Failure');
  if (killed !== false) throw new Error('Program was killed');
  if (timedOut !== false) throw new Error('Timeout');

  return JSON.parse(stdout);
}

// type GitCommit = { commit: { message: string } };
export default async function parseRepo(
  repoUrl: string,
  dir: string,
  setStatus: (info: string) => void
) {
  setStatus('git clone...');
  await git.clone({
    fs,
    http,
    dir,
    url: repoUrl,
    ref: 'master',
    singleBranch: true,
    depth: 1,
  });
  const commits = await git.log({ fs, dir });
  const logs = commits
    .map((v) => v.commit.message.trim() || '')
    .filter((v) => !v.startsWith('Merge '));
  setStatus(`commits ${commits.length}`);
  const folders = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .filter((dirent) => !dirent.name.startsWith('.'))
    .filter((dirent) =>
      ['src', 'app', 'App', 'front', 'web', 'server', 'client'].includes(
        dirent.name
      )
    )
    .map((dirent) => dirent.name);
  const langCount = await cloc(
    path.join(dir, folders[0] || dir)
  ).catch(() => ({}));
  const fileTypes = Object.keys(langCount)
    .filter(
      (k) => !['JSON', 'Markdown', 'YAML', 'XML', 'SVG', 'header'].includes(k)
    )
    .map((lang) => langCount[lang])
    .filter(Boolean)
    .filter((v) => v.code > 50);
  const nFiles = fileTypes.map((v) => v.nFiles).reduce((s, v) => s + v, 0);
  const nComment = fileTypes.map((v) => v.comment).reduce((s, v) => s + v, 0);
  const nCode = fileTypes.map((v) => v.code).reduce((s, v) => s + v, 0);
  const commentRate = nComment / nCode;
  const linesInFile = Math.round(nCode / nFiles); // 行数/文件
  const linesInCommit = Math.round(nCode / logs.length); // 行数/提交
  setStatus(`commentRate ${(commentRate * 100).toFixed(2)}`);
  setStatus(`linesInFile ${linesInFile}`);
  setStatus(`linesInCommit ${linesInCommit}`);
  return {
    commits,
    commentRate,
    linesInFile,
    linesInCommit,
    fileTypes,
  };
}
