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
    //TODO: WHERE klausel Gruppe mit berechneten feldern: username und bildpfad
    pool.query(`

        SELECT Messages.msg, Messages.datum, Messages.from_id, Accounts.username
        FROM Messages, Accounts
        WHERE Messages.togroup_id=${req.body.group} AND messages.from_id = accounts.id
        ORDER BY Messages.datum
        ;

    `, (error, results)=>{
        if(error){
            res.status(500).json(internalerror);
            console.log(error);
        }else{
            res.status(200).json(results.rows);
        }
    });
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
                    console.log("[DB] Insert ein neuen Account");
                    //Abfrage um erstellten Account zu bekommen
                    abfrage = `SELECT * FROM Accounts `;
                    abfrage += `WHERE Username = '${req.body.username}';`;
                    pool.query(abfrage, (error, results)=>{//in Gruppe default stecken
                        abfrage = `INSERT INTO Gruppenteilnehmer `;
                        abfrage += `( Group_ID, Account_ID ) `;
                        abfrage += `VALUES ( 1, ${results.rows[0].id} );`;
                        pool.query(abfrage, (error, results)=>{
                            if(!error)
                            console.log("[DB] Nutzer zur default gruppe hinzugefügt");
                        });
                        res.status(200).json(results.rows);
                        
                    });
                }
            });
        }
    });
});

app.post('/message', (req, res)=>{
    let now = new Date();
    let abfrage = `INSERT INTO 
    Messages (msg, datum, ToGroup_ID, FROM_ID) `;
    abfrage += `VALUES (
    '${req.body.msg}', 
    $1, 
    ${req.body.toID},
    ${req.body.fromID} 
    );`;
    pool.query(abfrage,[now], (error, results)=>{
        if(!error){
            res.status(200).json({
                msg: req.body.msg,
                date: now,
                toID: req.body.toID,
                fromID: req.body.fromID
            });
        }
    });


});

app.listen(3001, _=>{
    console.log("[DB] läuft");
});