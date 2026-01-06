const User = require('../models/userModel');
const fs = require('fs');
const csv = require('csv-parser');

// Import Users from CSV
exports.importUsers = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a CSV file' });
  }

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        // Optional: Clear existing data logic if needed, but for now we append
        // To clear: await User.remove({}, { multi: true });
        
        // Insert data (NeDB insert can handle arrays)
        await User.insert(results);
        
        // Clean up the uploaded file
        fs.unlinkSync(req.file.path);

        res.status(200).json({ 
          message: 'Users imported successfully', 
          count: results.length 
        });
      } catch (error) {
        res.status(500).json({ message: 'Error importing users', error: error.message });
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
      totalUsers: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};
