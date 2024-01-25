const NETWORK_PASSPHRASE = "Test SDF Future Network ; October 2022";
const SOROBAN_RPC_URL = "https://rpc-futurenet.stellar.org:443/";
const scvalToBigNumber = require("./convert.js");
const solanaWeb3 = require("@solana/web3.js");
const anchorr = require("@coral-xyz/anchor");
const { PublicKey } = require("@solana/web3.js");
const { Keypair } = require("@solana/web3.js");
const { EventParser, BorshCoder, web3 } = require("@coral-xyz/anchor");
const bs58 = require("bs58");
const util = require("tweetnacl-util");
const idl = require("./idl.json");
const Message = require("../DataBase/message.js");
const nacl = require("tweetnacl");
const { anchor } = require("@coral-xyz/anchor");
const axios = require("axios");
const { Program } = require("@coral-xyz/anchor");
const { AnchorProvider } = require("@coral-xyz/anchor");
const express = require("express");
//const axios = require("axios");
const cron = require("node-cron");
const stellar_sdk = require('stellar-sdk')
// const Message = require("../DataBase/message.js");
// const Message = require("../DataBase/message.js");
const { solanaDeposit } = require('./SolanaEventsFunctions/depositEvent')
const { solanaWithdraw } = require('./SolanaEventsFunctions/withdrawEvent')
const { SorobanClaimEventHandle } = require('./SorobanEventsFunctions/sorobanclaimEventHandle.js')
const app = express();


const fs = require("fs");
// const {SorobanDeposit} = require('./SorobanEventsFunction/SorobanDeposit.js')
const { solanaClaim } = require("./SolanaEventsFunctions/claimEvent.js");
const { SorobanClaim } = require("./SorobanEventsFunctions/SorobanClaim.js");
// const { solanaWithdraw } = require("./SolanaEventsFunctions/withdrawEvent.js");
const { solanaWithdrawEventHandle } = require("./SorobanEventsFunctions/solanaWithdrawHandle.js");
// import fs from "fs";


const dotenv = require("dotenv");
dotenv.config();

const opts = {
  preflightCommitment: "processed",
};
const network = "http://localhost:8899";

//const network = "https://api.devnet.solana.com";
const connection = new solanaWeb3.Connection(network, "confirmed");
const programID = new PublicKey(idl.metadata.address);
const provider = new AnchorProvider(connection, opts.preflightCommitment);
const program = new Program(idl, programID, provider);
const USER_SEED_PREFIX = "prevent_duplicate_claimV1";

let validator_kp = Keypair.fromSecretKey(
  new Uint8Array(
    JSON.parse(fs.readFileSync("solana_validators/validator3.json").toString())
  )
);

//To get Pda
const getUserPda = async (user) => {
  const userPdaInfo = web3.PublicKey.findProgramAddressSync(
    [anchorr.utils.bytes.utf8.encode(USER_SEED_PREFIX), user.toBuffer()],
    program.programId
  );
  return userPdaInfo;
};

// const server = new StellarSdk.Server("https://horizon-testnet.stellar.org/");

program.addEventListener("DepositEvent", (event, slot, transaction_id) => {
  console.log("🚀 ~ file: validator1.js:65 ~ program.addEventListener ~ event:", event)
  // solanaDeposit(event, slot, transaction_id);
  SorobanClaim(event, slot, transaction_id)

});
program.addEventListener("WithdrawEvent", (event, slot, transaction_id) => {
  solanaWithdrawEventHandle(event, slot, transaction_id);
});
program.addEventListener("ClaimEvent", (event, slot, transaction_id) => {
  console.log("🚀 ~ program.addEventListener ~ event:", event)
  solanaClaim(event, slot, transaction_id);
});


// soroban 
let lastLedger = null;

// Define a function to poll the Soroban .getEvents
function convertBigIntToString(obj) {
  for (const key in obj) {
    if (obj[key] instanceof Object) {
      obj[key] = convertBigIntToString(obj[key]);  // Recursive call for nested objects
    } else if (typeof obj[key] === 'bigint') {
      obj[key] = obj[key].toString();  // Convert BigInt to string
    }
  }
  return obj;
}

async function pollSorobanDepositEvents() {
  let startTimeLedger, convertedData;
  try {
    // // One time use only
    if (lastLedger == null) {
      //https://soroban-testnet.stellar.org:443  for testnet
      //https://rpc-futurenet.stellar.org:443/   for fururenet
      const SOROBAN_RPC_URL = "https://soroban-testnet.stellar.org:443/"; // TODO: fetch from ENV instead

      const server = new stellar_sdk.SorobanRpc.Server(SOROBAN_RPC_URL, { allowHttp: true })
      startTimeLedger = (await server.getLatestLedger()).sequence;
      console.log("🚀 ~ file: depositEvent.js:32 ~ pollSorobanEvents ~ startTimeLedger:", startTimeLedger);
    }
    // Define the request object
    let requestObject = {
      jsonrpc: "2.0",
      id: 8675309,
      method: "getEvents",
      params: { //519341
        //227000
        // If lastLedger is null, use "227000" as the start ledger
        // Otherwise, increment lastLedger by one and use it as the start ledger
        startLedger: lastLedger ? (lastLedger + 1) : startTimeLedger,
        filters: [
          {
            type: "contract",
            contractIds: [
              process.env.CONTRACT_ID
            ],
            topics: [
              [
                "AAAAEAAAAAEAAAABAAAADwAAAAxEZXBvc2l0RXZlbnQ=",
                "AAAADwAAAAdkZXBvc2l0AA==",

              ],
            ],
          },
        ],
        pagination: {
          limit: 100,
        },
      },
    };
    //  console.log("🚀 ~ file: test.js:46 ~ pollSorobanEvents ~ requestObject:", requestObject)

    // Make an HTTP POST request to the Soroban RPC endpoint
    //https://rpc-futurenet.stellar.org:443
    //https://soroban-testnet.stellar.org
    //http://ec2-16-170-242-7.eu-north-1.compute.amazonaws.com:3030/
   // const url = 'http://ec2-16-170-242-7.eu-north-1.compute.amazonaws.com:3030/';
    const url = 'https://soroban-testnet.stellar.org';
    let res = await axios.post(
      url,
      requestObject
    );
    //  console.log("🚀 ~ file: test.js:55 ~ pollSorobanEvents ~ res:", res)

    // Get the JSON response
    let json = res.data;
    //   console.log("🚀 ~ file: test.js:58 ~ pollSorobanEvents ~ json:", json)

    // Check if there is an error in the response
    if (json.error) {
      // Log the error message
      console.log("🚀 ~ file: depositEvent.js:84 ~ pollSorobanEvents ~ json.error.message:", json.error.message);
      return;
    }



    // Get the latest ledger number from the result and update lastLedger
    let latestLedger = parseInt(res.data.result.latestLedger);
    lastLedger = latestLedger;

    // Get the events array from the result
    let events = res.data.result.events;
    console.log("🚀 ~ file: depositEvent.js:102 ~ pollSorobanDepositEvents ~ events:", events)
    //  console.log("🚀 ~ file: test.js:77 ~ pollSorobanEvents ~ events:", events)
    // console.log("🚀 ~ file: events.ts:49 ~ test ~ event value:",events.value)

    // Check if there are any events in the array
    if (events.length <= 0) {
      // Log that there are no events in this interval
      console.log("No events recorded in this interval: ", lastLedger);
      return
    }

    let store_events_value = events[0].value;
    let scVal = stellar_sdk.xdr.ScVal.fromXDR(store_events_value, "base64")
    let converted_value = stellar_sdk.scValToNative(scVal)

    console.log("🚀 ~ file: depositEvent.js:122 ~ pollSorobanDepositEvents ~ converted_value:", converted_value)

    let soroban_deposit_random_transaction_hash = "0xa6e9b4f8d3c2a9e0d7b6f1c8e9d2a6b7f8d9c1a2e5f9d3b7c8a2e9b0d4c1a6" // TODO: Triggering Event should give tx hash

    // Event data will be inserted to Postgres DB in below function
    //  await solanaDeposit(converted_value, 0, soroban_deposit_random_transaction_hash)
    // console.log("🚀 ~ fyile: depositEvent.js:129 ~ pollSorobanDepositEvents ~ converted_value:", converted_value)

  } catch (error) {
    // Log any other errors that may occur
    console.error(error.message);
  }
}
async function pollSorobanClaimEvents() {
  let startTimeLedger, convertedData;
  try {
    // // One time use only
    if (lastLedger == null) {
      const SOROBAN_RPC_URL = "https://rpc-futurenet.stellar.org:443/"; // TODO: fetch from ENV instead
      const server = new stellar_sdk.SorobanRpc.Server(SOROBAN_RPC_URL, { allowHttp: true })
      startTimeLedger = (await server.getLatestLedger()).sequence;
      console.log("🚀 ~ file: depositEvent.js:32 ~ pollSorobanEvents ~ startTimeLedger:", startTimeLedger);
    }
    // Define the request object
    let requestObject = {
      jsonrpc: "2.0",
      id: 8675309,
      method: "getEvents",
      params: { //519341
        //227000
        // If lastLedger is null, use "227000" as the start ledger
        // Otherwise, increment lastLedger by one and use it as the start ledger
        startLedger: lastLedger ? (lastLedger + 1) : startTimeLedger,
        filters: [
          {
            type: "contract",
            contractIds: [
              process.env.CONTRACT_ID
            ],
            topics: [
              [
                "AAAAEAAAAAEAAAABAAAADwAAAApDbGFpbUV2ZW50AAA=",
                "AAAADwAAAAVDbGFpbQAAAA==",

              ],
            ],
          },
        ],
        pagination: {
          limit: 100,
        },
      },
    };
    //  console.log("🚀 ~ file: test.js:46 ~ pollSorobanEvents ~ requestObject:", requestObject)

    // Make an HTTP POST request to the Soroban RPC endpoint
    //https://rpc-futurenet.stellar.org:443
    //https://soroban-testnet.stellar.org
    let res = await axios.post(
      "https://rpc-futurenet.stellar.org:443",
      requestObject
    );
    //  console.log("🚀 ~ file: test.js:55 ~ pollSorobanEvents ~ res:", res)

    // Get the JSON response
    let json = res.data;
    //   console.log("🚀 ~ file: test.js:58 ~ pollSorobanEvents ~ json:", json)

    // Check if there is an error in the response
    if (json.error) {
      // Log the error message
      console.log("🚀 ~ file: depositEvent.js:84 ~ pollSorobanEvents ~ json.error.message:", json.error.message);
      return;
    }



    // Get the latest ledger number from the result and update lastLedger
    let latestLedger = parseInt(res.data.result.latestLedger);
    lastLedger = latestLedger;

    // Get the events array from the result
    let events = res.data.result.events;
    //  console.log("🚀 ~ file: test.js:77 ~ pollSorobanEvents ~ events:", events)
    // console.log("🚀 ~ file: events.ts:49 ~ test ~ event value:",events.value)

    // Check if there are any events in the array
    if (events.length <= 0) {
      // Log that there are no events in this interval
      console.log("No events recorded in this interval: ", lastLedger);
      return
    }

    let store_events_value = events[0].value;

    let scVal = stellar_sdk.xdr.ScVal.fromXDR(store_events_value, "base64")
    let converted_value = stellar_sdk.scValToNative(scVal)
    console.log("🚀 ~ file: depositEvent.js:108 ~ pollSorobanEvents ~ converted_value:", converted_value);

    let soroban_deposit_random_transaction_hash = "e4eb26470ad1f19f900b1e943d8bd5edf71bc1e8c3fd6ca9b39b93fbf4936b40" // TODO: Triggering Event should give tx hash

    // Event data will be inserted to Postgres DB in below function
    await SorobanClaimEventHandle(converted_value, 0, soroban_deposit_random_transaction_hash);
    //  await solanaDeposit(converted_value, 0, soroban_deposit_random_transaction_hash)
    console.log("🚀 ~ fyile: depositEvent.js:129 ~ pollSorobanDepositEvents ~ converted_value:", converted_value)

  } catch (error) {
    // Log any other errors that may occur
    console.error(error.message);
  }
}
async function pollSorobanWithdrawEvents() {
  let startTimeLedger, convertedData;
  try {
    // // One time use only
    if (lastLedger == null) {
      const SOROBAN_RPC_URL = "https://rpc-futurenet.stellar.org:443/"; // TODO: fetch from ENV instead
      const server = new stellar_sdk.SorobanRpc.Server(SOROBAN_RPC_URL, { allowHttp: true })
      startTimeLedger = (await server.getLatestLedger()).sequence;
      console.log("🚀 ~ file: depositEvent.js:142 ~ pollSorobanWithdrawEvents ~ startTimeLedger:", startTimeLedger)
    }
    // Define the request object
    let requestObject = {
      jsonrpc: "2.0",
      id: 8675309,
      method: "getEvents",
      params: { //519341
        //227000
        // If lastLedger is null, use "227000" as the start ledger
        // Otherwise, increment lastLedger by one and use it as the start ledger
        startLedger: lastLedger ? (lastLedger + 1) : startTimeLedger,
        filters: [
          {
            type: "contract",
            contractIds: [
              process.env.CONTRACT_ID,
            ],
            topics: [
              [
                "AAAAEAAAAAEAAAABAAAADwAAAA1XaXRoZHJhd0V2ZW50AAAA",
                "AAAADwAAAAhXaXRoZHJhdw=="
              ],
            ],
          },
        ],
        pagination: {
          limit: 100,
        },
      },
    };
    //console.log("🚀 ~ file: depositEvent.js:174 ~ pollSorobanWithdrawEvents ~ requestObject:", requestObject)

    // Make an HTTP POST request to the Soroban RPC endpoint
    //https://rpc-futurenet.stellar.org:443
    //https://soroban-testnet.stellar.org
    let res = await axios.post(
      "https://rpc-futurenet.stellar.org:443",
      requestObject
    );
    // console.log("🚀 ~ file: depositEvent.js:183 ~ pollSorobanWithdrawEvents ~ res:", res)

    // Get the JSON response
    let json = res.data;
    // console.log("🚀 ~ file: depositEvent.js:187 ~ pollSorobanWithdrawEvents ~ json:", json)

    // Check if there is an error in the response
    if (json.error) {
      console.log("🚀 ~ file: depositEvent.js:191 ~ pollSorobanWithdrawEvents ~ error:", json.error.message)
      // Log the error message
      return;
    }



    // Get the latest ledger number from the result and update lastLedger
    let latestLedger = parseInt(res.data.result.latestLedger);
    lastLedger = latestLedger;

    // Get the events array from the result
    let events = res.data.result.events;
    //  console.log("🚀 ~ file: test.js:77 ~ pollSorobanEvents ~ events:", events)
    // console.log("🚀 ~ file: events.ts:49 ~ test ~ event value:",events.value)

    // Check if there are any events in the array
    if (events.length <= 0) {
      // Log that there are no events in this interval
      console.log("No events recorded in this interval: ", lastLedger);
      return
    }
    let store_events_value = events[0].value;

    let scVal = stellar_sdk.xdr.ScVal.fromXDR(store_events_value, "base64")
    let converted_value = stellar_sdk.scValToNative(scVal)
    console.log("🚀 ~ file: depositEvent.js:108 ~ pollSorobanEvents ~ converted_value:", converted_value);


    try {
      convertedData = convertBigIntToString(converted_value);
      console.log("🚀 ~ file: depositEvent.js:111 ~ pollSorobanEvents ~ convertedData:", convertedData);
    } catch (error) {
      console.log("🚀 ~ file: depositEvent.js:114 ~ pollSorobanEvents ~ error:", error);
    }
    let soroban_deposit_random_transaction_hash = "e4eb26470ad1f19f900b1e943d8bd5edf71bc1e8c3fd6ca9b39b93fbf4936b40" // TODO: Triggering Event should give tx hash

    // Event data will be inserted to Postgres DB in below function
    await solanaWithdraw(convertedData, 0, soroban_deposit_random_transaction_hash)

  } catch (error) {
    // Log any other errors that may occur
    console.error(error.message);
  }
}

// Schedule a cron job to run every 15 seconds and call pollSorobanEvents
// cron.schedule("*/1 * * * *", pollSorobanEvents);
cron.schedule("*/15 * * * * *", pollSorobanDepositEvents);
cron.schedule("*/15 * * * * *", pollSorobanWithdrawEvents);
cron.schedule("*/15 * * * * *", pollSorobanClaimEvents);
// Start listening on port 3000


app.listen(3001, () => console.log("Server is listening on port 3002."));