export default function trackWorkAge(text: string) {
  // 工作年限：3年
  let years = '';
  if (text) {
    const match1 = text.match(
      /(工作)?(年限|经验|开发)[^\d\n]*([\d一二三四五六七八九十]+)\s*年/
    );
    years = match1 ? String(match1.pop()) : '';
  }
  if (!years && text) {
    const match2 = text.match(/([\d一二三四五六七八九十]+)\s*年(工作)?(经验)/);
    years = match2 ? String(match2[1]) : '';
  }
  return years ? `${years}年` : '-';
}

export function trackPhone(text: string) {
  return (text || '').match(/1\d{10}/g)?.[0] || '';
}

export function trackLinks(text: string) {
  const urls =
    (text || '').match(
      /(https?:\/\/)?([@a-z0-9.]+)\.(com|cn|io|org|net|cc|info|biz|co|ai)\/?[^\n\s()]*/g
    ) || [];
  return urls.filter((url) => !url.includes('@'));
}
