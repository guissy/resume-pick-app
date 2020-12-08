jest.mock('electron', () => {
  return {
    remote: {
      app: {
        getPath: jest.fn().mockReturnValue(''),
      },
    },
    shell: {
      openExternal: jest.fn(),
      openItem: jest.fn(),
    },
  };
});
