const operations = ["+", "-", "/", "X", "+/-", "="];

function Kalculator() {
    let previous = [];
    let currents = [];
    let canCalculate = false;
    let canClear = false;
    const buttonsElement = document.querySelectorAll("button");

    function moveScrollCurrentToRight() {
        document.querySelector(".kalculator__screen__current").scrollLeft =
            document.querySelector(".kalculator__screen__current").scrollWidth;
    }
    function setCurrent(text) {
        document.querySelector(".kalculator__screen__current").innerHTML = text;
    }
    function setPrevious(text) {
        document.querySelector(".kalculator__screen__previous").innerHTML = text;
    }
    function clearKeyArrays() {
        currents = [];
        previous = [];
    }
    function alreadyHasOperatorInPrevious() {
        return containsAnyOperatorInArray(previous);
    }
    function containsInPrevious(key) {
        return containsOperatorInArray(previous, key);
    }

    function manageKeys(currentKey) {
        if (currentKey === "C") {
            clearKeyArrays();
            setCurrent("");
            setPrevious("");
            return;
        }

        if (currents.length === 0 && currentKey === ".") {
            return;
        }

        if (canClear && !isOperator(currentKey)) {
            currents = [];
            canClear = false;
        }

        if (isOperator(currentKey)) {
            if (containsInPrevious("=")) {
                canCalculate = false;
                previous = [...currents, currentKey];
                setPrevious(previous.join(""));
                return;
            }

            if (alreadyHasOperatorInPrevious() && canCalculate) {
                const operator = getOperatorFromArray(previous);
                const previousNumber = convertToNumber(previous.slice(0, previous.length - 1));
                const currentNumber = convertToNumber(currents);
                const result = calculate(operator, previousNumber, currentNumber);

                if (currentKey === "=") {
                    previous = [previousNumber, operator, currentNumber, "="];
                } else {
                    previous = [result, operator];
                }

                canCalculate = false;
                currents = [result];
                setCurrent(result);
                setPrevious(previous.join(""));

                if (isOperator(previous.last())) {
                    previous.pop();
                    previous.push(currentKey);
                    setPrevious(previous.join(""));
                    canClear = true;
                }
            } else if (currents.length !== 0) {
                previous = [...currents, currentKey];
                setPrevious(previous.join(""));
                canClear = true;
                canCalculate = false;
            }
        } else {
            canCalculate = true;
            if (containsInPrevious("=")) {
                clearKeyArrays();
                setPrevious(previous.join(""));
            }

            currents.push(currentKey);
            setCurrent(currents.join(""));
        }

        moveScrollCurrentToRight();
    }

    function onClickButton(event) {
        manageKeys(event.target.innerHTML);
    }

    function onKeyDown(event) {
        if (isNaN(event.key)) {
            const keyConverted = convertKey(event.key);
            if (keyConverted != null) {
                manageKeys(keyConverted);
            }
        } else {
            manageKeys(event.key);
        }
    }

    return {
        init: function () {
            buttonsElement.forEach((button) => {
                button.addEventListener("click", onClickButton);
            });

            document.addEventListener("keydown", onKeyDown);
        },
    };
}

window.onload = () => {
    Kalculator().init();
};

function convertToNumber(array = []) {
    return Number(array.join(""));
}

function calculate(operator, number1, number2) {
    switch (operator) {
        case "+":
            return number1 + number2;
        case "-":
            return number1 - number2;
        case "X":
            return number1 * number2;
        case "/":
            return number1 / number2;
        default:
            return null;
    }
}

function isOperator(key) {
    return operations.includes(key);
}

function containsAnyOperatorInArray(array = []) {
    return array.find((e) => isOperator(e)) != null;
}

function containsOperatorInArray(array = [], operator) {
    return array.find((e) => e === operator) != null;
}

function getOperatorFromArray(array = []) {
    return array.find((e) => isOperator(e));
}

function getCurrentOperation(keys) {
    let currentOperation = null;
    operations.forEach((operation) => {
        if (currentOperation == null) {
            currentOperation = keys.join("").indexOf(operation);
        }
    });

    return currentOperation;
}

function convertKey(key) {
    if (isOperator(key)) {
        return key;
    } else if (key === "*") {
        return "X";
    } else if (key === "Enter") {
        return "=";
    } else if (key === "Delete" || key === "Backspace") {
        return "C";
    } else if (key === ",") {
        return ".";
    }
    return null;
}

Array.prototype.last = function () {
    return this[this.length - 1];
};
