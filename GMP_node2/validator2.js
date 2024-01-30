const { request, gql } = require('graphql-request');
// const stellar_sdk = require('stellar-sdk')
//const Message = require("../DataBase/message.js");
const axios = require("axios");
let base_url = "http://localhost:3400";
const cron = require("node-cron");
const express = require("express");

const app = express();


const NETWORK_PASSPHRASE = "Test SDF Future Network ; October 2022";
const SOROBAN_RPC_URL = "https://rpc-futurenet.stellar.org:443/";
const scvalToBigNumber = require("./convert.js");
const solanaWeb3 = require("@solana/web3.js");
const anchorr = require("@coral-xyz/anchor");
const { PublicKey } = require("@solana/web3.js");
const { Keypair } = require("@solana/web3.js");
const { EventParser, BorshCoder, web3 } = require("@coral-xyz/anchor");
const bs58 = require("bs58");
const StellarSdk = require("stellar-sdk");
const util = require("tweetnacl-util");
const idl = require("./idl.json");
//const Message = require("../DataBase/message.js");
const nacl = require("tweetnacl");
const { anchor } = require("@coral-xyz/anchor");
const { Program } = require("@coral-xyz/anchor");
const { AnchorProvider } = require("@coral-xyz/anchor");
//const axios = require("axios");
const stellar_sdk = require('stellar-sdk')
// const Message = require("../DataBase/message.js");
// const Message = require("../DataBase/message.js");
const { solanaDeposit } = require('./SolanaEventsFunctions/depositEvent')
const { solanaWithdraw } = require('./SolanaEventsFunctions/withdrawEvent')
const { SorobanClaimEventHandle } = require('./SorobanEventsFunctions/sorobanclaimEventHandle.js')


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
// GraphQL endpoint URL
const endpoint = process.env.GRAPHQL_ENDPOINT_URL;
async function pollSorobanDepositEvents() {

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
     // console.log("response_length", response.eventByContractId.edges.length);
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

          if ( getResponse1.data == 'YES') {
            console.log("Tx_hash alrady available")
            console.log("🚀 ~ runQuery  line 64 ~ txHash:", txHash)

          }
          // else {
          //   console.log("Tx_hash not available")
          //   console.log("🚀 ~ runQuery line 69  ~ txHash:", txHash)

          //   let scVal = stellar_sdk.xdr.ScVal.fromXDR(response.eventByContractId.edges[i].node.data, "base64")
          //   let converted_value = stellar_sdk.scValToNative(scVal)
          //   console.log("🚀 ~ runQuery ~ converted_value:", converted_value)



          //   await solanaDeposit(converted_value, 0, txHash)

          // }


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
}
cron.schedule("*/1 * * * *", pollSorobanDepositEvents);

app.listen(3002, () => console.log("Server is listening on port 3002."));