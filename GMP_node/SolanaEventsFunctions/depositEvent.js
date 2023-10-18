let base_url = "http://localhost:3400";
const get_queue_id = "http://localhost:3400/userCounter";

const axios = require("axios");
const bs58 = require("bs58");
const nacl = require("tweetnacl");
const web3 = require("@solana/web3.js");
const anchorr = require("@coral-xyz/anchor");
const { Program } = require("@coral-xyz/anchor");
const { AnchorProvider } = require("@coral-xyz/anchor");
const idl = require("../idl.json");

const { Keypair, PublicKey } = require("@solana/web3.js");
const abc =
  "/home/imentus/Documents/imentus_project/sorolana/GMP_node/solana_validators/validator1.json";

const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

const opts = {
  preflightCommitment: "processed",
};
const network = "https://api.devnet.solana.com";
const connection = new web3.Connection(network, "confirmed");
const programID = new PublicKey(idl.metadata.address);
const provider = new AnchorProvider(connection, opts.preflightCommitment);
const program = new Program(idl, programID, provider);
const USER_SEED_PREFIX = "prevent_duplicate_claimV1";

let validator_kp = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(fs.readFileSync(`${abc}`).toString()))
);
const getUserPda = async (user) => {
  const userPdaInfo = web3.PublicKey.findProgramAddressSync(
    [anchorr.utils.bytes.utf8.encode(USER_SEED_PREFIX), user.toBuffer()],
    program.programId
  );
  return userPdaInfo;
};

async function solanaDeposit(event, slot, transaction_id) {
  console.log("Deposit method invokes");
  console.log(
    "🚀 ~ file: validator1.js:206 ~ solanaDeposit ~ transaction_id:",
    transaction_id
  );
  console.log("🚀 ~ file: validator1.js:206 ~ solanaDeposit ~ slot:", slot);
  console.log("🚀 ~ file: validator1.js:206 ~ solanaDeposit ~ event:", event);
  console.log(
    "🚀 ~ file: depositEvent.js:36 ~ solanaDeposit ~ event.receiver_address:",
    event.receiver_address
  );
  let receiverId = 0;
  let [receiver_pda, userBump] = await getUserPda(
    new PublicKey(event.receiver_address)
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
    tokenAddress: event.token_address,
    tokenChain: event.token_chain,
    to: event.receiver_address,
    toChain: event.to_chain,
    fee: 100,
    method: "deposit",
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
      let timestamp = Date.now();
      let date = new Date(timestamp);
      const formattedDate = date.toLocaleString();
      let data = {
        amount: event.amount,
        from: event.from,
        receiver: event.receiver_address,
        destination_chain_id: event.to_chain,
        date: formattedDate,
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
      await axios.post(`${base_url}/message_queue`, data).then((response) => {
        console.log(response);
      });
      if (receiverId == 0) {
        const msg = JSON.stringify(message);
        console.log("🚀 ~ file: sorolan_bridge.ts:234 ~ it ~ message:", msg);
        const messageBytes = Buffer.from(msg, "utf-8");

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
        await axios.post(`${base_url}/Message`, data).then((response) => {
          console.log(response);
        });
      }
      // await axios
      //   .get(`${base_url}/Message/${userAddress}`)
      //   .then(async (response) => {
      //     console.log(
      //       "🚀 ~ file: validator1.js:201 ~ axios.get ~ response:",
      //       response.data.length
      //     );
      //   });
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
