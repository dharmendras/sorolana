
const { Client } = require("pg");

const client = new Client({
   host: "3.110.150.81",
   user: "postgres",
   port: 5432,
   password: "imentus123",
   database: "sorolanadb",
   ssl: {
      rejectUnauthorized: false, // This option might be needed for self-signed certificates
    },
});
const gmpdbclient = new Client({
   host: "3.110.150.81",
   user: "postgres",
   port: 5432,
   password: "imentus123",
   database: "gmpdb"
 
});

//console.log("client" , gmpdbclient.connect());
//    .then(() => {
//       console.log("Connected to PostgreSQL database");
//    })
//    .catch((err) => {
//       console.error("Error connecting to PostgreSQL database:", err);
//    });

module.exports =  gmpdbclient;











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