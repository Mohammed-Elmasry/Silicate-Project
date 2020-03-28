// preprocessing
let {tokenizer} = require("./preprocessor");

// parsing
let {parser} = require("./Parser");


let prog = `
    func multiplyBy2(num){
        print(num * 2)
    }
`;

let tokens = tokenizer(prog);
let ast = parser(tokens);
console.log(ast[0]["body"][0]);

