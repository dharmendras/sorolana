let base_url = "http://localhost:3400";
const axios = require("axios");
const bs58 = require("bs58");
const nacl = require("tweetnacl");
const { Keypair, PublicKey } = require("@solana/web3.js");
//const abc = '/home/imentus/Documents/Sorolana/sorolana/GMP_node/solana_validators/validator1.json';
 const abc = '/home/imentus/Documents/imentus_project/sorolana/GMP_node/solana_validators/validator1.json'
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

let validator_kp = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(fs.readFileSync(`${abc}`).toString()))
);

async function solanaClaim(event, slot, transaction_id) {
  console.log(
    "🚀 ~ file: validator1.js:296 ~ solanaClaim ~ transaction_id:",
    transaction_id
  );
  console.log("🚀 ~ file: validator1.js:296 ~ solanaClaim ~ slot:", slot);
  console.log("🚀 ~ file: validator1.js:296 ~ solanaClaim ~ event:", event);

  let userAddress = event.userAddress.toBase58();
  let userCounter = event.claimCounter;

  let message_data = {
    queue_id: userCounter,
  };

  await axios
    .delete(`${base_url}/message_queue/${userAddress}`, {
      data: message_data,
    })
    .then((response) => {
      console.log(response);
    });

  // to know if there is more unclaimed msgs presents in the queue
  await axios
    .get(`${base_url}/message_queue/${userAddress}`)
    .then(async (response) => {
      console.log(
        "🚀 ~ file: validator1.js:201 ~ axios.get ~ response:",
        response.data.length
      );
      if (response.data[0].queue_id == userCounter + 1) {
        let res = response.data[0];
        console.log(
          "🚀 ~ file: validator1.js:209 ~ awaitaxios.get ~ response.data:",
          response.data[0].queue_id
        );
        let msg = response.data[0].message_info;

        const message = JSON.stringify(msg);
        console.log(
          "🚀 ~ file: sorolan_bridge.ts:234 ~ it ~ message:",
          message
        );
        const messageBytes = Buffer.from(message, "utf-8");

        console.log(
          "🚀 ~ file: sorolan_bridge.ts:152 ~ it ~ messageBytes:",
          messageBytes
        );
        const signer_pkey = validator_kp.publicKey.toBytes();
        console.log(
          "🚀 ~ file: sorolan_bridge.ts:155 ~ it ~ signer_pkey:",
          signer_pkey
        );

        const signature = nacl.sign.detached(
          messageBytes,
          validator_kp.secretKey
        );
        console.log(
          "🚀 ~ file: sorolan_bridge.ts:154 ~ it ~ signature:",
          signature
        );
        console.log(
          "🚀 ~ file: validator1.js:354 ~ .then ~ Buffer.from(signature).toString('base64'):",
          Buffer.from(signature).toString("base64")
        );
        let validator_data = {
          validator_sig: Buffer.from(signature).toString("base64"),
          validator_pkey: validator_kp.publicKey.toBase58(),
          message_id: response.data[0].id,
        };
        await axios
          .post(`${base_url}/Signature`, validator_data)
          .then(async (response) => {
            console.log(
              "🚀 ~ file: validator1.js:364 ~ .then ~ response:",
              response
            );
          });

        let message_queue_data = {
          amount: res.amount,
          from: res.from_address,
          to: res.receiver,
          toChain: res.destination_chain_id,
          date: new Date().getDate,
          transaction_hash: res.transaction_hash,
          status: "pending",
          message: res.message_info,
          queue_id: res.queue_id,
        };

        await axios
          .post(`${base_url}/Message`, message_queue_data)
          .then(async (response) => {
            console.log(
              "🚀 ~ file: claimEvent.js:118 ~ .then ~ response:",
              response
            );
          });
      } else {
        console.log("Some thing went wrong");
      }
    });
}
module.exports = { solanaClaim };
