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

var forbidden = {
    error: "403 Forbidden",
}

var notfound = {
    error: "404 Not Found",
}

var internalerror = {
    error: "500 Internal Error",
}

app.post('/getmsgs', (req, res)=>{
    if(req.body.pw=="mysecretkeytogetdata"){
        pool.query('SELECT * FROM Messages', (error, results)=>{
            if(error){
                res.status(500).json(internalerror);
                console.log(error);
            }else{
                res.status(200).json(results.rows);
            }
        });
    }else{
        res.status(403).json(forbidden);
    }
});

app.post('/login', (req, res)=>{
    g
    let abfrage = `SELECT * FROM Accounts WHERE `;
    abfrage += `Username = '${req.body.Username}' AND `;
    abfrage += `pw = '${req.body.pw}';`;

    pool.query(abfrage, (error, results)=>{
        if(error){
            res.status(500).json(internalerror);
            console.log(error);
        }else{
            if(results.rowCount){
                res.status(200).json(results.rows);
            }else{
                res.status(404).json(notfound);
            }
        }
    });
    
});


app.listen(3001, _=>{
    console.log("[DB] läuft");
});