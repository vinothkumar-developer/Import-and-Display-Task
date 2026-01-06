const Datastore = require('nedb-promises');
const path = require('path');

// Create a persistent database file
const dbFactory = (fileName) => Datastore.create({
  filename: path.join(__dirname, '..', 'data', fileName), 
  autoload: true,
  timestampData: true
});

const users = dbFactory('users.db');

module.exports = users;
