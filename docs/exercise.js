// 全角半角の混乱を避けるために、事前に計算の記号を定義しておく
const GLYPHS_MATH = {
  plus: '＋',
  minus: '−',
  multiply: '×',
  divide: '÷',
};

/**
 * ドリル問題を生成する
 */
function createExercise() {
  // 前回実行時に生成したドリルやエラーメッセージを初期化する。
  reset();
  // 問題生成
  try {
    // 設定値を取得して検証する。
    const config = validateConfig({
      min: parseFloat(document.getElementById('min').value),
      max: parseFloat(document.getElementById('max').value),
      typePlus: document.getElementById('type-plus').checked ? true : false,
      typeMinus: document.getElementById('type-minus').checked ? true : false,
      typeMultiply: document.getElementById('type-multiply').checked
        ? true
        : false,
      typeDivide: document.getElementById('type-divide').checked ? true : false,
      allowRemainder: document.getElementById('allow-remainder').checked
        ? true
        : false,
      allowMinus: document.getElementById('allow-minus').checked ? true : false,
      exerciseCount: document.getElementById('exercise-count').value,
    });
    // 設問の数だけ、最初の数字をランダムに生成して配列に格納する
    const firstNums = [...Array(config.exerciseCount)].map(() => {
      return (
        Math.ceil(Math.random() * (config.max - config.min + 1)) + config.min
      );
    });
    // 使用する計算を配列useMathsに格納
    let useMaths = [
      GLYPHS_MATH.plus,
      GLYPHS_MATH.minus,
      GLYPHS_MATH.multiply,
      GLYPHS_MATH.divide,
    ].reduce((use, math, ind) => {
      if (
        [
          config.typePlus,
          config.typeMinus,
          config.typeMultiply,
          config.typeDivide,
        ][ind]
      ) {
        use.push(math);
      }
      return use;
    }, []);
    const maths = firstNums.map((firstNum) => {
      const math = useMaths[Math.floor(Math.random() * useMaths.length)];
      let secondNum = 0;
      if (math === GLYPHS_MATH.minus && !config.allowMinus) {
        secondNum =
          Math.floor(Math.random() * (firstNum - config.min + 1)) + config.min;
      } else if (math === GLYPHS_MATH.divide) {
        const factors = getFactors(firstNum, config.allowRemainder);
        console.log(factors); // debug
        if (factors.length === 1 && factors[0] === 0) {
          secondNum =
            Math.floor(Math.random() * (config.max - config.min + 1)) +
            config.min;
        } else {
          secondNum = factors[Math.floor(Math.random() * factors.length)];
          console.log(secondNum); // debug
        }
        if (secondNum === 0) {
          // 分母が0とならないようにする。
          if (config.max === 0) {
            secondNum = -1;
          } else if (config.max < 1) {
            secondNum = config.max;
          } else {
            secondNum = 1;
          }
        }
      } else {
        secondNum =
          Math.floor(Math.random() * (config.max - config.min + 1)) +
          config.min;
      }
      secondNum = secondNum < 0 ? `( ${secondNum} )` : secondNum;
      return `<li>${firstNum} ${math} ${secondNum} = </li>`;
    });
    document.getElementById('exercise').innerHTML = maths.join('');
    alert(`${config.exerciseCount} 問の計算ドリルが生成されました。`);
  } catch (error) {
    let targetId = '';
    let isNotExpected = false;
    if (error.message.startsWith('「数字の範囲」')) {
      targetId = 'error-range';
    } else if (error.message.startsWith('「計算の種類」')) {
      targetId = 'error-type';
    } else if (error.message.startsWith('「設問数」')) {
      targetId = 'error-count';
    } else {
      isNotExpected = true;
    }
    if (isNotExpected) {
      alert(error.message);
    } else {
      document.getElementById(targetId).textContent = error.message;
      alert('設定した値に不備があります。ご確認ください。');
    }
  }
}
/**
 * 前回実行時に生成したドリルやエラーメッセージを初期化する。
 */
function reset() {
  // 生成したドリルを初期化
  document.getElementById('exercise').textContent = null;
  // エラーメッセージを初期化
  const targetIds = ['error-range', 'error-type', 'error-count'];
  targetIds.forEach((targetId) => {
    document.getElementById(targetId).textContent = null;
  });
}
/**
 * 入力された設定値を検証し、不備であればエラーをアラートとして返す。不備がなければ整形して戻す。
 * @param {*} config
 * @return {*}
 */
function validateConfig(config) {
  // 数字の範囲
  if (
    config.min != parseInt(config.min) ||
    config.max != parseInt(config.max)
  ) {
    throw new TypeError('「数字の範囲」は半角数字で整数を指定してください。');
  } else {
    config.min = parseInt(config.min);
    config.max = parseInt(config.max);
  }
  if (config.min > config.max) {
    throw new RangeError(
      '「数字の範囲」指定で、最小値は最大値以下の値に設定してください。',
    );
  }
  // 0以下の数字が「数字の範囲」に含まれるのであれば、allowMinusの入力値に関わらずtrueにする
  config.allowMinus = config.min < 0 ? true : config.allowMinus;
  // 計算の種類
  if (
    (config.typePlus ? 1 : 0) +
      (config.typeMinus ? 1 : 0) +
      (config.typeMultiply ? 1 : 0) +
      (config.typeDivide ? 1 : 0) ==
    0
  ) {
    throw new Error(
      '「計算の種類」では、1つ以上の計算を選んでチェックを入れてください。',
    );
  }
  // 設問数
  if (config.exerciseCount != parseInt(config.exerciseCount)) {
    throw new TypeError('「設問数」は半角数字で指定してください。');
  }
  config.exerciseCount = parseInt(config.exerciseCount);
  if (config.exerciseCount < 1) {
    throw new RangeError('「設問数」には1以上の数値を指定してください。');
  } else if (config.exerciseCount > 1000) {
    throw new RangeError('「設問数」には1,000以下の数値を指定してください。');
  }
  return config;
}

/**
 * 入力した整数の因数を配列として返す。
 * allowRemainderがtrueの場合、因数に限らず、入力した整数の絶対値以下、1以上の整数を全て返す。
 * @param {number} number 因数分解する整数
 * @param {boolean} allowRemainder あまりを許容するかどうか。これがtrueの場合、入力した整数の絶対値以下、1以上の整数を全て返す。
 * デフォルトはfalse。
 * @return {number[]} 入力した整数の因数を昇順で格納した配列
 */
function getFactors(number, allowRemainder = false) {
  const absNumber = number < 0 ? -1 * number : number;
  if (absNumber !== Math.floor(absNumber)) {
    throw new TypeError(`${number} は整数ではありません。`);
  }
  if (absNumber === 0) {
    return [0];
  }
  const factors = [...Array(absNumber).keys()].map((x) => x + 1);
  return allowRemainder ? factors : factors.filter((i) => absNumber % i === 0);
}

module.exports = {
  createExercise,
  reset,
  validateConfig,
  getFactors,
};
