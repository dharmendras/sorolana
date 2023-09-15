
const {Client} =  require("pg")

 const client = new Client({ 
   // host: "postgres://postgres:imentus123@3.110.150.81:5432/sorobandb",
    host: "3.110.150.81",
    user: "postgres",
    port: 5432,
    password: "imentus123",
    database: "sorolanadb",
    ssl: {
            rejectUnauthorized: false, // This option might be needed for self-signed certificates
          },
 })
 module.exports = client
 //console.log("====>connection<======" , client.connect())
// const { Client } = require("pg");

// const client = new Client({
//    host: "sorolanadb.ceyrwh5vrqgt.ap-south-1.rds.amazonaws.com",
//    user: "postgres",
//    port: 5432,
//    password: "abcd1234",
//    database: "postgres",
//    ssl: {
//       rejectUnauthorized: false, // This option might be needed for self-signed certificates
//     },
// });

// client.connect()
//    .then(() => {
//       console.log("Connected to PostgreSQL database");
//    })
//    .catch((err) => {
//       console.error("Error connecting to PostgreSQL database:", err);
//    });

//module.exports = client;











// const {Client} =  require("pg")

//  const client = new Client({ 
//    host:"database-1.ceyrwh5vrqgt.ap-south-1.rds.amazonaws.com",
//    // host: "postgres://postgres:iMentus123456@database-1.ceyrwh5vrqgt.ap-south-1.rds.amazonaws.com:5432/database-1",
//     user: "postgres",
//     port: 5432,
//     password: "iMentus123456",
//     database: "database-1"
//  })
//  module.exports = client