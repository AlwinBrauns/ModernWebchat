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

app.post('/getmsgs', (req, res)=>{

    if(req.body.pw=="mysecretkeytogetdata"){
        pool.query('SELECT * FROM Messages', (error, results)=>{
            res.status(200).json(results.rows);
        });
    }else{
        res.status(403).json(forbidden);
    }
});


//NUR ZUM TESTEN, SPÄTER AUSSCHALTEN
app.get('/accounts', (req, res)=>{
    pool.query('SELECT * FROM Accounts', (error, results)=>{
        res.status(200).json(results.rows);
    });
});
app.get('/groups', (req, res)=>{
    pool.query('SELECT * FROM Groups', (error, results)=>{
        res.status(200).json(results.rows);
    });
});
app.get('/gruppenteilnehmer', (req, res)=>{
    pool.query('SELECT * FROM Gruppenteilnehmer', (error, results)=>{
        res.status(200).json(results.rows);
    });
});
app.get('/messages', (req, res)=>{
    pool.query('SELECT * FROM Messages', (error, results)=>{
        res.status(200).json(results.rows);
    });
});
// /\_/\_/\ NUR ZUM TESTN!!! SPÄTER LÖSCHEN _/\_/\_/\

app.listen(3001, _=>{
    console.log("[DB] läuft");
});