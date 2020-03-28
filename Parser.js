let {getClosingPair} = require("./preprocessor");

function getArgs(tokens = [], index = 0) {
    let i = tokens.indexOf("(", index);
    let closingPair = getClosingPair(tokens, i);
    args = tokens.slice(i + 1, closingPair).filter(function (e) {
        return e !== ",";
    });
    return args;
}

function getCondArgs(tokens = [], index = 0) {
    let i = tokens.indexOf("(", index);
    let closingPair = getClosingPair(tokens, i);
    args = tokens.slice(i + 1, closingPair).filter(function (e) {
        return e !== ",";
    });
    temp = args[0];
    args[0] = args[1];
    args[1] = temp;
    return args;
}

function getBody(tokens = [], index = 0) {
    let start = tokens.indexOf("{", index);
    let end = getClosingPair(tokens, start);
    return tokens.slice(start + 1, end);
}

function getFuncName(tokens = [], index = 0) {
    return tokens[index + 1];
}

function handleBrace(array = [], index = 0) {
    let retval = 0;
    if (array[index] == "(" || array[index] == "{") {
        retval = getClosingPair(array, index);
    } else {
        retval = index + 1;
    }
    return retval;
}

function parser(tokens = []) {
    let tree = [];
    let braces = ["(", "{", ")", "}"];
    let operators = ["+", "-", "*", "/", "%", "<", ">", "==", "<=", ">="];

    for (let i = 0; i < tokens.length; ++i) {


        let token = tokens[i];
        if (token === undefined) {
            return tree;
        }
        let expr = Object.create(null);
        if (isKeyword(token)) {
            if (token === "def") {
                expr["type"] = "apply";
                expr["operator"] = "def";
                expr["args"] = parser(getArgs(tokens, i));
                tree.push(expr);
            } else if (token === "if" || token === "while") {
                expr["type"] = "apply";
                expr["operator"] = token;
                expr["args"] = parser(getCondArgs(tokens, i));
                expr["body"] = parser(getBody(tokens, i));
                tree.push(expr);
            } else if (token === "else") {
                expr["type"] = "apply";
                expr["operator"] = token;
                expr["body"] = parser(getBody(tokens, i));
                tree.push(expr);
            } else if (token === "func") {
                expr["type"] = "apply";
                expr["operator"] = token;
                expr["name"] = getFuncName(tokens, i);
                expr["args"] = parser(getArgs(tokens, i));
                expr["body"] = parser(getBody(tokens, i));
                tree.push(expr);
                i++;
            }
        } else {
            // literal parsing
            let match;
            if ((match = /(-?\d+\.?\d*)/.exec(token)) || (match = /"([^"]+)"/.exec(token))) { // literal
                expr["type"] = "literal";
                expr["value"] = match[1];
                tree.push(expr);
            } else {
                // identifier (function / var)
                if (match = /([\w]+)/.exec(token)) {
                    if (tokens[i + 1] === "(") { // a function call
                        expr["type"] = "apply";
                        expr["operator"] = match[1];
                        var args = (getArgs(tokens, i));
                        let intersection = operators.filter(arg => {
                            return args.includes(arg);
                        });
                        if (intersection.length != 0) {
                            expr["args"] = parser(getCondArgs(tokens));
                        } else {
                            expr["args"] = parser(args);
                        }
                        tree.push(expr);
                    } else { // a variable
                        expr["type"] = "identifier";
                        expr["name"] = match[1];
                        tree.push(expr);
                    }
                } else if (braces.includes(tokens[i])) {
                    i = handleBrace(tokens, i);
                } else { // operator
                    if (operators.includes(token)) {
                        expr["type"] = "apply";
                        expr["operator"] = token;
                        expr["args"] = parser([tokens[i + 1], tokens[i + 2]]);
                        tree.push(expr);
                        return tree;
                    }
                }
            }
        }
    }
    return tree;
}

function isKeyword(keyword = "") {
    let keywords = ["func", "def", "while", "if", "else"];
    return keywords.includes(keyword);
}


// module exports
exports.isKeyword = isKeyword;
exports.getArgs = getArgs;
exports.getBody = getBody;
exports.parser = parser;
