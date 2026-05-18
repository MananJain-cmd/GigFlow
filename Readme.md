# GigFlow – Smart Leads Dashboard

GigFlow is a full-stack Lead Management Dashboard built using the MERN stack with TypeScript.
It is designed to demonstrate scalable architecture, clean code practices, and real-world application development.

---

## Overview

GigFlow allows users to manage and track leads efficiently through a structured dashboard.
Users can create, update, delete, filter, and search leads with a responsive and user-friendly interface.

---

## Tech Stack

### Frontend

* React.js
* TypeScript
* CSS  

### Backend

* Node.js
* Express.js
* TypeScript
* MongoDB with Mongoose

---

## Features

### Authentication

* User Registration and Login
* JWT-based Authentication
* Password Hashing using bcrypt
* Protected Routes

### Lead Management

* Create, Update, and Delete Leads
* View All Leads
* View Individual Lead Details

### Advanced Functionality

* Search by Name or Email
* Debounced Search for optimized performance
* Filter by Status and Source
* Sort by Latest or Oldest
* Pagination with fixed page size

### Additional Features

* CSV Export Functionality
* Role-Based Access Control (Admin and Sales User)
* Error Handling and Validation
* Responsive UI

---

## Key Concepts Implemented

* RESTful API Design
* Middleware-based Authentication
* MongoDB Query Handling and Optimization
* Type-safe Development using TypeScript
* Modular and Scalable Project Structure

---

## Project Structure
## Project Structure

```
gigflow/
├── gigflow-frontend/
│   └── src/
│       ├── Login.tsx
│       ├── Dashboard.tsx
│       ├── App.tsx
│       └── ...
│
├── gigflow-backend/
│   └── src/
│       ├── Functions/
│       ├── models/
│       ├── routes/
│       ├── middleware/
│       ├── config/
│       └── server.ts
```

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/MananJain-cmd/GigFlow.git
cd gigflow
```

---

### 2. Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## Environment Variables

Create a `.env` file inside the backend directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## API Endpoints

### Authentication

* POST /api/auth/register
* POST /api/auth/login

### Leads

* GET /api/leads
* POST /api/leads
* GET /api/leads/:id
* PUT /api/leads/:id
* DELETE /api/leads/:id

---

## Deployment

Frontend can be deployed on Vercel or Netlify.
Backend can be deployed on Render or Railway.

---

## Future Improvements

* Enhanced UI and user experience
* Real-time updates
* Notifications system
* Advanced analytics and reporting

---

## Author
Manan Jain

---

## Submission
This project was developed as part of a Full Stack Internship assignment to demonstrate practical implementation of modern web development concepts.
