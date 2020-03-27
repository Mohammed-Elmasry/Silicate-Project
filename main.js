// preprocessing
let {tokenizer, getClosingPair, setCharBetweenSpace} = require("./preprocessor");

// parsing
let {parser, getArgs, isKeyword, getBody} = require("./Parser");


let prog = `
    if(x + 2){
        print("big")
    }
`;

let tokens = tokenizer(prog);
let ast = parser(tokens);
console.log(ast[0]["args"][[0]]);

