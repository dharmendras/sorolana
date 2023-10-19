const express = require("express");
const axios = require("axios");
const cron = require("node-cron");
const SorobanClient = require('soroban-client')
// const Message = require("../DataBase/message.js");
// const Message = require("../DataBase/message.js");
const {solanaDeposit} = require('../SolanaEventsFunctions/depositEvent')
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
async function pollSorobanEvents() {
    try {
        // Define the request object
        let requestObject = {
            jsonrpc: "2.0",
            id: 8675309,
            method: "getEvents",
            params: { //519341
                      //227000
                // If lastLedger is null, use "227000" as the start ledger
                // Otherwise, increment lastLedger by one and use it as the start ledger
                startLedger: lastLedger ? (lastLedger + 1).toString() : "537711",
                filters: [
                    {
                        type: "contract",
                        contractIds: [
                            "CCR5VJ4YWL27WTII4RAVBYKQ7UP6232I2IWCBIKQCV6XBOGJ6OGKCYKI",
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
            console.error(json.error.message);
            return;
        }

        // Get the result object from the response
        let result = json.result;
     //   console.log("🚀 ~ file: test.js:69 ~ pollSorobanEvents ~ result:", result)

        // Get the latest ledger number from the result and update lastLedger
        let latestLedger = parseInt(result.latestLedger);
        lastLedger = latestLedger;

        // Get the events array from the result
        let events = result.events;
     //  console.log("🚀 ~ file: test.js:77 ~ pollSorobanEvents ~ events:", events)
        // console.log("🚀 ~ file: events.ts:49 ~ test ~ event value:",events.value)
        let store_events_value;
        let val=events?.map((e)=>{
         //   console.log("eee",e?.value)
           // let scVal = SorobanClient.xdr.ScVal.fromXDR(event.events[0]?.value.xdr,"base64")
           store_events_value = e?.value.xdr;
          })
        let scVal = SorobanClient.xdr.ScVal.fromXDR(store_events_value,"base64")

        let converted_value = SorobanClient.scValToNative(scVal)

        const convertedData = convertBigIntToString(converted_value);
        let transaction_hash = "e4eb26470ad1f19f900b1e943d8bd5edf71bc1e8c3fd6ca9b39b93fbf4936b40"
     await solanaDeposit(convertedData , 0 , transaction_hash )
       // post_api(convertedData)
        console.log("🚀 ~ file: test.js:98 ~ val ~ convertedData:", convertedData)

        // Check if there are any events in the array
        if (events.length > 0) {
            // Log the number of events and their ids
           // console.log(`Received ${events.length} events:`);
            for (let event of events) {
             //   console.log(event.id);
            }
        } else {
            // Log that there are no events in this interval
            console.log("No events in this interval.");
        }
    } catch (error) {
        // Log any other errors that may occur
        console.error(error.message);
    }
}

// Schedule a cron job to run every 2 minutes and call pollSorobanEvents
cron.schedule("*/1 * * * *", pollSorobanEvents);

// Start listening on port 3000
app.listen(3000, () => console.log("Server is listening on port 3000."));