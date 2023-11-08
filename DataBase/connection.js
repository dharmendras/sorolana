
const { Client } = require("pg");

const client = new Client({
   host: "43.205.254.49",
   user: "postgres",
   port: 5432,
   password: "imentus123",
   database: "sorolanadb",
   ssl: {
      rejectUnauthorized: false, // This option might be needed for self-signed certificates
    },
});

// const gmpdbclient = new Client({
//    host: "43.205.254.49",
//    user: "postgres",
//    port: 5432,
//    password: "imentus123",
//    database: "gmpdb"
 
// });

const gmpdbclient = new Client({
   host: "65.2.160.56",
   user: "postgres",
   port: 5432,
   password: "imentus123",
   database: "gmpdb"
 
});

module.exports =  gmpdbclient;



//postgresql://postgres:imentus123@43.205.254.49:5432/gmpdb
//postgres://postgres:imentus123@43.205.254.49:5432/gmpdb
// DATABASE_URL=postgresql://postgres:imentus123@43.205.254.49:5432/gmpdb







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