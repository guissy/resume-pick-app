import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import TechRow from '../../../app/features/explorer/TechRow';
import configDefault from '../../../app/constants/configDefault.json';
import mockScoreFile from '../utils/mockScoreFile';
import { Keyword } from '../../../app/features/type';

Enzyme.configure({ adapter: new Adapter() });

describe('TechRow component', () => {
  it('should match exact snapshot', () => {
    const names = configDefault
      .map((k) =>
        ((k.children as unknown) as { name: string }[]).map((w) => w.name)
      )
      .flat();
    const tree = renderer
      .create(
        <TechRow
          keywords={mockScoreFile[0].keywords as Keyword[]}
          techNames={names}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
