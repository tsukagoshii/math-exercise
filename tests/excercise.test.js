// ./docs/excercise.js のJestテスト

const { getFactors } = require('../docs/exercise.js');

describe('getFactors', () => {
  it('「12」の割り切れる整数を配列として返す', () => {
    expect(getFactors(12)).toEqual([1, 2, 3, 4, 6, 12]);
  });
  it('「13」の割り切れる整数を配列として返す', () => {
    expect(getFactors(13)).toEqual([1, 13]);
  });
  it('「0」を与えると「0」だけが入った配列を返す', () => {
    expect(getFactors(0)).toEqual([0]);
  });
  it('「1」を与えると「1」だけが入った配列を返す', () => {
    expect(getFactors(1)).toEqual([1]);
  });
  it('「-12」を与えると「12」の時と同じ配列を返す', () => {
    expect(getFactors(-12)).toEqual([1, 2, 3, 4, 6, 12]);
  });
  it('allowRemainderがtrueの場合、「12」を与えると1以上12以下の整数を全て返す', () => {
    expect(getFactors(12, true)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ]);
  });
  it('整数でない数字を入れるとTypeErrorを返す', () => {
    expect(() => getFactors(12.5)).toThrow(
      new TypeError('12.5 は整数ではありません。'),
    );
  });
});
