const client = require('./connection.js')
const app = require('./server.js')
const bodyParser = require('body-parser');
const SorobanClient = require('soroban-client')
const SOROBAN_RPC_URL = "https://rpc-futurenet.stellar.org:443/";
const contractId = 'CAJW2YDE7YKGDTDHV7QOGZAOLVX3JV6VLOJRW7EYXGJK3EGXNH3VJRGK';

console.log("🚀 ~ file: index.js:2 ~ client:", client)
app.app.use(bodyParser.json());
client.connect();


app.app.post('/Message', (req, res) => {    
     event_listen()
  //  console.log("🚀 ~ file: index.js:52 ~ app.app.post ~ message:", message)
    try {
        const jsonData = req.body;
        const time = new Date().toISOString();
        console.log('Received JSON data:', jsonData);
        const { rows } = client.query(
        
        
          "INSERT INTO message_data (time, method_name, data) VALUES ( $1, $2 , $3)",
          [ time, jsonData.name , jsonData.email]
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

app.app.get('/Message', (req, res) => {

    client.query(`SELECT * FROM message_data`, (err, result) => {
        if (!err) {
            res.send(result.rows)
        }
    });
    client.end;
})