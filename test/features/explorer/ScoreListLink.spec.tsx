import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import ScoreListLink from '../../../app/features/explorer/ScoreListLink';
import * as tractWorkAge from '../../../app/features/parser/tractWorkAge';

Enzyme.configure({ adapter: new Adapter() });

const defaultTestProps = { link: 'http://test.com', onClick: () => {} };

function setup(props = defaultTestProps) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  const getWrapper = () => mount(<ScoreListLink {...props} />);
  const component = getWrapper();
  return {
    component,
  };
}
describe('ScoreListLink component', () => {
  it('should match exact snapshot', () => {
    const tree = renderer
      // eslint-disable-next-line react/jsx-props-no-spreading
      .create(<ScoreListLink {...defaultTestProps} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should call getBlogByLink', () => {
    const getBlogByLinkSpy = jest.spyOn(tractWorkAge, 'getBlogByLink');
    setup();
    expect(getBlogByLinkSpy).toBeCalledTimes(1);
    expect(getBlogByLinkSpy).toBeCalledWith(defaultTestProps.link);
  });

  it('should call onClick', () => {
    const onClick = jest.fn();
    const { component } = setup({ ...defaultTestProps, onClick });
    component.simulate('click');
    const mouseEvent = expect.objectContaining({ type: 'click' });
    expect(onClick).toBeCalledWith(mouseEvent, defaultTestProps.link);
  });
});
