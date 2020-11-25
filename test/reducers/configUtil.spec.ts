import initFile, {
  initDefaultFile,
  saveFile,
} from '../../app/features/configUtil';

describe('configUtil', () => {
  it('should handle initFile', async () => {
    expect(await initFile()).toMatchSnapshot();
  });
  it('should handle initDefaultFile', async () => {
    expect(await initDefaultFile()).toMatchSnapshot();
  });

  it('should handle saveFile', async () => {
    expect(await saveFile({})).toMatchSnapshot();
  });
});
