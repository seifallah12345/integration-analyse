const mysql = require('mysql2/promise');

// MySQL connection configuration
const config = {
  host: 'localhost',
  user: 'root', // Default user for XAMPP MySQL
  password: '', // Leave password empty for XAMPP default setup
  database: 'desktop_app' // Replace with your database name
};

// Function to connect to MySQL and perform a query
async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection(config);
    console.log('Connected to the database');
    await connection.end();
  } catch (err) {
    console.error('Database connection failed: ', err);
    throw err; // Ensure the error is propagated
  }
}

async function findUser(email_phone, password) {
  let connection;
  try {
    connection = await mysql.createConnection(config);
    const [rows] = await connection.execute('SELECT * FROM users WHERE email_phone = ? AND password = ?', [email_phone, password]);
    return rows[0];
  } catch (err) {
    console.error('SQL error during findUser', err);
    throw err;
  } finally {
    if (connection) await connection.end();
  }
}

// New user functions
async function addUser(user) {
  const { email_phone, password } = user;
  let connection;
  try {
    connection = await mysql.createConnection(config);
    const [result] = await connection.execute('INSERT INTO users (email_phone, password) VALUES (?, ?)', [email_phone, password]);
    return result.affectedRows;
  } catch (err) {
    console.error('SQL error during addUser', err);
    throw err;
  } finally {
    if (connection) await connection.end();
  }
}

async function removeUser(email_phone) {
  let connection;
  try {
    connection = await mysql.createConnection(config);
    const [result] = await connection.execute('DELETE FROM users WHERE email_phone = ?', [email_phone]);
    return result.affectedRows;
  } catch (err) {
    console.error('SQL error during removeUser', err);
    throw err;
  } finally {
    if (connection) await connection.end();
  }
}

async function editUser(user) {
  const { email_phone, password } = user;
  let connection;
  try {
    connection = await mysql.createConnection(config);
    const [result] = await connection.execute('UPDATE users SET password = ? WHERE email_phone = ?', [password, email_phone]);
    return result.affectedRows;
  } catch (err) {
    console.error('SQL error during editUser', err);
    throw err;
  } finally {
    if (connection) await connection.end();
  }
}

async function getAllUsers() {
  let connection;
  try {
    connection = await mysql.createConnection(config);
    const [rows] = await connection.execute('SELECT * FROM users');
    console.log('Fetched users: ', rows); // Log the fetched users
    return rows;
  } catch (err) {
    console.error('SQL error during getAllUsers', err);
    throw err;
  } finally {
    if (connection) await connection.end();
  }
}

// Plant functions
async function findPlantById(plant_id) {
  let connection;
  try {
    connection = await mysql.createConnection(config);
    const [rows] = await connection.execute('SELECT * FROM plants WHERE plant_id = ?', [plant_id]);
    return rows[0];
  } catch (err) {
    console.error('SQL error during findPlantById', err);
    throw err;
  } finally {
    if (connection) await connection.end();
  }
}

async function addPlant(plant) {
  const { name, plant_id, provenance, description, stage, entreposage, status } = plant;
  let connection;
  try {
    connection = await mysql.createConnection(config);
    const [result] = await connection.execute('INSERT INTO plants (name, plant_id, provenance, description, stage, entreposage, status) VALUES (?, ?, ?, ?, ?, ?, ?)', [name, plant_id, provenance, description, stage, entreposage, status]);
    return result.affectedRows;
  } catch (err) {
    console.error('SQL error during addPlant', err);
    throw err;
  } finally {
    if (connection) await connection.end();
  }
}

async function removePlant(plant_id) {
  let connection;
  try {
    connection = await mysql.createConnection(config);
    const [result] = await connection.execute('DELETE FROM plants WHERE plant_id = ?', [plant_id]);
    return result.affectedRows;
  } catch (err) {
    console.error('SQL error during removePlant', err);
    throw err;
  } finally {
    if (connection) await connection.end();
  }
}

async function editPlant(plant) {
  const { name, plant_id, provenance, description, stage, entreposage, status } = plant;
  let connection;
  try {
    connection = await mysql.createConnection(config);
    const [result] = await connection.execute('UPDATE plants SET name = ?, provenance = ?, description = ?, stage = ?, entreposage = ?, status = ? WHERE plant_id = ?', [name, provenance, description, stage, entreposage, status, plant_id]);
    return result.affectedRows;
  } catch (err) {
    console.error('SQL error during editPlant', err);
    throw err;
  } finally {
    if (connection) await connection.end();
  }
}

async function getAllPlants() {
  let connection;
  try {
    connection = await mysql.createConnection(config);
    const [rows] = await connection.execute('SELECT * FROM plants');
    console.log('Fetched plants: ', rows); // Log the fetched plants
    return rows;
  } catch (err) {
    console.error('SQL error during getAllPlants', err);
    throw err;
  } finally {
    if (connection) await connection.end();
  }
}

module.exports = {
  connectToDatabase,
  findUser,
  addUser,
  removeUser,
  editUser,
  getAllUsers,
  findPlantById,
  addPlant,
  removePlant,
  editPlant,
  getAllPlants
};
