import randomColor from "randomcolor";
import { getCurrentDate, getCurrentTime } from "./dateUtils.js";
import { addUser, displayAllUsers, logApplicationStart } from "./fileOperations.js";

const args = process.argv.slice(2);
const userName = args[0] || "Student";
const favoriteColor = args[1] || null;

const timeString = getCurrentTime();
const dateString = getCurrentDate();

console.log("Homework #1 started!");

if (favoriteColor) {
    console.log(`Hello, ${userName}! Your favorite color is ${favoriteColor}.`);
} else {
    console.log(`Hello, ${userName}!`);
}

console.log(`Current time: ${timeString}`);
console.log(`Current date: ${dateString}`);

const color = randomColor();
console.log(`Generated color: ${color}`);

console.log('\n--- File Operations ---');
logApplicationStart();
addUser(userName);
displayAllUsers();
