function setCharBetweenSpace(string, index) {
    let appendedString = " " + string[index] + " ";
    let resultString = "";
    resultString = string.slice(0, index);
    resultString = resultString + appendedString;
    resultString = resultString + string.slice(index + 1);
    return resultString;
}


function tokenizer(program = "") {

    let specialChars = ["(", ")", ",", "{", "}", ";"];
    let inc = 1;
    for (let i = 0; i < program.length; i += inc) {
        inc = 1;
        if (specialChars.includes(program[i])) {
            program = setCharBetweenSpace(program, i);
            inc = 2;
        }
    }
    program = program.replace(/[\s]+/g, " ");
    program = program.trim();
    program = program.split(" ");

    return program;
}

/**
 * Retrieve index of closing pair of given index (if bracket or brace).
 * @param array Array to search within.
 * @param index Index of opening bracket/brace.
 * @returns {number} Index of closing bracket/brace.
 */
function getClosingPair(array = [], index = 0) {
    let stack = [];
    for (let i = index; i < array.length; ++i) {
        let tos = stack[stack.length - 1];
        if (array[i] === "(" || array[i] === "{") {
            stack.push(array[i]);
        } else if ((array[i] === ")" && tos === "(") || (array[i] === "}" && tos === "{")) {
            stack.pop();
            if (stack.length === 0) {
                return i;
            }
        }
    }
    throw new TypeError("Wrong arguments provided to getClosingPair");
}

exports.getClosingPair = getClosingPair;
exports.tokenizer = tokenizer;
exports.setCharBetweenSpace = setCharBetweenSpace;
