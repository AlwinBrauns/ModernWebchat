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
    let abfrage = `SELECT * FROM Accounts WHERE `;
    abfrage += `Username = '${req.body.username}' AND `;
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

app.post('/register', (req, res)=>{

    //Prüfen ob schon gibt
    let erfolgreich = true;
    let abfrage = `SELECT * FROM Accounts WHERE `;
    abfrage += `username = '${req.body.username}';`;
    pool.query(abfrage, (error, results)=>{
        if(error){
            console.log(error);
            res.status(500).json(internalerror);
            erfolgreich = false;
        }else{
            if(results.rowCount){
                //Account gibt es schon
                console.log(results);
                res.status(403).json(forbidden);
                erfolgreich = false;
            }
        }
        
        if(erfolgreich){
            abfrage = `INSERT INTO Accounts (Username, pw, bildpfad) `;
            abfrage += `VALUES ('${req.body.username}', `;
            abfrage += `'${req.body.pw}' , './imgs/default-avatar.png');`;
            pool.query(abfrage, (error,results)=>{
                if(results?.rowCount){
                    res.status(200).json(req.body);
                }
            });
        }
    });
});


app.listen(3001, _=>{
    console.log("[DB] läuft");
});