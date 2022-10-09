// import calculator functions
import {
  renderDisplay,
  clearAll,
  inputDigit,
  inputDecimal,
  handleOperator,
  handleFunc,
} from "./functions";

// set up type interface for calculator object
interface Calculator {
  displayValue: string;
  firstValue: number | null;
  operator: string | null;
  needsSecondValue: boolean;
}

// initialize calculator object
// this acts as a sort of 'state' object for the app
export const calculator: Calculator = {
  displayValue: "0",
  firstValue: null,
  operator: null,
  needsSecondValue: false,
};

// initializes calculator display
renderDisplay();

// event listeners //

// select button elements
const keys = document.querySelector<HTMLButtonElement>(".calc-keys");
const body = document.querySelector<HTMLBodyElement>("body");

// add button event listeners and callbacks
keys?.addEventListener("click", (e) => handleClick(e));
body?.addEventListener("keyup", (e) => handleKeys(e));

const handleClick = (e: MouseEvent): void => {
  const target = e.target as HTMLButtonElement;

  // check if clicked element is button
  if (!target.matches("button")) return;

  // conditional logic for handling button values
  // can be refactored into switch statement or object literal
  if (target.classList.contains("clear")) {
    clearAll();
    renderDisplay();
    return;
  }

  if (target.classList.contains("func")) {
    handleFunc(target.value);
    renderDisplay();
    return;
  }

  if (target.classList.contains("operator")) {
    handleOperator(target.value);
    renderDisplay();
    return;
  }

  if (target.classList.contains("decimal")) {
    inputDecimal(target.value);
    renderDisplay();
    return;
  }

  // default case when integer button is clicked
  inputDigit(target.value);
  renderDisplay();
};

const handleKeys = (e: KeyboardEvent): void => {
  const key = e.key;

  // conditional logic for handling key presses
  if (key === "Escape") {
    clearAll();
    renderDisplay();
    return;
  }

  const operators = ["+", "-", "*", "/", "Enter"];
  operators.forEach((operator) => {
    if (key === operator) {
      handleOperator(operator);
      renderDisplay();
      return;
    }
  });

  if (key === ".") {
    inputDecimal(".");
    renderDisplay();
    return;
  }

  if (key === "Backspace") {
    const { displayValue, needsSecondValue } = calculator;

    // removes last digit of displayValue string
    if (displayValue !== "0" && displayValue.length > 1) {
      calculator.displayValue = displayValue.slice(0, -1);
    }

    // if last digit is removed or last char is a point, change value to 0
    if (
      displayValue.length === 1 ||
      displayValue[displayValue.length - 2] === "."
    ) {
      calculator.displayValue = "0";
    }

    // resets calc order when backspace is user after operator is used
    if (needsSecondValue) {
      calculator.needsSecondValue = false;
    }

    renderDisplay();
    return;
  }

  // default case when num keys are pressed
  const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  digits.forEach((digit) => {
    if (key === digit) {
      inputDigit(key);
      renderDisplay();
      return;
    }
  });
};
