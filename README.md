# User Directory Management System

A full-stack application to import, manage, and display user data from CSV files. Built with a modern React frontend and a lightweight Node.js/NeDB backend.

![UI Preview](https://via.placeholder.com/800x400?text=User+Directory+UI+Preview)
*(Note: Replace with actual screenshot if available)*

## ⚡ Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

-   Node.js (v14 or higher)
-   npm (Node Package Manager)

### 1. Setup Backend (Server)

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

Start the backend server (runs on port 5000):

```bash
npm start
```

You should see:
> 🚀 Server running on http://localhost:5000
> 📂 Using file-based DB in .../data

### 2. Setup Frontend (Client)

Open a new terminal, navigate to the client directory, and install dependencies:

```bash
cd client
npm install
```

Start the development server:

```bash
npm run dev
```

Open your browser and visit the URL shown (usually `http://localhost:5173`).

---

## 🚀 Features

-   **CSV Data Import**: Drag-and-drop interface to upload user data in CSV format.
-   **Data Persistence**: Uses **NeDB**, an embedded persistent database (no external DB setup required).
-   **Modern UI/UX**: Premium interface built with TailwindCSS, featuring glassmorphism, smooth animations, and responsive design.
-   **Data Table**: Paginated view of imported users with configurable rows per page (10, 20, 50, 100).
-   **Robust Error Handling**: informative alerts for server connection issues or invalid files.

## 🛠️ Tech Stack

-   **Frontend**: React (Vite), TailwindCSS, Lucide React (Icons), React Hot Toast (Notifications), Axios.
-   **Backend**: Node.js, Express.js.
-   **Database**: NeDB (File-based, MongoDB-compatible API).
-   **File Handling**: Multer (Uploads), CSV-Parser (Processing).

## 📂 Project Structure

```
Import and Display Problem/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # FileUpload, UserTable
│   │   ├── App.jsx         # Main layout and logic
│   │   └── index.css       # Global styles & Tailwind config
├── server/                 # Node.js Backend
│   ├── data/               # Database storage (users.db)
│   ├── uploads/            # Temporary upload storage
│   ├── controllers/        # Logic for import and fetch
│   ├── models/             # Database schema/connection
│   └── server.js           # Entry point
└── us-500.csv              # Sample data file
```

## 📖 Usage Guide

1.  **Start Both Servers**: Ensure both `npm start` (in server) and `npm run dev` (in client) are running.
2.  **Import Data**:
    -   Click "Browse" or drag `us-500.csv` into the upload area.
    -   Click "Import Users".
    -   Wait for the "System Online" badge to confirm connection.
3.  **View Data**:
    -   The table below will populate with the imported data.
    -   Use the **Previous/Next** buttons to navigate pages.
    -   Use the **Rows per page** dropdown to change how many records you see.
4.  **Clear Data**:
    -   To reset the database, simply stop the server and delete the `server/data/users.db` file, then restart the server.

## 🔧 Troubleshooting

-   **"Server Unreachable" Error**: make sure the backend terminal is running and listening on port 5000.
-   **CORS Issues**: The server is configured to accept requests from localhost. Ensure you aren't using a different IP or proxy without updating `cors` settings in `server.js`.
