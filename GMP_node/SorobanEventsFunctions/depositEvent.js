const express = require("express");
const axios = require("axios");
const cron = require("node-cron");
const SorobanClient = require('soroban-client')
// const Message = require("../DataBase/message.js");
// const Message = require("../DataBase/message.js");
const { solanaDeposit } = require('../SolanaEventsFunctions/depositEvent')
const { solanaWithdraw } = require('../SolanaEventsFunctions/withdrawEvent')
//const {post_api} = require('./server')
// Create an Express app
const app = express();

// Define a global variable to store the last ledger number
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
      const SOROBAN_RPC_URL = "https://rpc-futurenet.stellar.org:443/"; // TODO: fetch from ENV instead
      const server = new SorobanClient.Server(SOROBAN_RPC_URL, { allowHttp: true });
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
        startLedger: lastLedger ? (lastLedger + 1).toString() : startTimeLedger.toString(),
        filters: [
          {
            type: "contract",
            contractIds: [
              "CCYK2Y6E476UWZH2YM3WBE25FMSVBQ4CEPW7QOEY2QQRFGS4N3W6LMKR",
            ],
            topics: [
              [
                "AAAAEAAAAAEAAAABAAAADwAAAAhUcmFuc2Zlcg==",
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

    let store_events_value;
    let val = events?.map((e) => {
      //   console.log("eee",e?.value)
      // let scVal = SorobanClient.xdr.ScVal.fromXDR(event.events[0]?.value.xdr,"base64")
      store_events_value = e?.value.xdr;
    })
    let scVal = SorobanClient.xdr.ScVal.fromXDR(store_events_value, "base64")

    let converted_value = SorobanClient.scValToNative(scVal)
    console.log("🚀 ~ file: depositEvent.js:108 ~ pollSorobanEvents ~ converted_value:", converted_value);

    // try {
    //   convertedData = convertBigIntToString(converted_value);
    //   console.log("🚀 ~ file: depositEvent.js:111 ~ pollSorobanEvents ~ convertedData:", convertedData);
    // } catch (error) {
    //   console.log("🚀 ~ file: depositEvent.js:114 ~ pollSorobanEvents ~ error:", error);
    // }
    let soroban_deposit_random_transaction_hash = "e4eb26470ad1f19f900b1e943d8bd5edf71bc1e8c3fd6ca9b39b93fbf4936b40" // TODO: Triggering Event should give tx hash

    // Event data will be inserted to Postgres DB in below function
    await solanaDeposit(converted_value, 0, soroban_deposit_random_transaction_hash)
    console.log("🚀 ~ fyile: depositEvent.js:129 ~ pollSorobanDepositEvents ~ converted_value:", converted_value)

  } catch (error) {
    // Log any other errors that may occur
    console.error(error.message);
  }
}
// async function pollSorobanClaimEvents() {
//   let startTimeLedger, convertedData;
//   try {
//     // // One time use only
//     if (lastLedger == null) {
//       const SOROBAN_RPC_URL = "https://rpc-futurenet.stellar.org:443/"; // TODO: fetch from ENV instead
//       const server = new SorobanClient.Server(SOROBAN_RPC_URL, { allowHttp: true });
//       startTimeLedger = (await server.getLatestLedger()).sequence;
//       console.log("🚀 ~ file: depositEvent.js:32 ~ pollSorobanEvents ~ startTimeLedger:", startTimeLedger);
//     }
//     // Define the request object
//     let requestObject = {
//       jsonrpc: "2.0",
//       id: 8675309,
//       method: "getEvents",
//       params: { //519341
//         //227000
//         // If lastLedger is null, use "227000" as the start ledger
//         // Otherwise, increment lastLedger by one and use it as the start ledger
//         startLedger: lastLedger ? (lastLedger + 1).toString() : startTimeLedger.toString(),
//         filters: [
//           {
//             type: "contract",
//             contractIds: [
//               "CCYK2Y6E476UWZH2YM3WBE25FMSVBQ4CEPW7QOEY2QQRFGS4N3W6LMKR",
//             ],
//             topics: [
//               [
//                 "AAAAEAAAAAEAAAABAAAADwAAAAhUcmFuc2Zlcg==",
//                 "AAAADwAAAAdkZXBvc2l0AA==",

//               ],
//             ],
//           },
//         ],
//         pagination: {
//           limit: 100,
//         },
//       },
//     };
//     //  console.log("🚀 ~ file: test.js:46 ~ pollSorobanEvents ~ requestObject:", requestObject)

//     // Make an HTTP POST request to the Soroban RPC endpoint
//     //https://rpc-futurenet.stellar.org:443
//     //https://soroban-testnet.stellar.org
//     let res = await axios.post(
//       "https://rpc-futurenet.stellar.org:443",
//       requestObject
//     );
//     //  console.log("🚀 ~ file: test.js:55 ~ pollSorobanEvents ~ res:", res)

//     // Get the JSON response
//     let json = res.data;
//     //   console.log("🚀 ~ file: test.js:58 ~ pollSorobanEvents ~ json:", json)

//     // Check if there is an error in the response
//     if (json.error) {
//       // Log the error message
//       console.log("🚀 ~ file: depositEvent.js:84 ~ pollSorobanEvents ~ json.error.message:", json.error.message);
//       return;
//     }



//     // Get the latest ledger number from the result and update lastLedger
//     let latestLedger = parseInt(res.data.result.latestLedger);
//     lastLedger = latestLedger;

//     // Get the events array from the result
//     let events = res.data.result.events;
//     //  console.log("🚀 ~ file: test.js:77 ~ pollSorobanEvents ~ events:", events)
//     // console.log("🚀 ~ file: events.ts:49 ~ test ~ event value:",events.value)

//     // Check if there are any events in the array
//     if (events.length <= 0) {
//       // Log that there are no events in this interval
//       console.log("No events recorded in this interval: ", lastLedger);
//       return
//     }

//     let store_events_value;
//     let val = events?.map((e) => {
//       //   console.log("eee",e?.value)
//       // let scVal = SorobanClient.xdr.ScVal.fromXDR(event.events[0]?.value.xdr,"base64")
//       store_events_value = e?.value.xdr;
//     })
//     let scVal = SorobanClient.xdr.ScVal.fromXDR(store_events_value, "base64")

//     let converted_value = SorobanClient.scValToNative(scVal)
//     console.log("🚀 ~ file: depositEvent.js:108 ~ pollSorobanEvents ~ converted_value:", converted_value);

//     // try {
//     //   convertedData = convertBigIntToString(converted_value);
//     //   console.log("🚀 ~ file: depositEvent.js:111 ~ pollSorobanEvents ~ convertedData:", convertedData);
//     // } catch (error) {
//     //   console.log("🚀 ~ file: depositEvent.js:114 ~ pollSorobanEvents ~ error:", error);
//     // }
//     let soroban_deposit_random_transaction_hash = "e4eb26470ad1f19f900b1e943d8bd5edf71bc1e8c3fd6ca9b39b93fbf4936b40" // TODO: Triggering Event should give tx hash

//     // Event data will be inserted to Postgres DB in below function
//     await solanaDeposit(converted_value, 0, soroban_deposit_random_transaction_hash)
//     console.log("🚀 ~ fyile: depositEvent.js:129 ~ pollSorobanDepositEvents ~ converted_value:", converted_value)

//   } catch (error) {
//     // Log any other errors that may occur
//     console.error(error.message);
//   }
// }
async function pollSorobanWithdrawEvents() {
  let startTimeLedger, convertedData;
  try {
    // // One time use only
    if (lastLedger == null) {
      const SOROBAN_RPC_URL = "https://rpc-futurenet.stellar.org:443/"; // TODO: fetch from ENV instead
      const server = new SorobanClient.Server(SOROBAN_RPC_URL, { allowHttp: true });
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
        startLedger: lastLedger ? (lastLedger + 1).toString() : startTimeLedger.toString(),
        filters: [
          {
            type: "contract",
            contractIds: [
              "CCYK2Y6E476UWZH2YM3WBE25FMSVBQ4CEPW7QOEY2QQRFGS4N3W6LMKR",
            ],
            topics: [
              [
                "AAAAEAAAAAEAAAABAAAADwAAAAhXaXRoZHJhdw==",
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

    let store_events_value;
    let val = events?.map((e) => {
      //   console.log("eee",e?.value)
      // let scVal = SorobanClient.xdr.ScVal.fromXDR(event.events[0]?.value.xdr,"base64")
      store_events_value = e?.value.xdr;
    })
    let scVal = SorobanClient.xdr.ScVal.fromXDR(store_events_value, "base64")

    let converted_value = SorobanClient.scValToNative(scVal)
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
// cron.schedule("*/15 * * * * *", pollSorobanClaimEvents);
// Start listening on port 3000
app.listen(3000, () => console.log("Server is listening on port 3000."));
