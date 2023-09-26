const express = require('express');
const app = express();

app.listen(3400 , ()=> { 

    console.log("server is now listning at port 3400");
})
module.exports = {app}