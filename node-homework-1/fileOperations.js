// File operations module
import fs from 'fs';
import path from 'path';
import { getCurrentDate, getCurrentTime } from './dateUtils.js';

const USERS_FILE = 'users.txt';
const LOGS_DIR = 'logs';
const LOG_FILE = path.join(LOGS_DIR, 'app.log');

function ensureLogsDirectory() {
    if (!fs.existsSync(LOGS_DIR)) {
        fs.mkdirSync(LOGS_DIR, { recursive: true });
        console.log(`Created logs directory: ${LOGS_DIR}`);
    }
}

export function addUser(userName) {
    const userEntry = `User: ${userName}, Date: ${getCurrentDate()}, Time: ${getCurrentTime()}\n`;
    
    fs.appendFileSync(USERS_FILE, userEntry);
    console.log(`Added user ${userName} to ${USERS_FILE}`);
}

export function displayAllUsers() {
    try {
        if (fs.existsSync(USERS_FILE)) {
            const content = fs.readFileSync(USERS_FILE, 'utf8');
            console.log('\nAll users in users.txt:');
            console.log('========================');
            console.log(content);
        } else {
            console.log('No users.txt file found.');
        }
    } catch (error) {
        console.error('Error reading users.txt:', error.message);
    }
}

export function logApplicationStart() {
    ensureLogsDirectory();
    
    const logEntry = `Application started at ${getCurrentDate()} ${getCurrentTime()}\n`;
    fs.appendFileSync(LOG_FILE, logEntry);
    console.log(`Logged application start to ${LOG_FILE}`);
}
