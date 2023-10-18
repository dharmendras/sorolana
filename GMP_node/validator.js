
const SorobanClient = require('soroban-client')
const SOROBAN_RPC_URL = "https://rpc-futurenet.stellar.org:443/";

const event = async () => { 
  console.log(" Event method  Start Executing")

  const server = new SorobanClient.Server(SOROBAN_RPC_URL, { allowHttp: true });

  console.log("🚀 ~ file: validator.js:10 ~ event ~ server:", server)

  //const contract = new SorobanClient.Contract(contractId);

  try {
    let res = await server.getEvents({ 
      startLedger: 501911,
      filters: [],
      limit: 1
    });
    console.log("🚀 ~ file: validator.js:18 ~ event ~ res:", JSON.parse(JSON.stringify(res)).events[0].value)
    
  } catch (error) {
    console.log("🚀 ~ file: validator.js:21 ~ event ~ error:", error)
    
  }

}


event()