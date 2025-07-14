**TODO FRONTEND**

## Description
- A simple and responsive full-stack Todo application. 
- Users can sign up, log in, and manage their personalized todo list — including creating, updating, marking as complete, and deleting tasks. 
- Authenticated routes are protected, token expiration is detected and handled gracefully, and errors are captured via a custom error boundary. Toast notifications enhance the user experience.


## Table of Contents

- [Getting Started](#getting-started)
- [Built With](#built-with)
- [Usage](#usage)
- [URLs](#URLs)

## Getting Started

Feel free to update or install dependencies using:
`npm install`

First, run the development server:
`npm run dev`

Open your browser and visit:
[http://localhost:3000/login]

### Built With

This project was built with the following tools and technologies:

- **React19**: For building the user interface.
- **Vite** – Super fast bundler and dev server
- **Tailwind CSS**: For rapid and flexible UI development.
- **TypeScript**: To provide type safety and enhance developer productivity.
- **Axios**: For making HTTP requests to APIs.
- **React**: Toastify – For elegant toast notifications
- **React Router** – Declarative routing for React apps
- **React Error Boundary** – Custom error fallback for better UX



## Usage

1. Visit the login page and enter your credentials.
2. After login, navigate to the Todo page to:
    - Add new tasks
    - Mark tasks as done/undone
    - Delete tasks
3. Token is validated on each API call.
4. Expired tokens redirect the user to a Session Expired page.

## URLs

Development Environment:
- [http://localhost:3000] – Main app
- [http://localhost:3000/login] – Login
- [http://localhost:3000/signup] – Signup
- [http://localhost:3000/todo] – Todo List
- [http://localhost:3000/session-expired] – Session Expired

