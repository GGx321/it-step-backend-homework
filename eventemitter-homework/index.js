import { EventEmitter } from 'events';
import fs from 'fs';

const eventEmitter = new EventEmitter();
let loginCount = 0;

eventEmitter.on('login', () => {
    loginCount++;
    console.log(`User has logged in ${loginCount} times`);
});

eventEmitter.on('shutdown', () => {
    console.log('Application is shutting down...');
    fs.appendFileSync('system.log', 'Application is shutting down...\n');
});

eventEmitter.on('orderCreated', (id, price) => {
    console.log(`Order #${id} created with price ${price}`);
});

eventEmitter.on('mathOperation', (a, b, operation) => {
    let result;
    switch (operation) {
        case 'add':
            result = a + b;
            console.log(`${a} + ${b} = ${result}`);
            break;
        case 'multiply':
            result = a * b;
            console.log(`${a} * ${b} = ${result}`);
            break;
        case 'divide':
            if (b !== 0) {
                result = a / b;
                console.log(`${a} / ${b} = ${result}`);
            } else {
                console.log('Error: Division by zero');
            }
            break;
        default:
            console.log('Unknown operation');
    }
});

console.log('EventEmitter Homework Started!');
console.log('==============================');

console.log('\n1. Testing login counter:');
eventEmitter.emit('login');
eventEmitter.emit('login');
eventEmitter.emit('login');

console.log('\n2. Testing shutdown event:');
eventEmitter.emit('shutdown');
eventEmitter.emit('shutdown');

console.log('\n3. Testing orderCreated event:');
eventEmitter.emit('orderCreated', 1001, 25.99);
eventEmitter.emit('orderCreated', 1002, 150.50);
eventEmitter.emit('orderCreated', 1003, 75.00);

console.log('\n4. Testing mathOperation event:');
eventEmitter.emit('mathOperation', 10, 5, 'add');
eventEmitter.emit('mathOperation', 7, 3, 'multiply');
eventEmitter.emit('mathOperation', 20, 4, 'divide');
eventEmitter.emit('mathOperation', 15, 0, 'divide');

console.log('\nEventEmitter Homework Complete!');
