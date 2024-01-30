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

app.app.post("/gmp/Message", async (req, res) => {
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
    is_claimed
  } = req.body;
  try {
    const _query = await gmpdbclient.query(
      `INSERT INTO message (amount,fromaddress, toaddress, tochain, date, transaction_hash, status, message_info, queue_id, is_claimed) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
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
        is_claimed
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
app.app.get("/gmp/FullMessage", (req, res) => {
  console.log("ht");
  try {
    gmpdbclient.query(
      `SELECT * FROM message JOIN signature on message.id = signature.message_id`,
      (err, result) => {
        if (!err) {
          let _pa = JSON.stringify(result.rows);
          let _str = JSON.parse(_pa);
          res.status(200).json({ data: _str });
          console.log("🚀 ~ file: message.js:50 ~ client.query ~ _str:", _str);
        }
        console.log("🚀 ~ file: message.js:64 ~ gmpdbclient.query ~ err:", err);
      }
    );
  } catch (error) {
    console.log("🚀 ~ file: message.js:70 ~ app.app.get ~ error:", error);
    console.log(error);
  }
});
// Post request for the table message_queue, which includes counter
app.app.post("/gmp/message_queue", async (req, res) => {
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
app.app.get("/gmp/message_queue", (req, res) => {
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
// queue id

// Delet request for the table message_queue, which includes counter of claimed msg
app.app.delete("/gmp/message_queue/:receiver", (req, res) => {
  let receiver = req.params.receiver;
  const { queue_id } = req.body;
  console.log(
    "🚀 ~ file: message.js:102 ~ app.app.delete ~ req.body:",
    req.body
  );
  console.log("🚀 ~ file: message.js:99 ~ app.app.get ~ userPda:", receiver);
  try {
    // let qry = `SELECT queue_id FROM message_queue WHERE receiver_pda = '${receiverPda}'`;
    let qry = `DELETE FROM message_queue WHERE receiver = '${receiver}' and queue_id = '${queue_id}'`;
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
// get pending
app.app.get("/gmp/CheckIsPending/:receiver", (req, res) => {
  let receiver = req.params.receiver;
  console.log("🚀 ~ file: message.js:99 ~ app.app.get ~ userPda:", receiver);
  try {
    let qry = `SELECT * FROM message_queue WHERE receiver = '${receiver}'`;
    console.log("🚀 ~ file: message.js:103 ~ app.app.get ~ qry:", qry);
    gmpdbclient.query(qry, (err, result) => {
      if (!err) {
        let rows = result.rows;
        console.log(
          "🚀 ~ file: message.js:105 ~ gmpdbclient.query ~ rows:",
          rows.length
        );
        if (rows.length > 0) {
          res.status(200).json(rows);
        }
        else {
          res.status(200).json(rows.length);
        }
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
// Get request for the table message_queue, which includes counter
app.app.get("/gmp/message_queue/:receiver", (req, res) => {
  let receiver = req.params.receiver;
  console.log("🚀 ~ file: message.js:99 ~ app.app.get ~ userPda:", receiver);
  try {
    let qry = `SELECT * FROM message_queue WHERE receiver = '${receiver}' ORDER BY queue_id;`;
    console.log("🚀 ~ file: message.js:103 ~ app.app.get ~ qry:", qry);
    gmpdbclient.query(qry, (err, result) => {
      if (!err) {
        let rows = result.rows;
        console.log(
          "🚀 ~ file: message.js:105 ~ gmpdbclient.query ~ rows:",
          rows.length
        );
        if (rows.length > 0) {
          res.status(200).json({ data: rows });
        } else {
          res.status(200).json({ data: 0 });
        }
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
// queue_id 
app.app.get("/gmp/CheckQueue_IdInmessage_queue/:receiver", (req, res) => {
  let receiver = req.params.receiver;
  console.log("🚀 ~ file: message.js:99 ~ app.app.get ~ userPda:", receiver);
  try {
    let qry = `SELECT queue_id FROM message_queue WHERE receiver = '${receiver}'`;
    console.log("🚀 ~ file: message.js:103 ~ app.app.get ~ qry:", qry);
    gmpdbclient.query(qry, (err, result) => {
      if (!err) {
        let rows = result.rows;
        console.log(
          "🚀 ~ file: message.js:105 ~ gmpdbclient.query ~ rows:",
          rows.length
        );
        if (rows.length > 0) {
          //isqueue_id_response.data[0].queue_id
          // console.log("🚀 ~ gmpdbclient.query ~ rows:", rows)

          res.status(200).json(rows);
        } else {
          res.status(200).json({ data: 0 });
        }
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
app.app.post("/gmp/userCounter", async (req, res) => {
  const { receiver, queue_id } = req.body;

  try {
    const _query = await gmpdbclient.query(
      `INSERT INTO user_counters (receiver, queue_id) VALUES ($1, $2)`,
      [receiver, queue_id]
    );
    // console.log("🚀 ~ file: message.js:140 ~ app.app.post ~ _query:", _query);
    res.status(201).send({
      message: "receiver details added successfully!",
    });
  } catch (error) {
    res.status(500).send({
      message: "something went wrong",
    });
  }
});
app.app.get("/gmp/CheckTransactionHashInMessage_queue/:transaction_id", (req, res) => {
  let transaction_id = req.params.transaction_id;
  console.log("🚀 ~ app.app.get ~ transaction_id:", transaction_id)


  let query = `SELECT * FROM message_queue WHERE transaction_hash = '${transaction_id}'`;
  gmpdbclient.query(query, (err, result) => {
    if (err) {

      console.error('Error executing query', err);
    } else {
      let rows = result.rows;

      res.status(200).json(rows);

      //res.status(200).json(result.rows)
      //console.log('Query result:', rows);
    }

    // Disconnect the client
    // gmpdbclient.end();
  });
})
app.app.get("/gmp/CheckTransactionHashInMessage/:transaction_id", (req, res) => {
  let transaction_id = req.params.transaction_id;
  console.log("🚀 ~ app.app.get ~ transaction_id:", transaction_id)


  let query = `SELECT * FROM message WHERE transaction_hash = '${transaction_id}'`;
  gmpdbclient.query(query, (err, result) => {
    if (err) {
      res.status(200).json(0);

      console.error('Error executing query', err);
    } else {
      let rows = result.rows;

      res.status(200).json(rows);

      //res.status(200).json(result.rows)
      //console.log('Query result:', rows);
    }

    // Disconnect the client
    // gmpdbclient.end();
  });
})
// Get request for the table message_queue, which includes counter
app.app.get("/gmp/userCounter/:receiver_pda", (req, res) => {
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
// get message id base in counter
app.app.get("/gmp/getMessageIDFromMessage/:userCounter", (req, res) => {
  let userCounter = req.params.userCounter;
  console.log("🚀 ~ file: message.js:99 ~ app.app.get ~ userPda:", userCounter);
  try {
    let qry = `SELECT id FROM message WHERE queue_id = '${userCounter}'`;
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
app.app.put("/gmp/userCounter/:receiver", (req, res) => {
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

app.app.get("/gmp/Message", (req, res) => {
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
// check is claimed yes
app.app.get("/gmp/CheckIsClaimedIsYesInMessage/:userAddress", (req, res) => {
  let accountAddress = req.params.userAddress;
  try {
    gmpdbclient.query(
      `SELECT is_claimed FROM message WHERE toaddress = '${accountAddress}' and is_claimed = 'YES'`,
      (err, result) => {
        if (!err) {
          let _data = JSON.stringify(result.rows);
          let _transactions = JSON.parse(_data);
          //  res.status(200).json(result.rows);
          // console.log("🚀 ~ app.app.get ~ result:", result.rows[0].is_claimed)
          console.log("🚀 ~ app.app.get ~ result length:", result.rows.length);

          if (result.rows.length === 0) {
            res.status(200).json('NO');
          } else {
            res.status(200).json('YES');
          }
        }
        console.log("error", err);
      }
    );
  } catch (error) {
    console.log(error);
  }
});
//get transaction for repeating event's
app.app.get("/gmp/CheckTxHashForRepeatingEvents/:txHash", (req, res) => {
  let txHash = req.params.txHash;
  //console.log("🚀 ~ app.app.get ~ txHash:", txHash)
  try {
    gmpdbclient.query(
      `SELECT transaction_hash FROM message WHERE transaction_hash = '${txHash}'`,
      (err, result) => {
        if (!err) {
          let _data = JSON.stringify(result.rows);
          let _transactions = JSON.parse(_data);
          //  res.status(200).json(result.rows);
          // console.log("🚀 ~ app.app.get ~ result:", result.rows[0].is_claimed)
          //  console.log("🚀 ~ app.app.get ~ result length:", result.rows.length);

          if (result.rows.length === 0) {
            res.status(200).json('NO');
          } else {
            res.status(200).json('YES');
          }
        }
        console.log("error", err);
      }
    );
  } catch (error) {
    console.log(error);
  }
});
//get transaction for repeating event's from message_queue
app.app.get("/gmp/CheckTxHashForRepeatingEventsInMessageQueue/:txHash", (req, res) => {
  let txHash = req.params.txHash;
  console.log("🚀 ~ app.app.get ~ txHash:", txHash)
  try {
    gmpdbclient.query(
      `SELECT transaction_hash FROM message_queue WHERE transaction_hash = '${txHash}'`,
      (err, result) => {
        if (!err) {
          let _data = JSON.stringify(result.rows);
          let _transactions = JSON.parse(_data);
          //  res.status(200).json(result.rows);
          // console.log("🚀 ~ app.app.get ~ result:", result.rows[0].is_claimed)
          // console.log("🚀 ~ app.app.get ~ result length:", result.rows.length);

          if (result.rows.length === 0) {
            res.status(200).json('NO');
          } else {
            res.status(200).json('YES');
          }
        }
        console.log("error", err);
      }
    );
  } catch (error) {
    console.log(error);
  }
});
app.app.get("/gmp/CheckIsClaimedInMessage/:userAddress", (req, res) => {
  let accountAddress = req.params.userAddress;
  try {
    gmpdbclient.query(
      `SELECT is_claimed FROM message WHERE toaddress = '${accountAddress}' and is_claimed = 'NO'`,
      (err, result) => {
        if (!err) {
          let _data = JSON.stringify(result.rows);
          let _transactions = JSON.parse(_data);
          res.status(200).json(result.rows);
        }
        console.log("error", err);
      }
    );
  } catch (error) {
    console.log(error);
  }
  console.log("accountAddress4--->", accountAddress);
});
app.app.get("/gmp/Message/:userAddress", (req, res) => {
  let accountAddress = req.params.userAddress;
  try {
    gmpdbclient.query(
      `SELECT * FROM message WHERE toaddress = '${accountAddress}' and is_claimed = 'NO'`,
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
// get queue_id 
app.app.get("/gmp/GetQueue_Id_Message/:queue_id", (req, res) => {
  let queue_id = req.params.queue_id;
  try {
    gmpdbclient.query(
      `SELECT * FROM message WHERE queue_id = '${queue_id}'`,
      (err, result) => {
        if (!err) {
          let _data = JSON.stringify(result.rows);
          let _transactions = JSON.parse(_data);
          res.status(200).json(result.rows);
        }
        console.log("error", err);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

app.app.put("/gmp/Message/:receiver", (req, res) => {
  const { queue_id } = req.body;
  let receiver = req.params.receiver;
  console.log("userid--->", receiver);
  try {
    const { rows } = gmpdbclient.query(
      `UPDATE message SET is_claimed = 'YES' WHERE toaddress = '${receiver}' and queue_id = '${queue_id}'`
    );
    console.log("🚀 ~ file: message.js:313 ~ app.app.put ~ rows:", rows);
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
app.app.put("/gmp/AppendSignature", async (req, res) => {
  try {
    const { validator_sig, validator_pkey, message_id } = req.body;
    console.log("🚀 ~ app.app.put ~ message_id:", message_id);
    console.log("🚀 ~ app.app.put ~ validator_pkey:", validator_pkey[0]);
    console.log("🚀 ~ app.app.put ~ validator_sig:", validator_sig[0]);

    const query = `
      UPDATE signature 
      SET 
        validator_sign = ARRAY_APPEND(validator_sign, $1),
        public_key = ARRAY_APPEND(public_key, $2)
      WHERE message_id = $3
      RETURNING *;
    `;

    const values = [validator_sig[0], validator_pkey[0], message_id];

    const { rows } = await gmpdbclient.query(query, values);
    console.log("🚀 ~ app.app.put ~ rows:", rows);

    res.status(201).send({
      message: "Message updated successfully!",
    });

  } catch (error) {
    console.error("Error", error);
    res.status(500).send({
      message: "Something went wrong",
    });
  }
});


// Post req to add signatures and the pubkey into the signature table
app.app.post("/gmp/Signature", (req, res) => {
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

app.app.get("/gmp/Signature", (req, res) => {
  gmpdbclient.query(`SELECT * FROM signature`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  client.end;
});
// get  signature by mid
app.app.get("/gmp/Signature/:mid", async (req, res) => {
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
//get mid with transaction hash txHash
app.app.get("/gmp/Id_Message/:txHash", (req, res) => {
  let txHash = req.params.txHash;
  console.log("🚀 ~ app.get ~ txHash:", txHash);
  try {
    gmpdbclient.query(
      `SELECT * FROM message WHERE transaction_hash = '${txHash}'`,
      (err, result) => {
        if (!err) {
          let _data = JSON.stringify(result.rows);
          let _transactions = JSON.parse(_data);
          res.status(200).json(result.rows);
        }
        console.log("error", err);
      }
    );
  } catch (error) {
    console.log(error);
  }
});
//GET public from signature table
app.app.get("/gmp/getPubkeyFromSignature/:id", (req, res) => {
  let id = req.params.id;
  console.log("🚀 ~ app.app.get ~ id:", id)
  try {
    gmpdbclient.query(
      `SELECT * FROM signature WHERE message_id = '${id}'`,
      (err, result) => {
        if (!err) {
          let _data = JSON.stringify(result.rows);
          let _transactions = JSON.parse(_data);
          res.status(200).json(result.rows);
        }
        console.log("error", err);
      }
    );
  } catch (error) {
    console.log(error);
  }
});
//module.exports = { saveMessage, saveSignature}
