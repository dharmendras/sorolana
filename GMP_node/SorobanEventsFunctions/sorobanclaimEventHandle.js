let base_url = "http://localhost:3400";
const axios = require("axios");
const bs58 = require("bs58");
// const nacl = require("tweetnacl");
const StellarSdk = require('stellar-sdk');

// const { Keypair, PublicKey } = require("@solana/web3.js");
// const v = require("../solana_validators/validator1.json");
// //const abc = '/home/imentus/Documents/Sorolana/sorolana/GMP_node/solana_validators/validator1.json';
// const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();



async function SorobanClaimEventHandle(event, slot, transaction_id) {
  console.log(
    "🚀 ~ file: validator1.js:296 ~ solanaClaim ~ transaction_id:",
    transaction_id
  );
  console.log("🚀 ~ file: validator1.js:296 ~ solanaClaim ~ slot:", slot);
  console.log("🚀 ~ file: validator1.js:296 ~ solanaClaim ~ event:", event);

  let userAddress = event.user_address;
  let userCounter = Number(event.Claim_Counter);
  console.log("🚀 ~ file: sorobanclaimEventHandle.js:29 ~ SorobanClaimEventHandle ~ userCounter:", userCounter)

  let message_data = {
    queue_id: userCounter,
  };

  let response = await axios.put(`${base_url}/gmp/Message/${userAddress}`, {
    queue_id: userCounter,
  });
  console.log(
    "🚀 ~ file: claimEvent.js:33 ~ solanaClaim ~ response:",
    response.data
  );
  await axios
    .delete(`${base_url}/gmp/message_queue/${userAddress}`, {
      data: message_data,
    })
    .then((response) => {
      console.log(response.data);
    });

  // to know if there is more unclaimed msgs presents in the queue
  await axios
    .get(`${base_url}/gmp/message_queue/${userAddress}`)
    .then(async (response) => {
      console.log(
        "🚀 ~ file: validator1.js:201 ~ axios.get ~ response:",
        response.data
      );
      console.log("====>line number 58 <======", response.data.data)
      if (response.data.data != 0) {
        console.log(
          "🚀 ~ file: claimEvent.js:61 ~ .then ~ userCounter:",
          userCounter
        );
        console.log("====>line number 64  <======", response.data.data[0].queue_id)
        if (response.data.data[0].queue_id == userCounter + 1) {
          let res = response.data.data[0];
          let msg = response.data.data[0].message_info;

          const jsonObject = JSON.parse(msg);
          //const counterValue = jsonObject.counter;
          let soroban_msg = {
            counter: jsonObject.counter,
            tokenAddress: jsonObject.tokenAddress,
            tokenChain: jsonObject.tokenChain,
            to: jsonObject.to,
            toChain: jsonObject.toChain,
            fee: 100,
            method: jsonObject.method,
            amount: jsonObject.amount,
          };
          console.log("🚀 ~ file: sorobanclaimEventHandle.js:78 ~ .then ~ soroban_msg:", soroban_msg)

          const message = msg;

          console.log(
            "🚀 ~ file: sorolan_bridge.ts:234 ~ it ~ message:",
            soroban_msg
          );
          const messageBytes = Buffer.from(JSON.stringify(soroban_msg));

          console.log(
            "🚀 ~ file: sorolan_bridge.ts:152 ~ it ~ messageBytes:",
            messageBytes
          );
          let stellar_kp = StellarSdk.Keypair.fromSecret(process.env.PRIVATE_KEY);



          let buffer_signatures = stellar_kp.sign(messageBytes);

          let buffer_raw_public_key = stellar_kp.rawPublicKey();

          let validator_pkey = buffer_raw_public_key.toString("base64");
          console.log("🚀 ~ file: sorobanclaimEventHandle.js:88 ~ .then ~ validator_pkey:", validator_pkey)

          let va_sign = buffer_signatures.toString("base64");
          console.log("🚀 ~ file: sorobanclaimEventHandle.js:94 ~ .then ~ va_sign:", va_sign)



          // First insert the details of the signed message into the message table
          let message_queue_data = {
            amount: res.amount,
            from: res.from_address,
            receiver: res.receiver,
            destination_chain_id: res.destination_chain_id,
            date: new Date(Date.now()).toLocaleString(),
            transaction_hash: res.transaction_hash,
            status: "success",
            //  message: res.message_info,
            message: soroban_msg,
            queue_id: res.queue_id,
            is_claimed: 'NO'
          };
          console.log("🚀 ~ file: claimEvent.js:110 ~ .then ~ message_queue_data:", message_queue_data)

          let message_res = await axios.post(
            `${base_url}/gmp/Message`,
            message_queue_data
          );
          console.log("🚀 ~ file: claimEvent.js:117 ~ .then ~ message_res:", message_res)

          let validator_data = {
            validator_sig: va_sign,
            validator_pkey: validator_pkey,
            message_id: message_res.data.row_id,
          };
          console.log(
            "🚀 ~ file: claimEvent.js:99 ~ .then ~ validator_data:",
            validator_data
          );
          await axios
            .post(`${base_url}/gmp/Signature`, validator_data)
            .then(async (response) => {
              console.log(
                "🚀 ~ file: validator1.js:364 ~ .then ~ response:",
                response
              );
            });
        }
      } else {
        console.log("No pending messages for this receiver");
      }
    });
}
module.exports = { SorobanClaimEventHandle };



