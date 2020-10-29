export default function trackWorkAge(text: string) {
  // 工作年限：3年
  let years: string;
  const match1 = text.match(
    /(工作)?(年限|经验|开发)[^\d\n]*([\d一二三四五六七八九十]+)\s*年/
  );
  years = match1 ? String(match1.pop()) : '';
  if (!years) {
    const match2 = text.match(/([\d一二三四五六七八九十]+)\s*年(工作)?(经验)/);
    years = match2 ? String(match2[1]) : '';
  }
  return years ? `${years}年` : '-';
}

export function trackPhone(text: string) {
  return text.match(/1\d{10}/g)?.[0];
}
