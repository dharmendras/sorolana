const { request, gql } = require('graphql-request');
const stellar_sdk = require('stellar-sdk')
const Message = require("../DataBase/message.js");
const { solanaDeposit } = require('./SolanaEventsFunctions/depositEvent')
const axios = require("axios");
let base_url = "http://localhost:3400";
const dotenv = require("dotenv");
dotenv.config();
// GraphQL endpoint URL
const endpoint = process.env.GRAPHQL_ENDPOINT_URL;

//  GraphQL query
const query = gql`
  query GetEvents {
    eventByContractId(searchedContractId: "CALEKHB75XZSYHNR4W4CO453UP2LU5U7JED33MDO6LUXQ35DQEYUBAY4") {
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
    //CheckTxHashForRepeatingEventsInMessageQueue
    for (let i = 0; i < response.eventByContractId.edges.length; i++) {
      let txHash = response.eventByContractId.edges[i].node.txInfoByTx.txHash.replace(/\\x/g, '');

      try {
        const apiUrl = `${base_url}/gmp/CheckTxHashForRepeatingEvents/${txHash}`;
        const getResponse = await axios.get(apiUrl);
        console.log("🚀 ~ runQuery ~ getResponse:", getResponse.data)

        const apiUrl1 = `${base_url}/gmp/CheckTxHashForRepeatingEventsInMessageQueue/${txHash}`;
        const getResponse1 = await axios.get(apiUrl);
        console.log("🚀 ~ runQuery ~ getResponse1:", getResponse1.data)

        if (getResponse.data == 'YES' && getResponse1.data == 'YES') {
          console.log("Tx_hash alrady available")
          console.log("🚀 ~ runQuery  line 64 ~ txHash:", txHash)

        }
        else {
          console.log("Tx_hash not available")
          console.log("🚀 ~ runQuery line 69  ~ txHash:", txHash)

          let scVal = stellar_sdk.xdr.ScVal.fromXDR(response.eventByContractId.edges[i].node.data, "base64")
          let converted_value = stellar_sdk.scValToNative(scVal)
          console.log("🚀 ~ runQuery ~ converted_value:", converted_value)


          // Remove double backslashes
          // let txHash = response.eventByContractId.edges[i].node.txInfoByTx.txHash.replace(/\\x/g, '');
          // console.log("🚀 ~ runQuery ~ txHash:", txHash)
          await solanaDeposit(converted_value, 0, txHash)

        }


      } catch (error) {

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
