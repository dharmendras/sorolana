const { request, gql } = require('graphql-request');
const stellar_sdk = require('stellar-sdk')
const Message = require("../DataBase/message.js");
const { solanaDeposit } = require('./SolanaEventsFunctions/depositEvent')
const axios = require("axios");
let base_url = "http://localhost:3400";
const cron = require("node-cron");
const express = require("express");

const app = express();

const dotenv = require("dotenv");
dotenv.config();
// GraphQL endpoint URL
const endpoint = process.env.GRAPHQL_ENDPOINT_URL;
async function pollSorobanDepositEvents() {

  //  GraphQL query
  const query = gql`
query GetEvents {
  eventByContractId(searchedContractId: "CBHO36ESJS3BXXXBFITIYIJFBIHKFGWZ4722RS26REJZALEGFWKHEA35") {
    edges {
      node {
        data
        contractId
        topic1
        topic2
        topic3
        topic4
        txInfoByTx {
          fee
          ledgerByLedger {
            closeTime
            sequence
          }
          txHash
          opCount
        }
      }
    }
  }
}
`;

  //  JWT access token
  const accessToken = process.env.MERCURY_ACCESS_TOKEN;

  // Send the GraphQL request with the authorization header
  async function runQuery() {
    try {
      const response = await request(endpoint, query, null, { Authorization: `Bearer ${accessToken}` });

      // Process the response data here
      console.log("response", JSON.stringify(response, null, 2));
      console.log("response_length", response.eventByContractId.edges.length);
      for (let i = 0; i < response.eventByContractId.edges.length; i++) {
        let txHash = response.eventByContractId.edges[i].node.txInfoByTx.txHash.replace(/\\x/g, '');
        let validator_key = "FEaCknQm2waus3urndPr8gGHq1XamLD7kjGJuGXAQyjD"
        console.log("🚀 ~ runQuery ~ validator_key:", validator_key)

        try {
          const apiUrl = `${base_url}/gmp/CheckTxHashForRepeatingEvents/${txHash}`;
          const getResponse = await axios.get(apiUrl);
          console.log("🚀 ~ runQuery ~ getResponse:", getResponse.data)

          const apiUrl1 = `${base_url}/gmp/CheckTxHashForRepeatingEventsInMessageQueue/${txHash}`;
          const get_message_queue_Response = await axios.get(apiUrl);
          console.log("🚀 ~ runQuery ~ getResponse1:", get_message_queue_Response.data)
          ///gmp/Id_Message/:txHash
          if (getResponse.data == 'YES' && get_message_queue_Response.data == 'YES') {
            console.log("Tx_hash alrady available")
            console.log("🚀 ~ runQuery  line 64 ~ txHash:", txHash)

            const apiUrl = `${base_url}/gmp/Id_Message/${txHash}`;
            const get_message_queue_Response = await axios.get(apiUrl);

            console.log("🚀 ~ runQuery ~ get_message_queue_Response:", get_message_queue_Response.data[0].id)
            let id = get_message_queue_Response.data[0].id
            //  /gmp/getPubkeyFromSignature/:id
            const Url = `${base_url}/gmp/getPubkeyFromSignature/${id}`;
            const Response = await axios.get(Url);

            // console.log("🚀 ~ runQuery ~ Response:", Response.data[0])

            console.log("🚀 ~ runQuery ~ Response:", Response.data[0].validator_sign)
            let pub_array = Response.data[0].public_key
            console.log("🚀 ~ runQuery ~ pub_array:", pub_array)

            let signature_length = Response.data[0].validator_sign.length
            console.log("🚀 ~ runQuery ~ signature_length:", signature_length)

            for (let i = 0; i < pub_array.length; i++) {
              console.log("pubkey", pub_array[i])
              if (pub_array[i] == validator_key) {
                console.log("Yes! pubkey is available on signature table")
              }
              else {
                console.log("NO! pubkey is available on signature table")
                console.log("===> Response.data[0].public_key.length<===" , Response.data[0].public_key.length)
                if (Response.data[0].public_key.length >= 5) {
                  console.log("===> line number 100<===")
                }
                else {
                  console.log("call solana deposit methos")
                  let scVal = stellar_sdk.xdr.ScVal.fromXDR(response.eventByContractId.edges[i].node.data, "base64")
                  let converted_value = stellar_sdk.scValToNative(scVal)
                  console.log("🚀 ~ runQuery ~ converted_value:", converted_value)

                  await solanaDeposit(converted_value, 0, txHash)
                }
              }
            }


          }
          else {
            console.log("Tx_hash not available")
            console.log("🚀 ~ runQuery line 69  ~ txHash:", txHash)

            let scVal = stellar_sdk.xdr.ScVal.fromXDR(response.eventByContractId.edges[i].node.data, "base64")
            let converted_value = stellar_sdk.scValToNative(scVal)
            console.log("🚀 ~ runQuery ~ converted_value:", converted_value)



            await solanaDeposit(converted_value, 0, txHash)

          }


        } catch (error) {
          console.log("🚀 ~ runQuery ~ error:", error)

        }



      }
      // console.log("response stringify", JSON.stringify(response.eventByContractId.edges[0].node.data));
      // let scVal = stellar_sdk.xdr.ScVal.fromXDR(response.eventByContractId.edges[0].node.data, "base64")
      // let converted_value = stellar_sdk.scValToNative(scVal)
      // console.log("🚀 ~ runQuery ~ converted_value:", converted_value)
    } catch (error) {
      console.error('Error executing GraphQL query:', error.message);
    }
  }

  // Run the query
  runQuery();
}
cron.schedule("*/1 * * * *", pollSorobanDepositEvents);

app.listen(3001, () => console.log("Server is listening on port 3001."));