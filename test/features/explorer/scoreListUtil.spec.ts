import {
  toggleSort,
  getLevelStyle,
} from '../../../app/features/explorer/scoreListUtil';

describe('scoreListUtil', () => {
  it('toggleSort', () => {
    const fn = toggleSort(['testUp', 'testDown']);
    expect(fn('')).toBe('testDown');
    expect(fn('testDown')).toBe('testUp');
    expect(fn('testUp')).toBe('');
  });

  it('getLevelStyle', () => {
    expect(getLevelStyle('p5')).toBe('level level5');
    expect(getLevelStyle('p6')).toBe('level level6');
    expect(getLevelStyle('p7')).toBe('level level7');
    expect(getLevelStyle('p8')).toBe('level level8');
    expect(getLevelStyle('p8+')).toBe('level level8');
    expect(getLevelStyle('p8++')).toBe('level level8');
  });
});
