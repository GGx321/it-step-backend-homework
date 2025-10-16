# Simple Website on Node.js (без Express)

A simple web server built using Node.js built-in `http` module with multiple routes and different response types.

## Features

### Routes
- **GET /** - Home page (HTML)
  - Returns: `<h1>Welcome to My Website</h1><p>This is the home page.</p>`

- **GET /about** - About page (Plain text)
  - Returns: `This is About Page`

- **GET /contact** - Contact page (HTML)
  - Returns: `<h1>Contact Us</h1><p>Email: example@mail.com</p>`

- **GET /api/users** - Users API (JSON)
  - Returns: `[{"id":1,"name":"Anna"},{"id":2,"name":"Nick"}]`

- **GET /time** - Current server time (Plain text)
  - Returns: `Current time: DD.MM.YYYY, HH:MM:SS`

- **GET /unknown** - 404 Not Found (Plain text)
  - Returns: `404 Page Not Found`

## Usage

```bash
# Start the server
npm start

# Or directly
node server.js
```

Server will start on `http://localhost:5001`

## Testing

You can test all routes using curl or a browser:

```bash
# Home page
curl http://localhost:5001/

# About page
curl http://localhost:5001/about

# Contact page
curl http://localhost:5001/contact

# Users API
curl http://localhost:5001/api/users

# Current time
curl http://localhost:5001/time

# 404 page
curl http://localhost:5001/unknown
```

## Technical Details

- **Port**: 5001 (changed from 5000 due to port conflict)
- **Module**: Built-in `http` module (no Express)
- **Response Types**: HTML, Plain text, JSON
- **Status Codes**: 200 (OK), 404 (Not Found)
- **Content Types**: text/html, text/plain, application/json

## Project Structure

```
simple-website/
├── server.js      # Main server file
├── package.json   # Project configuration
└── README.md      # This file
```
