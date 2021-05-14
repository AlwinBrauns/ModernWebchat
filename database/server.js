const express = require('express');
const app = express();

const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'webchat',
    password: 'password',
    port: 3100
});

app.use(express.json());

app.get('/test', (req, res)=>{
    pool.query('SELECT * FROM Accounts', (error, results)=>{
        res.status(200).json(results.rows);
    });
});

app.listen(3001, _=>{
    console.log("[DB] läuft");
});