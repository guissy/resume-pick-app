import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import ScoreListSort from '../../../app/features/explorer/ScoreListSort';

Enzyme.configure({ adapter: new Adapter() });

const defaultTestProps = {
  name: '分数' as const,
  sort: '' as const,
  onClick: () => {},
};

function setup(props = defaultTestProps) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  const getWrapper = () => mount(<ScoreListSort {...props} />);
  const component = getWrapper();
  return {
    component,
    icon: component.find('i.fa'),
  };
}

describe('ScoreListSort component', () => {
  it('should match exact snapshot', () => {
    const tree = renderer
      // eslint-disable-next-line react/jsx-props-no-spreading
      .create(<ScoreListSort {...defaultTestProps} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should match exact snapshot up', () => {
    const tree = renderer
      // eslint-disable-next-line react/jsx-props-no-spreading
      .create(<ScoreListSort {...defaultTestProps} sort="scoreUp" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should match exact snapshot down', () => {
    const tree = renderer
      // eslint-disable-next-line react/jsx-props-no-spreading
      .create(<ScoreListSort {...defaultTestProps} sort="scoreDown" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should call onClick', () => {
    const onClick = jest.fn();
    const { component } = setup({ ...defaultTestProps, onClick });
    component.simulate('click');
    const mouseEvent = expect.objectContaining({ type: 'click' });
    expect(onClick).toBeCalledWith(mouseEvent);
  });
});
