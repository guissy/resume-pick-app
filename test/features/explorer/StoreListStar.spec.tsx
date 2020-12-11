import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import ScoreListStar from '../../../app/features/explorer/ScoreListStar';

Enzyme.configure({ adapter: new Adapter() });

const defaultTestProps = {
  levelSalary: 1.12,
  levelValue: 8.48,
};

describe('ScoreListStar component', () => {
  it('should match exact snapshot', () => {
    const tree = renderer
      // eslint-disable-next-line react/jsx-props-no-spreading
      .create(<ScoreListStar {...defaultTestProps} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should match exact snapshot level 3', () => {
    const tree = renderer
      // eslint-disable-next-line react/jsx-props-no-spreading
      .create(<ScoreListStar {...defaultTestProps} levelSalary={1.33} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
