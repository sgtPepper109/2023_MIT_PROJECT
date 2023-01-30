const express = require('express')
const mysql = require('mysql')
const bodyparser = require('body-parser')
const cors = require('cors')

require('dotenv').config()
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD
});

connection.connect();
const port = process.env.PORT || 8080;

const app = express() .use(cors()) .use(bodyparser.json());

function insert() {
    const train = document.getElementById('traininginput').value
    const test = document.getElementById('testinginput').value
    const val = document.getElementById('valinput').value
    console.log('javascript: ', train, test, val);
    // connection.query(
    //     'SELECT * FROM users',
    //     function (error, results, fields) {
    //         if (error) throw error;
    //         console.log('The solution is: ', results[0].solution);
    //     }
    // );
}

app.listen(port, () => { console.log(`Express server listening on port ${port}`); });