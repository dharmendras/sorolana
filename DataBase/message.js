// const client = require('./connection.js')
const gmpdbclient = require('./connection.js')

const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const app = require('./server.js')
const bodyParser = require('body-parser');
var cors = require('cors');
app.app.use(cors());

gmpdbclient.connect();


//message
app.app.use(bodyParser.urlencoded({ extended: false }));
app.app.use(bodyParser.json());

app.app.post('/Message',async (req, res) => {
    console.log("message id ", req.body);
    const { amount,from, to, toChain, transaction_hash, status, message} = req.body
    try {
        const _query = await gmpdbclient.query(
            `INSERT INTO message (amount,fromaddress, toaddress, tochain, transaction_hash, status, message_info) VALUES ($1, $2, $3, $4, $5, $6, $7)`,[amount , from, to, toChain,transaction_hash, status, message]
        );
        console.log("fullresponse---->",_query)
        res.status(201).send({
            message: "Message added successfully!"
        });
    } catch (error) {
        console.error('Error', error);
        res.status(500).send({
            message: "something went wrong"
        });
    }
})

app.app.get('/Message', (req, res) => {
    try {

        gmpdbclient.query(`SELECT * FROM message`, (err, result) => {
            if (!err) {
                let _pa = JSON.stringify(result.rows)
                let _str = JSON.parse(_pa)
                res.status(200).json({ data: _str })
                console.log("🚀 ~ file: message.js:50 ~ client.query ~ _str:", _str)
            }
        });
    } catch (error) {
        console.log(error);
    }
})


// app.app.get('/Message/:accAddress', (req, res) => {

//     let accountAddress = req.params.accAddress 
//     console.log("accountAddress--->", accountAddress)
//     try {
//         console.log("accountAddress2--->", accountAddress)
//         client.query(`SELECT * FROM message WHERE fromaddress = '${accountAddress}'`, (err, result) => {
//             if (!err) {
//                 // let _data = JSON.stringify(result.rows)
//                 // let _transactions = JSON.parse(_data)
//                 // res.status(200).json({ data: _transactions })
//                 console.log("acc transactions ----->:", result.rows)
//             }
//             console.log("error",err)
//         });
//         console.log("accountAddress3--->", accountAddress)


//     } catch (error) {
//         console.log(error);
//     }
//     console.log("accountAddress4--->", accountAddress)

// })

app.app.put('/Message/:userId', (req, res) => {
    let queryId = req.params.userId 
    console.log("userid--->", queryId)
    try {
        const { rows } = gmpdbclient.query(
            `UPDATE message SET status = 'success' where id = ${queryId}`
        );
        res.status(201).send({
            message: "Message updated successfully!",
        });
    } catch (error) {
        console.error('Error', error);
        res.status(500).send({
            message: "something went wrong"
        });
    }
})


//signature
function saveSignature(signature, publicKey) {

    app.app.post('/Signature', (req, res) => {
        try {
            const { rows } = client.query(
                "INSERT INTO signature (  signature , public_key , messageid) VALUES ($1 , $2 , $3)",
                [signature, publicKey, 3]
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
        const { mid } = req.params;
        const query = 'SELECT * FROM signature WHERE mid = $1';
        const result = await client.query(query, [mid]);
        res.json(result.rows[0]);
    } catch (error) {
        console.log("====>Error<=====", error);
    }
})

//module.exports = { saveMessage, saveSignature} 