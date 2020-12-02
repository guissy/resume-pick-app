import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import ScoreListLevel from '../../../app/features/explorer/ScoreListLevel';
import * as scoreListUtil from '../../../app/features/explorer/scoreListUtil';

Enzyme.configure({ adapter: new Adapter() });

const defaultTestProps = { level: 'p6++', levelValue: 7 };

function setup(props = defaultTestProps) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  const getWrapper = () => mount(<ScoreListLevel {...props} />);
  const component = getWrapper();
  return {
    component,
  };
}
describe('ScoreListLevel component', () => {
  it('should match exact snapshot', () => {
    const tree = renderer
      // eslint-disable-next-line react/jsx-props-no-spreading
      .create(<ScoreListLevel {...defaultTestProps} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should show level', () => {
    const getLevelStyleSpy = jest.spyOn(scoreListUtil, 'getLevelStyle');
    const { component } = setup();
    expect(component.text()).toContain(defaultTestProps.level.slice(0, 2));
    expect(getLevelStyleSpy).toBeCalledWith(defaultTestProps.level);
    expect(getLevelStyleSpy).toBeCalledTimes(1);
  });
});
