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
    pool.query(`

        SELECT Messages.msg, Messages.datum, Messages.from_id, Accounts.username
        FROM Messages, Accounts
        WHERE Messages.togroup_id=$1 AND messages.from_id = accounts.id
        ORDER BY Messages.datum
        ;

    `,[req.body.group], (error, results)=>{
        if(error){
            res.status(500).json(internalerror);
            console.log(error);
        }else{
            res.status(200).json(results.rows);
        }
    });
});

app.post('/getgroups', (req, res)=>{
    pool.query(
        `
        SELECT 
        Groups.id,
        Groups.groupname
        FROM Gruppenteilnehmer INNER JOIN Groups 
        
        ON Gruppenteilnehmer.group_id = Groups.id
        
        WHERE account_id = $1;
        `,
        [req.body.userID], (error, results)=>{
            if(error){
                res.status(500).json(internalerror);
                console.log(error);
            }else{
                res.status(200).json(results.rows);
            }
        }
    )
});

app.post('/login', (req, res)=>{
    let abfrage = `SELECT * FROM Accounts WHERE `;
    abfrage += `Username = $1 AND `;
    abfrage += `pw = $2;`;

    pool.query(abfrage, [req.body.username,req.body.pw], (error, results)=>{
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
    abfrage += `username = $1;`;
    pool.query(abfrage, [req.body.username], (error, results)=>{
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
            abfrage += `VALUES ($1, `;
            abfrage += `$2 , './imgs/default-avatar.png');`;
            pool.query(abfrage, [req.body.username,req.body.pw], (error,results)=>{
                if(results?.rowCount){
                    console.log("[DB] Insert ein neuen Account");
                    //Abfrage um erstellten Account zu bekommen
                    abfrage = `SELECT * FROM Accounts `;
                    abfrage += `WHERE Username = $1;`;
                    pool.query(abfrage,[req.body.username], (error, results)=>{//in Gruppe default stecken
                        abfrage = `INSERT INTO Gruppenteilnehmer `;
                        abfrage += `( Group_ID, Account_ID ) `;
                        abfrage += `VALUES ( 1, $1 );`;
                        pool.query(abfrage, [results.rows[0].id], (error, results)=>{
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
    console.log(req.body.msg);
    let now = new Date();
    let abfrage = `INSERT INTO 
    Messages (msg, datum, ToGroup_ID, FROM_ID) `;
    abfrage += `VALUES (
    $1, 
    $2, 
    $3,
    $4
    );`;
    pool.query(abfrage,[req.body.msg,now,req.body.toID,req.body.fromID], (error, results)=>{
        if(!error){
            res.status(200).json({
                msg: req.body.msg,
                date: now,
                toID: req.body.toID,
                fromID: req.body.fromID
            });
        }else{
            console.log(error.message);
            res.status(500).json(internalerror);
        }
    });


});

app.post('/searchgroup', (req, res)=>{
    let group_id = req.body.groupID;
    let group_name = req.body.groupName?req.body.groupName:"1x2yzz18jgfkiejanc##NOT_SET";
    pool.query(`
        SELECT * FROM Groups WHERE id = $1 OR groupname = $2;
    `,[group_id, group_name], (error, result)=>{
        if(!error){
            if(result.rows[0])
            {
                res.status(200).json({
                    exist: true, 
                    groupID: result.rows[0].id,
                    groupName: result.rows[0].groupname
                });
            }else{
                res.status(200).json({
                    exist: false, 
                });
            }
        }else{
            console.log(error.message);
            res.status(500).json(internalerror);
        }
    });
});

app.post('/addtogroup', (req, res)=>{
    let group_id = req.body.groupID;
    let user_id = req.body.userID;
    pool.query(`
        SELECT * FROM Gruppenteilnehmer WHERE Group_ID = $1 AND Account_ID = $2
        `, [group_id, user_id], (error,result)=>{
            if(!error){
                if(result.rowCount == 0){ // WENN NOCH NICHT GIBT
                    pool.query(`
                    INSERT INTO Gruppenteilnehmer (
                        Group_ID,
                        Account_ID
                    ) VALUES (
                        $1,
                        $2
                    );
                    `, [group_id, user_id], (error, result)=>{
                        if(!error){
                            console.log(result);
                            res.status(200).json({
                                status: true,
                                info: 'added to group/room',
                            });
                        }else{
                            console.log(error.message);
                            res.status(500).json(internalerror);
                        }
                    });
                }else{
                    res.status(200).json({
                        status: false,
                        info: 'already in that group/room'
                    });
                }
            }else{
                console.log(error.message);
                res.status(500).json(internalerror);
            }
        });
    
});

app.listen(3001, _=>{
    console.log("[DB] läuft");
});