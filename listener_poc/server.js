const express = require('express');
const app = express();
const SorobanClient = require('soroban-client')
const SOROBAN_RPC_URL = "https://rpc-futurenet.stellar.org:443/";
const contractId = 'CAJW2YDE7YKGDTDHV7QOGZAOLVX3JV6VLOJRW7EYXGJK3EGXNH3VJRGK';
const server = new SorobanClient.Server(SOROBAN_RPC_URL, { allowHttp: true });
let lastLedger = null;
const client = require('./connection.js')
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const intervalInMilliseconds = 2 * 60 * 1000; // 2 minutes
//const intervalInMilliseconds = 1000; // 2 minutes



app.listen(3300, async () => {
   // console.log("server is now listning at port 3300");
    

})
client.connect()
function post_api(convertedData) { 
  app.post('/Message', (req, res) => {   

    try {
      const jsonData = req.body;
      const time = new Date().toISOString();
    //  console.log('Received JSON data:', jsonData);
      const { rows } = client.query(
      
      
        "INSERT INTO message_data (time, method_name, data) VALUES ( $1, $2 , $3)",
        [ time, 'deposit' , convertedData]
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
   client.end
}
app.post('/message', (req, res) => {   

    try {
      const jsonData = req.body;
      const time = new Date().toISOString();
      console.log('Received JSON data:', jsonData);
     // const { rows } = client.query(
      
      
        // "INSERT INTO message_data (time, method_name, data) VALUES ( $1, $2 , $3)",
        // [ time, 'deposit' , convertedData]
    //  );
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
app.get('/Message', (req, res) => {

  client.query(`SELECT * FROM message_data`, (err, result) => {
      if (!err) {
          res.send(result.rows)
      }
  });
  client.end;
})
module.exports = { app , post_api}