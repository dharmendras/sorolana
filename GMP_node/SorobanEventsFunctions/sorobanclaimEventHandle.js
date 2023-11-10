let base_url = "http://localhost:3400";
const axios = require("axios");
const bs58 = require("bs58");
const nacl = require("tweetnacl");
const { Keypair, PublicKey } = require("@solana/web3.js");
const v = require("../solana_validators/validator1.json");
//const abc = '/home/imentus/Documents/Sorolana/sorolana/GMP_node/solana_validators/validator1.json';
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

let validator_kp = Keypair.fromSecretKey(
  // new Uint8Array(JSON.parse(fs.readFileSync(`${validatorPath}`).toString()))
  new Uint8Array(
    JSON.parse(fs.readFileSync("./solana_validators/validator1.json"))
  )
);

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
      if (response.data.data != 0) {
        console.log(
          "🚀 ~ file: claimEvent.js:61 ~ .then ~ userCounter:",
          userCounter
        );
        if (response.data.data[0].queue_id == userCounter + 1) {
          let res = response.data.data[0];
          let msg = response.data.data[0].message_info;

          const message = msg;
          console.log(
            "🚀 ~ file: sorolan_bridge.ts:234 ~ it ~ message:",
            message
          );
          const messageBytes = Buffer.from(message, "utf-8");

          console.log(
            "🚀 ~ file: sorolan_bridge.ts:152 ~ it ~ messageBytes:",
            messageBytes
          );
          let stellar_kp = StellarSdk.Keypair.fromSecret(process.env.PRIVATE_KEY);

          let buffer_signatures = stellar_kp.sign(Buffer.from(messageBytes));

          let buffer_raw_public_key = stellar_kp.rawPublicKey();

          let validator_pkey = buffer_raw_public_key.toString("base64");

          let va_sign = buffer_signatures.toString("base64");

        //   const signer_pkey = validator_kp.publicKey.toBytes();
        //   console.log(
        //     "🚀 ~ file: sorolan_bridge.ts:155 ~ it ~ signer_pkey:",
        //     signer_pkey
        //   );

        //   const signature = nacl.sign.detached(
        //     messageBytes,
        //     validator_kp.secretKey
        //   );
        //   console.log(
        //     "🚀 ~ file: sorolan_bridge.ts:154 ~ it ~ signature:",
        //     signature
        //   );
        //   console.log(
        //     "🚀 ~ file: validator1.js:354 ~ .then ~ Buffer.from(signature).toString('base64'):",
        //     Buffer.from(signature).toString("hex")
        //   );

          // First insert the details of the signed message into the message table
          let message_queue_data = {
            amount: res.amount,
            from: res.from_address,
            receiver: res.receiver,
            destination_chain_id: res.destination_chain_id,
            date: new Date(Date.now()).toLocaleString(),
            transaction_hash: res.transaction_hash,
            status: "success",
            message: res.message_info,
            queue_id: res.queue_id,
            is_claimed: 'NO'
          };
          console.log("🚀 ~ file: claimEvent.js:110 ~ .then ~ message_queue_data:", message_queue_data)

          let message_res = await axios.post(
            `${base_url}/gmp/Message`,
            message_queue_data
          );
          console.log("🚀 ~ file: claimEvent.js:115 ~ .then ~ message_res:", message_res)

          let validator_data = {
            validator_sig: Buffer.from(signature).toString("hex"),
            validator_pkey: validator_kp.publicKey.toBase58(),
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
