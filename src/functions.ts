import { calculator } from ".";

export const renderDisplay = (): void => {
  // select disabled input element as calculator display
  const display = document.querySelector<HTMLInputElement>(".display");

  // show 'Error' if number is out of range
  // Range is inherent to JavaScript Number type: 64-bit floating point (IEEE 754)
  const parsedDisplay = parseFloat(calculator.displayValue);
  if (
    !Number.isFinite(parsedDisplay) ||
    parsedDisplay < Number.MIN_SAFE_INTEGER ||
    parsedDisplay > Number.MAX_SAFE_INTEGER
  ) {
    if (display) display.value = "Error";
    clearAll();
    return;
  }

  // update display with latest calculator value
  if (display) {
    display.value = calculator.displayValue;
  }
};

export const clearAll = (): void => {
  // clears/re-initializes calculator
  calculator.displayValue = "0";
  calculator.firstValue = null;
  calculator.operator = null;
  calculator.needsSecondValue = false;
  // console.log(calculator);
};

export const inputDigit = (digit: string): void => {
  const { displayValue, needsSecondValue } = calculator;

  if (displayValue === "0" || needsSecondValue) {
    // handles initial digit press,
    // or after any operator button is pressed
    calculator.displayValue = digit;
    calculator.needsSecondValue = false;
  } else {
    // appends pressed digit to whatever is displayed
    // up to max digit length of 10
    calculator.displayValue =
      displayValue.length < 10 ? displayValue + digit : displayValue;
  }
  // console.log(calculator);
};

export const inputDecimal = (point: string): void => {
  const { displayValue, needsSecondValue } = calculator;

  // handles case where decimal button is clicked after operator button
  if (needsSecondValue) {
    calculator.displayValue = "0.";
    calculator.needsSecondValue = false;
    return;
  }

  // append decimal point to display value
  if (!displayValue.includes(point)) {
    calculator.displayValue += point;
  }
};

export const handleOperator = (nextOperator: string): void => {
  const { displayValue, firstValue, operator, needsSecondValue } = calculator;

  // convert displayValue to number for calculation
  const inputValue = parseFloat(displayValue);

  // handles changed operation type
  if (operator && needsSecondValue) {
    calculator.operator = nextOperator;
    // console.log(calculator);
    return;
  }

  if (!firstValue && !isNaN(inputValue)) {
    // assigns inputValue to firstValue on first operator press
    calculator.firstValue = inputValue;
  } else if (firstValue && operator) {
    // on second operator click,
    // send values to calc function and store in result variable
    const result = calculate(firstValue, inputValue, operator);

    // set displayValue to rounded result
    calculator.displayValue = roundForDisplay(result);

    // pass on result as firstValue
    calculator.firstValue = result;
  }

  // sets up calculator to calculate on next operator press
  calculator.needsSecondValue = true;
  calculator.operator = nextOperator;
  // console.log(calculator);
};

export const handleFunc = (funcType: string): void => {
  const { displayValue, needsSecondValue } = calculator;
  const inputValue = parseFloat(displayValue);
  console.log(inputValue);

  // initialize result variable
  let result: number = 0;

  // conditional logic to handle different funcTypes
  if (funcType === "sign") {
    result = inputValue * -1;
  }

  if (funcType === "sqrt") {
    result = Math.sqrt(inputValue);
  }

  // future func types added here //

  // set displayValue to rounded result
  calculator.displayValue = roundForDisplay(result);

  // if needed, result of above should used as second Value
  if (needsSecondValue) {
    calculator.needsSecondValue = false;
  }
  // console.log(calculator);
};

const calculate = (
  firstValue: number,
  secondValue: number,
  operator: string
): number => {
  if (operator === "+") {
    return firstValue + secondValue;
  }
  if (operator === "-") {
    return firstValue - secondValue;
  }
  if (operator === "*") {
    return firstValue * secondValue;
  }
  if (operator === "/") {
    return firstValue / secondValue;
  }

  // if "=" or "Enter" is passed in as the operator
  return secondValue;
};

const roundForDisplay = (result: number): string => {
  // handle floating-point precision, rounding, and converts result
  // to exponential notation if too many digits and set calc display

  // initialize displayResult value
  let displayValue: string;

  // length of raw result number (incl. dec. point)
  const resultLength = String(result).length;

  // handles floating-point precision for raw result
  const resultString = String(parseFloat(result.toFixed(7)));

  // length of digits to left of decimal point
  const resultLeftOfDec = String(resultString).split(".")[0].length;

  // converts result to exp notation
  const resultsExp = result.toExponential(6).replace("+", "");

  // console.log(resultLength, resultLeftOfDec, resultString.length);

  // conditional logic to determine displayValue
  if (resultLength < 11) {
    // returns raw result as string if length is 10 or less
    // e.g. "0.4" or "128" or "1234567890"
    displayValue = resultString;
  } else if (resultLeftOfDec < 8 && resultString.length > 10) {
    // limit display value to 10 digits (incl. dec. point)
    // for values with multiple digits to left & right of dec. point
    // e.g. "6085.80617" or "78301.1577"
    displayValue = parseFloat(resultString).toPrecision(9);
  } else if (resultString.length < 11) {
    // returns initial floating-point corrected resultString if length is 10 or less
    // e.g. "0.30000000000000004" becomes "0.3"
    displayValue = resultString;
  } else {
    // returns exponential notation for all else
    // e.g. "37037036700" becomes "3.704e10"
    displayValue = resultsExp;
  }

  return displayValue;
};
