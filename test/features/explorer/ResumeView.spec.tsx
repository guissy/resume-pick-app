import '../utils/mockElectron';
import React from 'react';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import { render, fireEvent } from '@testing-library/react';
import { shell } from 'electron';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Highlighter from 'react-highlight-words';
import mockScoreFile from '../utils/mockScoreFile';
import ResumeView from '../../../app/features/explorer/ResumeView';
import { ScoreFile } from '../../../app/features/type';

Enzyme.configure({ adapter: new Adapter() });
jest.useFakeTimers();

const defaultTestProps = {
  resume: (mockScoreFile[0] as unknown) as ScoreFile,
  onClose: () => {},
};

function setup(props = defaultTestProps) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  const getWrapper = () => mount(<ResumeView {...props} />);
  const component = getWrapper();
  return {
    component,
    highlighter: component.find('Highlighter').at(0) as ReactWrapper<
      Highlighter
    >,
    button: component.find('button').at(0),
    searchInput: component.find('input'),
  };
}
describe('ResumeView component', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should match exact snapshot', () => {
    const tree = renderer
      // eslint-disable-next-line react/jsx-props-no-spreading
      .create(<ResumeView {...defaultTestProps} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should show mark', () => {
    const { highlighter } = setup();
    expect(highlighter.exists()).toBeTruthy();
    expect(highlighter.find('mark').exists()).toBeTruthy();
  });

  it('click button should open file', () => {
    const { button } = setup();
    defaultTestProps.resume.path = '1.pdf';
    button.simulate('click');
    expect(shell.openItem).toBeCalledWith(defaultTestProps.resume.path);
    defaultTestProps.resume.path = 'https://baidu.com';
    button.simulate('click');
    expect(shell.openExternal).toBeCalledWith(defaultTestProps.resume.path);
  });

  it('input should search', async () => {
    const { getByLabelText, getByText } = render(
      // eslint-disable-next-line react/jsx-props-no-spreading
      <ResumeView {...defaultTestProps} />
    );
    const searchInput = getByLabelText(/search input/i);
    fireEvent.change(searchInput, { target: { value: 'good' } });
    expect(searchInput.getAttribute('value')).toBe('good');
    expect(getByText(/good/).tagName).toBe('MARK');
    expect(getByLabelText(/search count/).textContent).toBe('1');
  });
});
