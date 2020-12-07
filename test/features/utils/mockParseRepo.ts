jest.mock('../../../app/features/parser/parseRepo', () => {
  return () => ({
    commits: 3,
    nCode: 3,
    commentRate: 3,
    linesInFile: 3,
    linesInCommit: 3,
    fileTypes: {},
  });
});
