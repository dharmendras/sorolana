const {Client} =  require("pg")

 const client = new Client({ 
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "test123",
    database: "sorolana"
 })
 module.exports = client