**TODO BACKEND**

## Description

- This is the backend server for the full-stack TODO application, built using Node.js, Express, and MongoDB.
- It provides APIs for user authentication (signup/login), protected routes with JWT validation, and CRUD operations for managing todo items.
- Token expiration is handled securely, and structured error responses ensure smooth communication with the frontend.

## Table of Contents

- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Built With](#built-with)
- [API Endpoints](#api-endpoints)
- [Swagger Docs](#swagger-docs)
- [Security](#security)
- [Usage](#usage)

## Getting Started
Feel free to update or install dependencies using:
`npm install`

First, run the development server:
`npm run dev`

Server will run on
[http://localhost:3000/login]

## Environment Variables

`PORT=8000`
`DATABASE_LOCAL=mongodb://localhost:27017/todoapp`
`JWT_SECRET=your_super_secure_jwt_secret`
`CLIENT_URL=http://localhost:3000`
`NODE_ENV=development`

### Built With

- **Node.js** – JavaScript runtime
- **Express.js** – Web framework for routing and middleware
- **MongoDB** – NoSQL database
- **Mongoose** – ODM for MongoDB
- **JWT (jsonwebtoken)** – For user authentication and authorization
- **cookie-parser** – To handle HTTP-only cookies securely
- **express-validator**  – For validating and sanitizing incoming requests
- **morgan** – HTTP request logger
- **dotenv** – Environment variable management
- **swagger-jsdoc & swagger-ui-express** – Auto-generate and serve Swagger docs


### API Endpoints

1. Auth Routes (/api)
    - POST /signup – Register a new user
    - POST /login – Authenticate user and issue JWT token
2. Todo Routes (/api/todo)
    - GET /todo?userId= – Get user's todo list
    - POST /todo?userId= – Add new tasks to the user's list
    - PUT /todo – Update the done status of a task
    - DELETE /todo – Delete a task from the list
    
    
## Swagger Docs

The API is documented using Swagger (OpenAPI 3.0).
You can test and explore all available routes using the Swagger UI:

Swagger UI: [http://localhost:8000/api-docs]

Use the Authorize button in the top-right corner of Swagger UI to add the Bearer token after login.

- Token URL (OAuth2): POST /api/login
- Flow: password
- Fields:
    - username: Email (e.g., indu@gmail.com)
    - password: Your account password
    
    
## Security

- JWT tokens are stored in HTTP-only cookies and verified on every protected request.

- Middleware checks for valid/expired tokens and responds with appropriate status codes:
    - 401 Unauthorized – No or invalid token
    - 417 Expectation Failed – Token expired

- Data validation is performed on all input fields to prevent malformed requests.


## Usage

- Always include the JWT token in the Authorization header as:
    Authorization: Bearer <token>

- After login, the token is also set as an HTTP-only cookie for added security.

- The backend gracefully handles errors like missing fields, invalid IDs, or unauthorized access, and responds with proper HTTP status codes and messages.