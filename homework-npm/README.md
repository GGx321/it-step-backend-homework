# NPM Homework (Пара 4)

This project demonstrates npm package management and script configuration.

## Features

### Dependencies
- `colors` - For colored console output
- `nodemon` - Development dependency for auto-restart

### Scripts
- `npm start` - Runs the main application
- `npm run dev` - Runs with nodemon for development
- `npm run hello` - Echoes "Homework started!"
- `npm run test` - Echoes "Running tests..."

### Project Structure
```
homework-npm/
├── index.js          # Main application
├── utils/
│   └── math.js       # Math utility functions
├── package.json      # Project configuration
└── README.md         # This file
```

### Math Functions
- `square(n)` - Returns n²
- `cube(n)` - Returns n³

## Usage

```bash
# Run the application
npm start

# Run in development mode (with auto-restart)
npm run dev

# Run hello script
npm run hello

# Run test script
npm run test
```

## Output
- "Homework complete!" in green
- "Error found!" in red
- Math operations results
