import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import TreeMap from '../../../app/features/explorer/TreeMap';
import mockScoreFile from '../utils/mockScoreFile';
import { ScoreFile } from '../../../app/features/type';

Enzyme.configure({ adapter: new Adapter() });

describe('TreeMap component', () => {
  it('should match exact snapshot', () => {
    const tree = renderer
      .create(
        <TreeMap scoreFile={(mockScoreFile[0] as unknown) as ScoreFile} />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
