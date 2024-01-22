let base_url = "http://localhost:3400";
const axios = require("axios");
const bs58 = require("bs58");
const nacl = require("tweetnacl");
const { Keypair, PublicKey } = require("@solana/web3.js");
const v = require("../solana_validators/validator3.json");
//const abc = '/home/imentus/Documents/Sorolana/sorolana/GMP_node/solana_validators/validator1.json';
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

let validator_kp = Keypair.fromSecretKey(
  // new Uint8Array(JSON.parse(fs.readFileSync(`${validatorPath}`).toString()))
  new Uint8Array(
    JSON.parse(fs.readFileSync("./solana_validators/validator3.json"))
  )
);

async function solanaClaim(event, slot, transaction_id) {
  console.log(
    "🚀 ~ file: validator1.js:296 ~ solanaClaim ~ transaction_id:",
    transaction_id
  );
  console.log("🚀 ~ file: validator1.js:296 ~ solanaClaim ~ slot:", slot);
  console.log("🚀 ~ file: validator1.js:296 ~ solanaClaim ~ event:", event);

  console.log("🚀 ~ solanaClaim ~ userAddress:", event.userValidatorAddress.toBase58())

  // let userAddress = event.userValidatorAddress.toBase58();
  let userAddress = '4ubRFnu8fNE5jz42bQ9ipDxb2zietTHFEv9YbvnPqsYQ';
  console.log("🚀 ~ solanaClaim ~ userAddress:", userAddress)
  let userCounter = event.claimCounter.toNumber();
  console.log("🚀 ~ solanaClaim ~ userCounter:", userCounter)

  let message_data = {
    queue_id: userCounter,
  };
  let is_true = await axios.get(`${base_url}/gmp/CheckIsClaimedInMessage/${userAddress}`)

  console.log("🚀 ~ solanaClaim ~ is_true:", is_true.data.length)
  if (is_true.data.length == 1) {
    console.log("Yup!!")
   

  }

  else {
    console.log(" other validator will sign and append signature in signature table")
  }
}
module.exports = { solanaClaim };
