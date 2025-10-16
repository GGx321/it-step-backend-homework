# EventEmitter Homework (Пара 3)

This project demonstrates the use of Node.js EventEmitter for handling various events.

## Features

### 1. Login Counter
- Event: `login`
- Increments a counter each time the event is emitted
- Outputs: "User has logged in X times"

### 2. Shutdown Event
- Event: `shutdown`
- Outputs: "Application is shutting down..."
- Logs the message to `system.log` file

### 3. Order Created Event
- Event: `orderCreated`
- Parameters: `id` and `price`
- Outputs: "Order #<id> created with price <price>"

### 4. Math Operation Event (Bonus)
- Event: `mathOperation`
- Parameters: `a`, `b`, `operation`
- Supports operations: "add", "multiply", "divide"
- Handles division by zero error

## Usage

```bash
npm start
```

## Files

- `index.js` - Main application with EventEmitter implementation
- `system.log` - Log file created by shutdown events
- `package.json` - Project configuration
