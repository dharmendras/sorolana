const client = require('./connection.js')
const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const app = require('./server.js')

client.connect();


//message
function saveMessage(message) {
    console.log("=======>save message<======", message)
   
    app.app.post('/Message', (req, res) => {
        console.log("message id " ,res );
        try {
            const { rows } = client.query(
                "INSERT INTO message (message) VALUES ($1)",
                [message]
            );
            res.status(201).send({
                message: "Message added successfully!",
                // body: {
                //   employee: { name, job_role, salary, birth, employee_registration },
                // },
            });
        } catch (error) {
            console.error('Error', error);
            res.status(500).send({
                message: "something went wrong"
            });
        }
    })
    client.end;

}



     app.app.get('/Message', (req, res) => {
        try {
            


        client.query(`SELECT * FROM message`, (err, result) => {
            if (!err) {
                let _pa=JSON.stringify(result.rows)
                let _str=JSON.parse(_pa)
                res.status(200).json({data:_str})
            }
        });
        client.end;
    } catch (error) {
            console.log(error);
    }
    })


//signature
function saveSignature(signature, publicKey) {

    app.app.post('/Signature', (req, res) => {
        try {
            const { rows } = client.query(
                "INSERT INTO signature (  signature , public_key , messageid) VALUES ($1 , $2 , $3)",
                [ signature, publicKey , 3]
            );
            res.status(201).send({
                message: "Signature  added successfully!",
                // body: {
                //   employee: { name, job_role, salary, birth, employee_registration },
                // },
            });
        } catch (error) {
            console.error('Error', error);
            res.status(500).send({
                message: "something went wrong"
            });
        }
    })
    client.end;
}

    app.app.get('/Signature', (req, res) => {

        client.query(`SELECT * FROM signature`, (err, result) => {
            if (!err) {
                res.send(result.rows)
            }
        });
        client.end;
    })
// get  signature by mid
    app.app.get('/Signature/:mid', async (req, res) => { 

        //client.query(`SELECT * FROM signature WHERE mid = $2` , )
        try {
            const {mid} = req.params;
            const query = 'SELECT * FROM signature WHERE mid = $1';
            const result = await client.query(query, [mid]);
            res.json(result.rows[0]);
        } catch (error) {
            console.log("====>Error<=====" , error);
        }
    })

module.exports = { saveMessage, saveSignature} 