export default function buildLevel(
  workAge: number,
  score: number,
  text: string
) {
  let lv = '-';
  let ageLv = 0;
  let scoreLv = 0;
  if (workAge >= 0 && workAge <= 3) {
    ageLv = 1;
  } else if (workAge >= 2 && workAge <= 5) {
    ageLv = 2;
  } else if (workAge >= 4 && workAge <= 7) {
    ageLv = 3;
  } else if (workAge >= 6) {
    ageLv = 4;
  }
  if (score > 2 && score <= 8) {
    scoreLv = 1;
  } else if (score >= 6 && score <= 12) {
    scoreLv = 2;
  } else if (score >= 10 && score <= 16) {
    scoreLv = 3;
  } else if (score >= 14) {
    scoreLv = 4;
  }
  if (ageLv + scoreLv >= 8) {
    lv = 'p7+';
  } else if (ageLv + scoreLv === 7) {
    lv = 'p7';
  } else if (ageLv + scoreLv === 6) {
    lv = 'p6+';
  } else if (ageLv + scoreLv === 5) {
    lv = 'p6';
  } else if (ageLv + scoreLv === 4) {
    lv = 'p5+';
  } else if (ageLv + scoreLv === 3) {
    lv = 'p5';
  } else if (ageLv + scoreLv === 2) {
    lv = 'p4+';
  } else if (ageLv + scoreLv === 1) {
    lv = 'p4';
  } else if (text.length > 0) {
    lv = 'p3';
  }
  return lv;
}
