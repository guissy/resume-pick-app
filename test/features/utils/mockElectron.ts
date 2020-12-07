jest.mock('electron', () => {
  return {
    remote: {
      app: {
        getPath: jest.fn().mockReturnValue(''),
      },
    },
  };
});
