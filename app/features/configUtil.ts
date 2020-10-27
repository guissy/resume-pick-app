// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import storage from 'electron-storage';
import configDefault from './configDefault.json';
import { Config } from './type';

function initFile(): Promise<Record<string, Config>> {
  return storage.get('keywords.json').catch((err: unknown) => {
    // eslint-disable-next-line no-console
    console.error(err);
    return storage.set('keywords.json', { default: configDefault });
  });
}

export function initDefaultFile(): Promise<Record<string, Config>> {
  return Promise.resolve({ default: configDefault });
}

export function saveFile(configs: Record<string, Config>) {
  return storage.set('keywords.json', configs).catch((err: unknown) => {
    // eslint-disable-next-line no-console
    console.error(err);
  });
}

export default initFile;
