# DevPlanner Backend

## Description
This is the backend service for the DevPlanner Task Management Application. It provides RESTful APIs for user authentication and task management, including adding, editing, deleting, and retrieving tasks. The backend is built using Express.js and MongoDB for data persistence.

## Live Links
- **DevPlanner:** `https://devtaskplanner.web.app/`

## Technologies Used
- **Node.js** - JavaScript runtime
- **Express.js** - Backend framework
- **MongoDB** - NoSQL database
- **Cors** - Middleware for handling cross-origin requests
- **dotenv** - For environment variable management

## Features
- **User :**
  - Stores user details (User ID, email, display name) upon first login
- **Task Management:**
  - Add, edit, delete, and retrieve tasks
  - Tasks belong to one of three categories: To-Do, In Progress, Done
  - Tasks are saved instantly to MongoDB
- **Real-Time Syncing:**
  - Ensures persistence and reordering of tasks within categories


## Folder Structure
```
backend/
│-- .vercel
│-- node_modules
│-- .env
│-- .gitIgnore
│-- index.js
│-- package-local.json
│-- package.json
│-- Redme.md
│-- vercel.json
```

## Dependencies
- express
- cors
- mongodb
- dotenv


## Client Repo Links
- **GitHub URL:** `https://github.com/rohan26ir/DevPlanner-server.git`
