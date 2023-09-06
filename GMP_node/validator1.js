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
const ed25519 = require('ed25519');
const util = require('tweetnacl-util');
//const PublicKey = require('@coral-xyz/anchor')
const idl = require('./idl.json')
const Message = require('../DataBase/message.js')
const nacl = require('tweetnacl')
const { anchor } = require("@coral-xyz/anchor");
const { assert } = require("chai")

const { Program } = require('@coral-xyz/anchor')
const { AnchorProvider } = require('@coral-xyz/anchor')

const dotenv = require('dotenv')
dotenv.config();
sorobanToSolana();
async function sorobanToSolana() {
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
    // try {

    //     let hash = "8e67f1a59cec3490bda3bcb7e8a3a4f43dc9b50a722cbc96fcad43b120975e5c";
    //     let res = await server.getTransaction(hash);
    //     console.log("line number 28 ", res)
    // } catch (error) {
    //     console.log(error)
    // }
    const MSG = Uint8Array.from(Buffer.from("this is such a good message to sign"));
    const keypair = solanaWeb3.Keypair.generate();
    const publicKey = keypair.publicKey.toBase58();
    const privateKey = keypair.secretKey;

    console.log('solana public key:', publicKey);
    console.log('private key:', privateKey);
    const uint8Array = Buffer.from("str", 'utf-8');
    let sign = nacl.sign.detached(MSG , keypair.secretKey)
    console.log(" ====> Line Nmber 15  <======", sign);
    let signatureString = Buffer.from(sign).toString('hex') // convert uint8array in string
    console.log("signature String", signatureString) // console signature as a string

}


solanaToSoroban();
async function solanaToSoroban() {
     const network = "http://127.0.0.1:8899"
  
      // Generate key pair
      const keypair = nacl.sign.keyPair();
      console.log("======>keypair<=======" , keypair)
      const publicKey = Buffer.from(keypair.publicKey).toString('base64');
      console.log("=====>public ke<======" , publicKey)
//const keyPair = StellarSdk.Keypair.random();
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org/');


    const opts = {
        preflightCommitment: "processed",
    };


    //pDTDcfDJmKmhf5ExMpya2VSJXEtZZTm95APMkvN4Kqi3jDL9MRjWHtikRjJCZPrgYHKw3KojoMCBybBGvW5PPe6 // tx
    const connection = new solanaWeb3.Connection(network, "confirmed");
    

    const programID = new PublicKey(idl.metadata.address)
    console.log("=====> program id <=======" , programID)
    const provider = new AnchorProvider(
        connection, opts.preflightCommitment,
    )
    
    let listener = null;
    const program = new Program(idl, programID, provider);

    // 1 Listen message
    let event = await new Promise((resolve, _reject) => {
        listener = program.addEventListener("DepositEvent", (event, slot, signature) => {
            resolve([event, slot]);
        })
    })
    const str1 = "Never give up ";
   const message = str1;
   // const messageUint8 = util.decodeUTF8(message);
    console.log("event ", event);
    console.log("event ", event[0]);

    let jsonString = JSON.stringify(event[0])
    console.log("====>jsonString<=====" , jsonString)
    let string = jsonString.toString();
    console.log("=======> string <==========" , string)
    const messageUint8 = util.decodeUTF8(string);
    // 2) verify message
    if (event[0].amount == 12){ 
        console.log("matched")

        // 3 sign message
        const sign = ed25519.Sign(messageUint8, keypair.secretKey);
        console.log("======>signatureUint8 line number 11 <=======" , sign)

         const signString = Buffer.from(sign).toString('base64');
        console.log("signString base 64 " , signString)

        // 4) Database
          Message.saveMessage(string) // pass message
          Message.saveSignature(signString , publicKey) // pass signature & pubkey
        
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