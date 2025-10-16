const colors = require('colors');
const { square, cube } = require('./utils/math');

console.log('Homework complete!'.green);
console.log('Error found!'.red);

console.log('\nMath operations:');
console.log(`Square of 5: ${square(5)}`);
console.log(`Cube of 3: ${cube(3)}`);
console.log(`Square of 10: ${square(10)}`);
console.log(`Cube of 4: ${cube(4)}`);

console.log('\nHomework completed successfully!');
