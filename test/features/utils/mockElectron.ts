jest.mock('electron', () => ({
  remote: {
    app: {
      isPackaged: false,
      getAppPath: '.',
      getPath: jest.fn().mockReturnValue(''),
    },
    dialog: {
      showSaveDialog: jest.fn().mockReturnValue(
        Promise.resolve({
          canceled: false,
          filePath: './test/test.xlsx',
        })
      ),
    },
  },
  shell: {
    openExternal: jest.fn(),
    openItem: jest.fn(),
  },
}));
export default { electron: jest.fn() };
