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
//  console.log("🚀 ~ file: message.js:19 ~ app.app.post ~ res:", res)
  console.log("message id ", req.body);
  const {
    amount,
    from,
    receiver,
    destination_chain_id,
   // date,
    transaction_hash,
    status,
    message,
    queue_id,
  } = req.body;
  try {
    const date = new Date().toISOString();

    console.log("inside try" , amount)
    const _query = await gmpdbclient.query(
      `INSERT INTO message (amount,fromaddress, toaddress, tochain, date, transaction_hash, message_info ,  status, queue_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [amount, from, receiver, destination_chain_id, date, transaction_hash, message, status ,queue_id]
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







// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();
// //const app = require('../DataBase/server')

// // app.app.post("transaction", async (req, res) => {
// //    console.log("Called")
// //     //   try {
// //     //     const time = new Date().toISOString();

// //     //     const msg = await prisma.transactions.create({
      
// //     //       data: {
// //     //           date:  time,
// //     //           from_account: "zafar",
// //     //           to_account: "imentus",
// //     //           amount: 100,
// //     //           gas_fees: 1,
// //     //           status: "sucess"
            
// //     //       },
// //     //     });
     
// //     //     // console.log("fullresponse---->", _query);
// //     //     res.status(201).send({
// //     //       message: "Message added successfully!",
// //     //     });
// //     //   } catch (error) {
// //     //     console.error("Error", error);
// //     //     res.status(500).send({
// //     //       message: "something went wrong",
// //     //     });
// //     //   }
// //     });

// // async function createMessage() {
// //     const time = new Date().toISOString();

// //   const msg = await prisma.Transaction.create({

// //     data: {
// //         date:  time,
// //         from: "zafar",
// //         to: "imentus",
// //         amount: 100,
// //         gasFees: 1,
// //         status: "sucess"
      
// //     },
// //   });

// //   console.log('Created user:', msg);
// // }

// // createMessage()
// //   .catch((e) => {
// //     throw e;
// //   })
// //   .finally(async () => {
// //     await prisma.$disconnect();
// //   });

//   async function createMessage() {
//     const time = new Date().toISOString();

//   const msg = await prisma.transaction.create({

//     data: {
        
//       date:  time,
//       from: "GBTTNN33W77EZX4EBG6OV7A3UORCMZOGREXTHN46HXYML623RHZMAW6W",
//       to: "GAK3OCYC3GNKU6K3CWSIAHHGIPEW4WPN2336LUUQHXDRXP2YWS6IJ5ZL",
//       amount: 1,
//       gasFees:1,
//       status:"Sucess"
      
//     },
//   });

//   console.log('Created user:', msg);
// }

// createMessage()
//   .catch((e) => {
//     throw e;
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
// //   async function createSignature() {
// //     const msg = await prisma.test_signature.create({
// //       data: {
// //         signature: 'Zafar',
        
// //       },
// //     });
  
// //     console.log('Created user:', msg);
// //   }
  
// //   createSignature()
// //     .catch((e) => {
// //       throw e;
// //     })
// //     .finally(async () => {
// //       await prisma.$disconnect();
// //     });

// // app.app.post("/Message" , async(req , res) => { 
// //     await prisma.test_message.create({ 
// //        data:{ 
// //            message: 'example'
// //        },
// //     });
// //    // const msg = await prisma.test_message.findMany();


// // })