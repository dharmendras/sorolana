const { hash } = require('soroban-client');
const SorobanClient = require('soroban-client');
const NETWORK_PASSPHRASE = 'Test SDF Future Network ; October 2022';
const SOROBAN_RPC_URL = 'https://rpc-futurenet.stellar.org:443/';
const scvalToBigNumber = require('./convert.js');
const solanaWeb3 = require('@solana/web3.js')
const { PublicKey } = require('@solana/web3.js')
const { Keypair } = require('@solana/web3.js')
const { EventParser, BorshCoder } = require('@coral-xyz/anchor')
const bs58 = require('bs58')
const StellarSdk = require('stellar-sdk');

//const PublicKey = require('@coral-xyz/anchor')
const idl = require('./idl.json')

const nacl = require('tweetnacl')
const { anchor } = require("@coral-xyz/anchor");
const { assert } = require("chai")

const { Program } = require('@coral-xyz/anchor')
const { AnchorProvider } = require('@coral-xyz/anchor')

const dotenv = require('dotenv')
dotenv.config();
//fetchContractValue();
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

        let hash = "8e67f1a59cec3490bda3bcb7e8a3a4f43dc9b50a722cbc96fcad43b120975e5c";
        let res = await server.getTransaction(hash);
        console.log("line number 28 ", res)
    } catch (error) {
        console.log(error)
    }

    const keypair = solanaWeb3.Keypair.generate();
    const publicKey = keypair.publicKey.toBase58();
    const privateKey = keypair.secretKey;

    console.log('public key:', publicKey);
    console.log('private key:', privateKey);
    const uint8Array = Buffer.from("str", 'utf-8');
    let sign = nacl.sign(uint8Array, privateKey);
    console.log(" ====> Line Nmber 15  <======", sign);


}


fetchSolanaValue();
async function fetchSolanaValue() {
     const network = "http://127.0.0.1:8899"
  //  const network = "https://api.testnet.solana.com";
    // const network = "https://api.devnet.solana.com"
    //var server = new StellarSdk.server("https://horizon-testnet.stellar.org")
    // var sourceKeys = StellarSdk.keypair.f
    // Generate key pair
   
//const keyPair = StellarSdk.Keypair.random();
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org/');

//const sourcePrivateKey = keyPair.secret();
console.log("public key" , process.env.PUBLICKEY)
console.log(" private key" , process.env.PRIVATEKEY)
const str = "str";
const message = 'Hello, world!';

//const buffer = Buffer.from(str, 'utf-8');
 const encoder = new TextEncoder();
 const buffer = encoder.encode(str);
 console.log("82" , buffer)
 //const buffer1 = encoder.encode(sourcePrivateKey)
 //console.log("buffer1" , buffer1)
 
 //const uint8Array = Buffer.from("str", 'utf-8');
 //let sign = nacl.sign(uint8Array);
    const opts = {
        preflightCommitment: "processed",
    };


    //pDTDcfDJmKmhf5ExMpya2VSJXEtZZTm95APMkvN4Kqi3jDL9MRjWHtikRjJCZPrgYHKw3KojoMCBybBGvW5PPe6 // tx
    const connection = new solanaWeb3.Connection(network, "confirmed");


    const programID = new PublicKey(idl.metadata.address)
    const provider = new AnchorProvider(
        connection, opts.preflightCommitment,
    )
    
    let listener = null;
    const program = new Program(idl, programID, provider);

    let event = await new Promise((resolve, _reject) => {
        listener = program.addEventListener("DepositEvent", (event, slot, signature) => {
            resolve([event, slot]);
        })
    })
    console.log("event ", event);
    console.log("event ", event[0].amount);
    if (event[0].amount == 12){ 
        console.log("matched")
        const keypair = StellarSdk.Keypair.fromSecret(process.env.PRIVATEKEY);
        keypair.sign(message)
        
    }
    else { 
        console.log("Not Matched")
       
    }

//     let result = await connection.getTransaction('2fbxg24SiW2jbnKRrBFTtvTqcq27qgyyx2437ZP7GiPYEXNRCytuWteopFUCWeBhzsj3WpkZxqw8AmNNYyrLMVf8',
//     { maxSupportedTransactionVersion: 5 })

// const eventParser = new EventParser(programID, new BorshCoder(idl));
// const events = await eventParser.parseLogs(result.meta.logMessages)
// // Collecting the values from the generator
// const eventValues = [];

// for (const event of events) {
//     eventValues.push(event);
// }

// console.log("eventValues", eventValues[0].data.amount);






}
//4eWKhHFVmkVevGUt4PVUaxak6Gy7oGVGFQxSzNnXoZBwW46Mm536prri9RgiACSvprUjdJs6kiQSVyxgv5BWgoki  //tx
//9996000000
//gFmtJWGJAwihzmLV1FGaprSgbuBMGhPFGf928nJ8frqgV4JzFTcmxDeYpQfx4UdJ8SE8PzDFgrqPXP5dgFhfuHd