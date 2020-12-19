import trackWorkAge from '../../../app/features/parser/tractWorkAge';

describe('trackWorkAge', () => {
  it('trackWorkAge', () => {
    expect(trackWorkAge('工作经验 7年')).toBe(7);
    expect(trackWorkAge('10年经验')).toBe(10);
  });
});
