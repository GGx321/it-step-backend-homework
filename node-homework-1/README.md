

**ДОКУМЕНТАЦИЯ СОЗДАНА С ПОМОЩЬЮ ИИ**



# Node.js Homework Assignment

This project contains two homework assignments for Node.js course.


## Homework 1 (Basic Node.js)

### Features:
- Basic console output with current time
- Command line argument support for name and favorite color
- Integration with `randomcolor` npm package
- ES modules support

### Usage:
```bash
# Basic usage
npm start

# With name
npm start Alex

# With name and favorite color
npm start Alex blue
```

## Homework 2 (Modules and File Operations)

### Features:
- **CommonJS Module** (`strings.cjs`): String manipulation functions
  - `toUpper(str)` - converts string to uppercase
  - `toLower(str)` - converts string to lowercase
- **ES Module** (`dateUtils.js`): Date and time utilities
  - `getCurrentDate()` - returns current date in DD.MM.YYYY format
  - `getCurrentTime()` - returns current time in HH:MM:SS format
- **File Operations** (`fileOperations.js`):
  - Creates and manages `users.txt` file
  - Logs application starts to `logs/app.log`
  - Displays all users from the file

### Files Structure:
```
node-homework-1/
├── main.js              # Main application file
├── app.cjs              # CommonJS module test
├── strings.cjs          # CommonJS string utilities
├── dateUtils.js         # ES module date utilities
├── fileOperations.js    # File operations module
├── users.txt            # User data file (created automatically)
├── logs/
│   └── app.log          # Application log file
└── package.json         # Project configuration
```

### Testing:
```bash
# Test CommonJS module
node app.cjs

# Test main application
npm start [name] [color]
```

## Dependencies:
- `randomcolor` - Generate random colors
