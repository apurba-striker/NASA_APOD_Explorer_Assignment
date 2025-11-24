# NASA APOD Explorer

A modern, space-themed web application that allows users to explore NASA's Astronomy Picture of the Day (APOD). Built with a React frontend and a Node.js/Express backend.

##  Features

- **Daily Picture**: View today's astronomy picture with a detailed explanation.
- **Gallery Mode**: Browse a gallery of the last 10 days of APOD images.
- **Immersive UI**: Deep space dark mode, glassmorphism effects, and smooth animations.
- **Responsive Design**: Optimized for both desktop and mobile viewing.

##  Tech Stack

- **Frontend**: React, Vite, Vanilla CSS (Space Theme)
- **Backend**: Node.js, Express
- **API**: NASA APOD API

##  Getting Started

Follow these instructions to get the project running on your local machine.

### Prerequisites

- Node.js installed on your system.

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/apurba-striker/NASA_APOD_Explorer_Assignment.git
    cd NASA_APOD_Explorer_Assignment
    ```

2.  **Backend Setup**
    Navigate to the backend folder and install dependencies:
    ```bash
    cd backend
    npm install
    ```
    Start the backend server:
    ```bash
    node server.js
    ```
    Setup environment variables:
    rename .env.example to .env
    ```bash
    cp .env.example .env
    ``` 
    The backend will run on `http://localhost:5000`.

3.  **Frontend Setup**
    Open a new terminal, navigate to the frontend folder, and install dependencies:
    ```bash
    cd frontend
    npm install
    ```
    Start the development server:
    ```bash
    npm run dev
    ```

    The frontend will typically run on `http://localhost:5173`.

### Deployed Frontend Url : https://nasa-apod-explorer-assignment.vercel.app/

