const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const userController = require("./controllers/userController");

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure data directory exists
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Middleware
app.use(cors());
app.use(express.json());

// Multer Setup for File Uploads
const upload = multer({ dest: "uploads/" });

// Routes
// 1. Import Users (POST)
app.post("/users/import", upload.single("file"), userController.importUsers);

// 2. Fetch Users (GET)
app.get("/users", userController.getUsers);

// 3. Clear All Users (DELETE)
app.delete("/users", userController.clearUsers);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📂 Using file-based DB in ${dataDir}`);
});
