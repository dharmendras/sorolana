const { hash } = require('soroban-client');
const SorobanClient = require('soroban-client');
const NETWORK_PASSPHRASE = 'Test SDF Future Network ; October 2022';
const SOROBAN_RPC_URL = 'https://rpc-futurenet.stellar.org:443/';
const scvalToBigNumber = require('./convert.js');

fetchContractValue();
async function fetchContractValue() { 
    const server = new SorobanClient.Server(SOROBAN_RPC_URL, { allowHttp: true });
    try {
        let res = await server.getEvents({
            startLedger: 802779,
            filters: [],
            limit: 1,
        });
    
        console.log("line number 71 ", res);
        console.log("line number 72 ", JSON.parse(JSON.stringify(res)).events[0].value);
        
    } catch (error) {
        console.log(error)
    }
       

       
                  
      try {         
        
         let hash  = "8e67f1a59cec3490bda3bcb7e8a3a4f43dc9b50a722cbc96fcad43b120975e5c";
         let res = await server.getTransaction(hash);
         console.log("line number 28 " , res)
     } catch (error) {
         console.log(error)
     }
       
}
