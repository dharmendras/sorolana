const { request, gql } = require('graphql-request');
const stellar_sdk = require('stellar-sdk')
const Message = require("../DataBase/message.js");
const { solanaDeposit } = require('./SolanaEventsFunctions/depositEvent')

// GraphQL endpoint URL
const endpoint = 'http://172.232.157.194:5000/graphql';

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
const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic29yb2xhbmEiLCJleHAiOjE3MDY1NTk5NjUsInVzZXJfaWQiOjE3LCJ1c2VybmFtZSI6InNvcm9sYW5hQG1lcmN1cnl0ZXN0ZXIuYXBwIiwiaWF0IjoxNzA1OTU1MTY0LCJhdWQiOiJwb3N0Z3JhcGhpbGUiLCJpc3MiOiJwb3N0Z3JhcGhpbGUifQ.ezhqw01GgUlQ8nbFl3da8rjQZbukXhNsdiAFOnBs4QI';

// Send the GraphQL request with the authorization header
async function runQuery() {
  try {
    const response = await request(endpoint, query, null, { Authorization: `Bearer ${accessToken}` });

    // Process the response data here
    console.log("response", JSON.stringify(response, null, 2));
    console.log("response_length", response.eventByContractId.edges.length);

    for (let i = 0; i < response.eventByContractId.edges.length; i++) {
      let scVal = stellar_sdk.xdr.ScVal.fromXDR(response.eventByContractId.edges[i].node.data, "base64")
      let converted_value = stellar_sdk.scValToNative(scVal)
      console.log("🚀 ~ runQuery ~ converted_value:", converted_value)


      // Remove double backslashes
      let txHash = response.eventByContractId.edges[i].node.txInfoByTx.txHash.replace(/\\x/g, '');
      console.log("🚀 ~ runQuery ~ txHash:", txHash)
      await solanaDeposit(converted_value, 0, txHash)

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
