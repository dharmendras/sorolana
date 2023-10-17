let base_url = "http://localhost:3400";
const axios = require("axios");
const bs58 = require("bs58");
const nacl = require("tweetnacl");
const { Keypair, PublicKey } = require("@solana/web3.js");
const abc =
  "/home/imentus/Documents/Sorolana/sorolana/GMP_node/solana_validators/validator1.json";

const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

let validator_kp = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(fs.readFileSync(`${abc}`).toString()))
);

async function solanaDeposit(event, slot, transaction_id) {
  console.log("Deposit method invokes");
  console.log(
    "🚀 ~ file: validator1.js:206 ~ solanaDeposit ~ transaction_id:",
    transaction_id
  );
  console.log("🚀 ~ file: validator1.js:206 ~ solanaDeposit ~ slot:", slot);
  console.log("🚀 ~ file: validator1.js:206 ~ solanaDeposit ~ event:", event);
  let receiverId = 0;
  let [receiver_pda, userBump] = await getUserPda(
    new PublicKey(event.receiverAddress)
  );
  console.log(
    "🚀 ~ file: validator1.js:196 ~ axios.get ~ receiver_pda.toBase58():",
    receiver_pda.toBase58()
  );

  await axios
    .get(`${get_queue_id}/${receiver_pda.toBase58()}`)
    .then(async (response) => {
      console.log(
        "🚀 ~ file: validator1.js:201 ~ axios.get ~ response:",
        response.data.length
      );
      if (response.data.length == 0) {
        receiverId = 0;
        console.log(
          "🚀 ~ file: validator1.js:206 ~ axios.get ~ receiverId:",
          receiverId
        );
        let receiverDetails = {
          receiver: receiver_pda.toBase58(),
          queue_id: receiverId,
        };
        await axios.post(get_queue_id, receiverDetails).then((response) => {
          console.log(response);
        });
      } else if (response.data.length > 0) {
        console.log(
          "🚀 ~ file: validator1.js:209 ~ awaitaxios.get ~ response.data:",
          response.data[0].queue_id
        );
        receiverId = response.data[0].queue_id + 1;

        await axios
          .put(`${get_queue_id}/${receiver_pda.toBase58()}`, {
            queue_id: receiverId,
          })
          .then((response) => {
            console.log(
              "🚀 ~ file: validator1.js:229 ~ awaitaxios.put ~ response:",
              response.data
            );
          });
      } else {
        console.log("Some thing went wrong");
      }
      console.log(
        "🚀 ~ file: validator1.js:218 ~ .then ~ receiverId:",
        receiverId
      );
    });

  let solana_msg = {
    counter: receiverId,
    tokenAddress: event.tokenAddress,
    tokenChain: event.tokenChain,
    to: event.receiverAddress,
    toChain: event.toChain,
    fee: 100,
    method: event.method,
    amount: event.amount,
  };
  const message = JSON.stringify(solana_msg);
  console.log(
    "🚀 ~ file: validator1.js:272 ~ solanaDeposit ~ message:",
    message
  );

  if (event.amount > 0) {
    console.log("matched");
    try {
      let data = {
        amount: event.amount,
        from: event.from,
        receiver: event.receiverAddress,
        destination_chain_id: event.toChain,
        date: new Date().getDate,
        transaction_hash: `${transaction_id}`,
        status: "pending",
        message: message,
        queue_id: receiverId,
        receiver_pda: receiver_pda.toBase58(),
      };
      console.log(
        "🚀 ~ file: validator1.js:185 ~ solanaToSoroban ~ data:",
        data
      );
      await axios.post(`${db_url}/message_queue`, data).then((response) => {
        console.log(response);
      });

      await axios
        .get(`${db_url}/Message/${userAddress}`)
        .then(async (response) => {
          console.log(
            "🚀 ~ file: validator1.js:201 ~ axios.get ~ response:",
            response.data.length
          );
        });
    } catch (error) {
      console.log(
        "🚀 ~ file: validator1.js:178 ~ solanaToSoroban ~ error:",
        error
      );
    }
  } else {
    console.log("Not Matched");
  }
}
module.exports = { solanaDeposit };
