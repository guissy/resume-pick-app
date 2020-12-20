import trackWorkAge, {
  trackPhone,
} from '../../../app/features/parser/tractWorkAge';

describe('trackWorkAge', () => {
  it('trackWorkAge', () => {
    expect(trackWorkAge('工作经验 7年')).toBe(7);
    expect(trackWorkAge('10年经验')).toBe(10);
  });
  it('trackPhone', () => {
    expect(trackPhone(`电话 1351234567890 `)).toBe('');
    expect(trackPhone(`电话 135-1234-5678 `)).toBe('13512345678');
    expect(trackPhone(`电话 135 1234 5678 `)).toBe('13512345678');
    Array(1000).forEach(() => {
      const p = (1e10 + 1e10 * Math.random()).toFixed(0);
      expect(trackPhone(`电话 ${p.toString()}`)).toBe(p.toString());
    });
  });
});
