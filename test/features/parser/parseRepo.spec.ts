import '../utils/mockElectron';
import os from 'os';
import path from 'path';
import parseRepo from '../../../app/features/parser/parseRepo';

describe('parseRepo', () => {
  const dir = path.join(os.tmpdir(), './test_parse_repo');
  beforeAll(() => {
    jest.setTimeout(1000 * 60 * 2);
  });

  afterAll(() => {
    jest.setTimeout(5000);
  });

  it('parseRepo', async () => {
    const setStatus = jest.fn();
    await parseRepo(
      'https://github.com.cnpmjs.org/guissy/resume-pick-app.git',
      dir,
      setStatus
    );
    expect(setStatus).toBeCalledWith('git clone...');
    expect(setStatus).toBeCalledWith(expect.stringContaining('commentRate'));
    expect(setStatus).toBeCalledWith(expect.stringContaining('linesInFile'));
    expect(setStatus).toBeCalledWith(expect.stringContaining('linesInCommit'));
  });
});
