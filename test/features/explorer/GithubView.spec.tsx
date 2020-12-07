import '../utils/mockParseRepo';
import '../utils/mockElectron';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import { act } from 'react-dom/test-utils';
import GithubView from '../../../app/features/explorer/GithubView';

Enzyme.configure({ adapter: new Adapter() });
jest.useFakeTimers();

const defaultTestProps = { url: 'https://github.com/guissy' };

function setup(props = defaultTestProps) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  const getWrapper = () => mount(<GithubView {...props} />);
  const component = getWrapper();
  return {
    component,
    webview: component.find('webview').at(0),
  };
}
describe('GithubView component', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should match exact snapshot', () => {
    const tree = renderer
      // eslint-disable-next-line react/jsx-props-no-spreading
      .create(<GithubView {...defaultTestProps} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should show webview', () => {
    const { webview } = setup();
    expect(webview.props().src).toBe(defaultTestProps.url);
  });

  it('should show followers', async () => {
    const { webview, component } = setup();
    expect(component.text()).toContain('prepare...');
    const webviewInst = (webview.instance() as unknown) as EventTarget & {
      executeJavaScript: unknown;
    };
    webviewInst.executeJavaScript = jest.fn().mockReturnValue(
      Promise.resolve(
        JSON.stringify({
          repos: 111,
          followers: 222,
          contrib: 3,
        })
      )
    );
    act(() => {
      webviewInst.dispatchEvent(new Event('dom-ready'));
    });
    expect(component.text()).toContain('loading');
    await Promise.resolve();
    expect(component.text()).toContain('followers');
    expect(component.text()).toContain('contrib');
    expect(component.text()).toContain('111');
    expect(component.text()).toContain('222');
    expect(component.text()).toContain('3');
  });

  it('should show commits', async () => {
    const { webview, component } = setup();
    expect(component.text()).toContain('prepare...');
    const webviewInst = (webview.instance() as unknown) as EventTarget & {
      executeJavaScript: unknown;
    };
    webviewInst.executeJavaScript = jest
      .fn()
      .mockReturnValueOnce(
        Promise.resolve(
          JSON.stringify({
            contrib: 6,
          })
        )
      )
      .mockReturnValueOnce(Promise.resolve('click'))
      .mockReturnValueOnce(
        Promise.resolve(JSON.stringify([['test_repo', 10]]))
      );
    await act(async () => {
      webviewInst.dispatchEvent(new Event('dom-ready'));
      await Promise.resolve();
      await Promise.resolve();
      await jest.runTimersToTime(3000);
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(component.text()).toContain('file');
    expect(component.text()).toContain('commits');
    expect(component.text()).toContain('lines');
    expect(component.text()).toContain('comments');
    expect(component.text()).toContain('commit/line');
    expect(component.text()).toContain('3');
  });
});
