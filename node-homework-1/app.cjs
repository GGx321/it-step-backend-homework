const { toUpper, toLower } = require('./strings.cjs');

const testStrings = [
    "Hello World",
    "JavaScript is Awesome",
    "node.js homework",
    "COMMONJS MODULE"
];

console.log("Testing CommonJS string module:");
console.log("=================================");

testStrings.forEach((str, index) => {
    console.log(`Test ${index + 1}:`);
    console.log(`  Original: "${str}"`);
    console.log(`  toUpper:  "${toUpper(str)}"`);
    console.log(`  toLower:  "${toLower(str)}"`);
    console.log();
});
