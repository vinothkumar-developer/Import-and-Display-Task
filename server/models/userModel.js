const Datastore = require('nedb-promises');
const path = require('path');

// Create a persistent database file
const dbFactory = (fileName) => Datastore.create({
  filename: path.join(__dirname, '..', 'data', fileName), 
  autoload: true,
  timestampData: true
});

let users = dbFactory('users.db');

// Function to reload the database (useful after file deletion)
const reloadDatabase = () => {
  users = dbFactory('users.db');
  return users;
};

module.exports = users;
module.exports.reload = reloadDatabase;
