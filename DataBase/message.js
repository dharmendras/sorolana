// const client = require('./connection.js')
const gmpdbclient = require("./connection.js");

const express = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");
const app = require("./server.js");
const bodyParser = require("body-parser");
var cors = require("cors");
app.app.use(cors());

gmpdbclient.connect();

//message
app.app.use(bodyParser.urlencoded({ extended: false }));
app.app.use(bodyParser.json());

app.app.post("/Message", async (req, res) => {
  console.log("🚀 ~ file: message.js:19 ~ app.app.post ~ res:", res);
  console.log("message id ", req.body);
  const {
    amount,
    from,
    receiver,
    destination_chain_id,
    date,
    transaction_hash,
    status,
    message,
    queue_id,
  } = req.body;
  try {
    const _query = await gmpdbclient.query(
      `INSERT INTO message (amount,fromaddress, toaddress, tochain, date, transaction_hash, status, message_info, queue_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [
        amount,
        from,
        receiver,
        destination_chain_id,
        date,
        transaction_hash,
        status,
        message,
        queue_id,
      ]
    );
    console.log("fullresponse id aa gyi hai---->", _query);
    res.status(201).send({
      message: "Message added successfully!",
      row_id: _query.rows[0].id,
    });
  } catch (error) {
    console.error("Error", error);
    res.status(500).send({
      message: "L44 something went wrong",
    });
  }
});

// Post request for the table message_queue, which includes counter
app.app.post("/message_queue", async (req, res) => {
//  console.log("🚀 ~ file: message.js:50 ~ app.app.post ~ res:", res.data.body)
  console.log("🚀 ~ file: message.js:40 ~ app.app.post ~ req:", req.body);
  const {
    amount,
    from,
    receiver,
    destination_chain_id,
    date,
    transaction_hash,
    status,
    message,
    queue_id,
    receiver_pda,
  } = req.body;
  try {
    const _query = await gmpdbclient.query(
      `INSERT INTO message_queue (amount,from_address, receiver, destination_chain_id, transaction_hash, date, status, message_info, queue_id, receiver_pda) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        amount,
        from,
        receiver,
        destination_chain_id,
        transaction_hash,
        date,
        status,
        message,
        queue_id,
        receiver_pda,
      ]
    );
    console.log("fullresponse---->", _query);
    res.status(201).send({
      message: "Message added successfully!",
    });
  } catch (error) {
    console.error("Error", error);
    res.status(500).send({
      message: "something went wrong",
    });
  }
});

// Get request for the table message_queue, which includes counter
app.app.get("/message_queue", (req, res) => {
  try {
    gmpdbclient.query(`SELECT * FROM message_queue`, (err, result) => {
      if (!err) {
        let _pa = JSON.stringify(result.rows);
        let _str = JSON.parse(_pa);
        res.status(200).json({ data: _str });
        console.log("🚀 ~ file: message.js:50 ~ client.query ~ _str:", _str);
      }
    });
  } catch (error) {
    console.log(error);
  }
});

// Delet request for the table message_queue, which includes counter of claimed msg
app.app.delete("/message_queue/:receiver_pda", (req, res) => {
  let receiverPda = req.params.receiver_pda;
  const { queue_id } = req.body;
  console.log(
    "🚀 ~ file: message.js:102 ~ app.app.delete ~ req.body:",
    req.body
  );
  console.log("🚀 ~ file: message.js:99 ~ app.app.get ~ userPda:", receiverPda);
  try {
    // let qry = `SELECT queue_id FROM message_queue WHERE receiver_pda = '${receiverPda}'`;
    let qry = `DELETE FROM message_queue WHERE receiver_pda = '${receiverPda}' and queue_id = '${queue_id}'`;
    console.log("🚀 ~ file: message.js:103 ~ app.app.get ~ qry:", qry);
    gmpdbclient.query(qry, (err, result) => {
      if (!err) {
        let rows = result;
        console.log(
          "🚀 ~ file: message.js:105 ~ gmpdbclient.query ~ rows:",
          rows
        );
        res
          .status(200)
          .json({ message: "Message deleted from the table successfully!!" });
      }
      console.log("🚀 ~ file: message.js:106 ~ app.app.get ~ err:", err);
    });
  } catch (error) {
    console.error("Error", error);
    res.status(500).send({
      message: "something went wrong",
    });
  }
});
// Get request for the table message_queue, which includes counter
app.app.get("/message_queue/:receiver_pda", (req, res) => {
  let receiverPda = req.params.receiver_pda;
  console.log("🚀 ~ file: message.js:99 ~ app.app.get ~ userPda:", receiverPda);
  try {
    let qry = `SELECT * FROM message_queue WHERE receiver_pda = '${receiverPda}' ORDER BY queue_id;`;
    console.log("🚀 ~ file: message.js:103 ~ app.app.get ~ qry:", qry);
    gmpdbclient.query(qry, (err, result) => {
      if (!err) {
        let rows = result.rows;
        console.log(
          "🚀 ~ file: message.js:105 ~ gmpdbclient.query ~ rows:",
          rows.length
        );
        res.status(200).json({ data: rows });
      }
      console.log("🚀 ~ file: message.js:106 ~ app.app.get ~ err:", err);
    });
    // const { rows } = gmpdbclient.query(
    //   `SELECT counters FROM message_queue WHERE userpda = ${userPda}`
    // );
    // res.status(201).send({
    //   message: "Message updated successfully!",
    // });
  } catch (error) {
    console.error("Error", error);
    res.status(500).send({
      message: "something went wrong",
    });
  }
});

// Insert new user details into the user_counters table
app.app.post("/userCounter", async (req, res) => {
  const { receiver, queue_id } = req.body;

  try {
    const _query = await gmpdbclient.query(
      `INSERT INTO user_counters (receiver, queue_id) VALUES ($1, $2)`,
      [receiver, queue_id]
    );
    console.log("🚀 ~ file: message.js:140 ~ app.app.post ~ _query:", _query);
    res.status(201).send({
      message: "receiver details added successfully!",
    });
  } catch (error) {
    res.status(500).send({
      message: "something went wrong",
    });
  }
});

// Get request for the table message_queue, which includes counter
app.app.get("/userCounter/:receiver_pda", (req, res) => {
  let receiverPda = req.params.receiver_pda;
  console.log("🚀 ~ file: message.js:99 ~ app.app.get ~ userPda:", receiverPda);
  try {
    let qry = `SELECT queue_id FROM user_counters WHERE receiver = '${receiverPda}'`;
    console.log("🚀 ~ file: message.js:103 ~ app.app.get ~ qry:", qry);
    gmpdbclient.query(qry, (err, result) => {
      if (!err) {
        let rows = result.rows;
        console.log(
          "🚀 ~ file: message.js:160 ~ gmpdbclient.query ~ rows:",
          rows
        );
        res.status(200).json(rows);
      } else if (err == `error: column "receiver" does not exist`) {
        res.status(502).send({
          message: "Receiver not found",
        });
      } else {
        console.log("🚀 ~ file: message.js:106 ~ app.app.get ~ err:", err);
      }
    });
  } catch (error) {
    res.status(500).send({
      message: "something went wrong",
    });
  }
});

app.app.put("/userCounter/:receiver", (req, res) => {
  let receiverPda = req.params.receiver;
  const { queue_id } = req.body;
  console.log("userid--->", receiverPda);
  try {
    let query = `UPDATE user_counters SET queue_id = ${queue_id} where receiver = '${receiverPda}'`;
    console.log("🚀 ~ file: message.js:182 ~ app.app.put ~ query:", query);
    const { rows } = gmpdbclient.query(query);
    res.status(201).send({
      message: "QueueId updated successfully!",
    });
  } catch (error) {
    console.error("Error", error);
    res.status(500).send({
      message: "something went wrong",
    });
  }
});

app.app.get("/Message", (req, res) => {
  try {
    gmpdbclient.query(`SELECT * FROM message`, (err, result) => {
      if (!err) {
        let _pa = JSON.stringify(result.rows);
        let _str = JSON.parse(_pa);
        res.status(200).json({ data: _str });
        console.log("🚀 ~ file: message.js:50 ~ client.query ~ _str:", _str);
      }
    });
  } catch (error) {
    console.log(error);
  }
});

app.app.get("/Message/:userAddress", (req, res) => {
  let accountAddress = req.params.userAddress;
  try {
    gmpdbclient.query(
      `SELECT * FROM message WHERE toaddress = '${accountAddress}' and status = 'pending'`,
      (err, result) => {
        if (!err) {
          let _data = JSON.stringify(result.rows);
          let _transactions = JSON.parse(_data);
          res.status(200).json({ data: _transactions });
        }
        console.log("error", err);
      }
    );
  } catch (error) {
    console.log(error);
  }
  console.log("accountAddress4--->", accountAddress);
});

app.app.put("/Message/:receiver", (req, res) => {
  const { queue_id } = req.body;
  let receiver = req.params.receiver;
  console.log("userid--->", receiver);
  try {
    const { rows } = gmpdbclient.query(
      `UPDATE message SET status = 'success' WHERE receiver = '${receiver}' and queue_id = '${queue_id}'`
    );
    res.status(201).send({
      message: "Message updated successfully!",
    });
  } catch (error) {
    console.error("Error", error);
    res.status(500).send({
      message: "something went wrong",
    });
  }
});

// Post req to add signatures and the pubkey into the signature table
app.app.post("/Signature", (req, res) => {
  try {
    let { validator_sig, validator_pkey, message_id } = req.body;
    const { rows } = gmpdbclient.query(
      "INSERT INTO signature (  validator_sign , public_key, message_id) VALUES ($1 , $2, $3)",
      [validator_sig, validator_pkey, message_id]
    );
    res.status(201).send({
      message: "Signature  added successfully!",
    });
  } catch (error) {
    console.log("🚀 ~ file: message.js:310 ~ app.app.post ~ error:", error);
    console.error("Error", error);
    res.status(500).send({
      message: "something went wrong",
    });
  }
});

//signature
function saveSignature(signature, publicKey) {
  app.app.post("/Signature", (req, res) => {
    try {
      const { rows } = gmpdbclient.query(
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
      console.error("Error", error);
      res.status(500).send({
        message: "something went wrong",
      });
    }
  });
  client.end;
}

app.app.get("/Signature", (req, res) => {
  gmpdbclient.query(`SELECT * FROM signature`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  client.end;
});
// get  signature by mid
app.app.get("/Signature/:mid", async (req, res) => {
  //client.query(`SELECT * FROM signature WHERE mid = $2` , )
  try {
    const { mid } = req.params;
    const query = "SELECT * FROM signature WHERE mid = $1";
    const result = await gmpdbclient.query(query, [mid]);
    res.json(result.rows[0]);
  } catch (error) {
    console.log("====>Error<=====", error);
  }
});

//module.exports = { saveMessage, saveSignature}
