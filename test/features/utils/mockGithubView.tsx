import React from 'react';

jest.mock('../../../app/features/explorer/GithubView', () => {
  // eslint-disable-next-line react/display-name
  return () => <></>;
});
