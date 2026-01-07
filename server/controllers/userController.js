const UserModel = require("../models/userModel");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

// Get the User database instance
let User = UserModel;

// Import Users from CSV
exports.importUsers = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Please upload a CSV file" });
  }

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      try {
        // Optional: Clear existing data logic if needed, but for now we append
        // To clear: await User.remove({}, { multi: true });

        // Insert data - NeDB insert handles arrays by inserting each document
        // If results is empty, skip insertion
        if (results.length > 0) {
          // Insert all documents at once (NeDB supports array insertion)
          await User.insert(results);
        }

        // Clean up the uploaded file
        fs.unlinkSync(req.file.path);

        res.status(200).json({
          message: "Users imported successfully",
          count: results.length,
        });
      } catch (error) {
        res
          .status(500)
          .json({ message: "Error importing users", error: error.message });
      }
    });
};

// Get Users with Pagination
exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // NeDB Promises API
    const users = await User.find({})
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by newest first

    const total = await User.count({});

    res.status(200).json({
      users,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

// Clear All Users from Database
exports.clearUsers = async (req, res) => {
  try {
    // Get count before deletion
    const totalBefore = await User.count({});
    
    // Use NeDB's remove method with multi: true to delete all documents
    // The empty query {} matches all documents
    const numRemoved = await User.remove({}, { multi: true });
    
    // Double check that the database is compacted/persisted
    // (NeDB normally appends to the file, so a compaction might be needed to shrink file size, 
    // but for functionality, remove is sufficient. If persistent datastore is used, it auto-appends deletions)
    
    // For NeDB promises, remove returns the number of documents removed
    
    res.status(200).json({
      message: "Database cleared successfully",
      removedCount: numRemoved,
      totalBefore: totalBefore,
      totalAfter: 0,
    });
  } catch (error) {
    console.error("[Clear DB] Error clearing users:", error);
    res
      .status(500)
      .json({ message: "Error clearing users", error: error.message });
  }
};
