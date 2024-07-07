const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysqlroot',
    database: process.env.DB_NAME
})

// host: process.env.DB_ROOT,
// user: process.env.DB_USER,
// password: process.env.DB_PASS,
// database: process.env.DB_NAME

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database', err);
        return;
    }
    console.log('Connected to the database')
});

module.exports = connection;