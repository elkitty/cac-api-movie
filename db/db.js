// Cargar las variables de entorno desde el archivo .env
require("dotenv").config();
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // Ajusta este valor según tus necesidades
  queueLimit: 0
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database", err);
    return;
  }
  console.log("Connected to the database");
});

module.exports = connection;
