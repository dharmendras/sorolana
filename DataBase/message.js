const client = require('./connection.js')
const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');

const app = express();

app.listen(3300 , ()=> { 

    console.log("server is now listning at port 3300");
})
client.connect();

 app.get('/Message', (req , res) => { 

    client.query(`SELECT * FROM Transfer` ,(err , result) => { 
        if(!err) { 
            res.send(result.rows)
        }
    } );
    client.end;
 })
 

app.post('/Message', (req, res) => {
    const user = req.body;
    // console.log("========> line number 32 <========", user.name)
    let insertQuery = `insert into Transfer(  amount, token_address , token_chain , to_destination_chain , to_chain , fee) 
                       values( 1000 , 'NoP890ILKL', 123 , 'PILkV89B768Jj0Tio' , 678 , 200)`

    client.query(insertQuery, (err, result) => {
        if (!err) {
            res.send('Insertion was successful')
        }
        else { console.log(err.message) }
    })
    client.end;
})
//signature
app.get('/Signature', (req , res) => { 

    client.query(`SELECT * FROM signature` ,(err , result) => { 
        if(!err) { 
            res.send(result.rows)
        }
    } );
    client.end;
 })
app.post('/Signature' , (req , res) => { 
    let insertQuery = `insert into signature (signature) values('sign')`
    client.query(insertQuery , (err , result) => { 
        if(!err) { 
            res.send("Inserction successful")
        }
        else{ 
            console.log(err.message)
        }
    })
    client.end;
})