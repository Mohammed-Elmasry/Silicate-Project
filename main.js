// preprocessing
let {tokenizer} = require("./preprocessor");

// parsing
let {parser} = require("./Parser");


let prog = `
    if(x > 2){
        print("bigger")
    } else {
        print("small")
    }
`;

let tokens = tokenizer(prog);
let ast = parser(tokens);
console.log(ast[1]);

