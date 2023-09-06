const express = require('express');
const app = express();

app.listen(3300 , ()=> { 

    console.log("server is now listning at port 3300");
})
module.exports = {app}