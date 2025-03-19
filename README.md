# Learn2Code - Interactive Quiz Application

## Overview
Learn2Code is a web-based quiz platform designed to enhance programming knowledge through interactive quizzes. The application supports multiple programming languages, offering structured lessons and quizzes that adapt dynamically. The backend is built with **Node.js** and **MySQL**, while the frontend leverages **JavaScript** to handle user interactions efficiently.

## Features
- **Dynamic Quizzes:** Fetches and displays questions based on selected programming topics.
- **Database-Driven Content:** Lessons and quiz questions are stored and managed via MySQL.
- **Interactive Learning:** Provides immediate feedback to users for a hands-on coding experience.
- **Modular & Scalable:** Built with a structured architecture to support future enhancements.
  
## Development Setup
## 1. Clone the Repository ##
 
## git clone https://github.com/EricoHello/Team5.git
- After cloning, open the folder in a development environment like VS Code.
- You should see dist and src folders along with other project files.
- Open two terminals—one for the frontend and another for the backend.

## 2. Set Up the Backend

- In the backend terminal, install Express:
  ##    npm install express
- Create a .env file to store sensitive configuration information. This file is only for team members and should not be shared.
- Start the backend server:
  ##    node app.mjs
- If you encounter a timeout error, press Ctrl + C, run clear, and then retry with:
  ##    node app.mjs
- It should successfully connect to the SQL Server within three attempts.

## 3. Set Up the Frontend

- Once the backend is running, switch to the second terminal (frontend).
- Start the frontend server:
   ## npm run dev
- This should launch the web application in a browser.
