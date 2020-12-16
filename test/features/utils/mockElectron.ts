jest.mock('electron', () => {
  return {
    remote: {
      app: {
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
  };
});
