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
        try {
            const { rows } = client.query(
                "INSERT INTO test_message (message) VALUES ($1)",
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

        client.query(`SELECT * FROM test_message`, (err, result) => {
            if (!err) {
                res.send(result.rows)
            }
        });
        client.end;
    })


//signature
function saveSignature(signature, publicKey) {

    app.app.post('/Signature', (req, res) => {
        try {
            const { rows } = client.query(
                "INSERT INTO signature (mid , signature , public_key) VALUES ($1 , $2)",
                [1, signature, publicKey]
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



module.exports = { saveMessage, saveSignature} 