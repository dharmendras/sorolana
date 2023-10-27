let base_url = "http://localhost:3400";
const axios = require("axios");
const bs58 = require("bs58");
const anchorr = require("@coral-xyz/anchor");
const StellarSdk = require("stellar-sdk");
const web3 = require("@solana/web3.js");
const { AnchorProvider, Program } = require("@coral-xyz/anchor");
const idl = require("../idl.json");
const nacl = require("tweetnacl");
const validaor_kp_path =
  "/home/imentus/Documents/Sorolana/sorolana/GMP_node/solana_validators/validator1.json";

const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

const opts = {
  preflightCommitment: "processed",
};
const network = "https://api.devnet.solana.com";
const connection = new web3.Connection(network, "confirmed");
const programID = new web3.PublicKey(idl.metadata.address);
const provider = new AnchorProvider(connection, opts.preflightCommitment);
const USER_SEED_PREFIX = "prevent_duplicate_claimV1";
const program = new Program(idl, programID, provider);

const getUserPda = async (user) => {
  const userPdaInfo = web3.PublicKey.findProgramAddressSync(
    [anchorr.utils.bytes.utf8.encode(USER_SEED_PREFIX), user.toBuffer()],
    program.programId
  );
  return userPdaInfo;
};

let receiverId = 0;

async function solanaWithdrawEventHandle(event, slot, transaction_id) {
  console.log(
    "🚀 ~ file: solanaWithdrawHandle.js:13 ~ solanaWithdrawEventHandle ~ transaction_id:",
    transaction_id
  );
  console.log(
    "🚀 ~ file: solanaWithdrawHandle.js:13 ~ solanaWithdrawEventHandle ~ slot:",
    slot
  );
  console.log(
    "🚀 ~ file: solanaWithdrawHandle.js:13 ~ solanaWithdrawEventHandle ~ event:",
    event
  );

  let tx = await connection.getParsedTransaction(transaction_id);
  let user_key = tx.transaction.message.accountKeys[1].pubkey;

  let [receiver_pda, userBump] = await getUserPda(user_key);

  await axios
    .get(`${base_url}/gmp/userCounter/${receiver_pda.toBase58()}`)
    .then(async (response) => {
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
        let response = await axios.post(
          `${base_url}/gmp/userCounter`,
          receiverDetails
        );
        console.log(
          "🚀 ~ file: depositEvent.js:70 ~ .then ~ response:",
          response.data.message
        );
      } else if (response.data.length > 0) {
        receiverId = response.data[0].queue_id + 1;
        let res = await axios.put(
          `${base_url}/gmp/userCounter/${receiver_pda.toBase58()}`,
          {
            queue_id: receiverId,
          }
        );
        console.log(
          "🚀 ~ file: depositEvent.js:84 ~ .then ~ res:",
          res.data.message
        );
      } else {
        console.log("Some thing went wrong");
      }
    });

  let soroban_msg = {
    counter: receiverId,
    tokenAddress: event.tokenAddress,
    tokenChain: event.tokenChain,
    to: event.withdrawerAddress,
    toChain: event.toChain,
    fee: 100,
    method: event.method,
    amount: event.amount.toNumber()
  };
  console.log(
    "🚀 ~ file: solanaWithdrawHandle.js:103 ~ solanaWithdrawEventHandle ~ event.amount.toNumber()/web3.LAMPORTS_PER_SOL:",
    event.amount.toNumber()
  );
  const message = JSON.stringify(soroban_msg);
  console.log(
    "🚀 ~ file: validator1.js:272 ~ solanaDeposit ~ message:",
    message
  );

  try {
    const date = new Date(Date.now()).toLocaleString();
    let data = {
      amount: parseFloat(event.amount.toNumber()),
      from: user_key.toBase58(),
      receiver: event.receiverAddress,
      destination_chain_id: event.toChain,
      // date: formattedDate,
      date: date,
      transaction_hash: `${transaction_id}`,
      status: "pending",
      message: message,
      queue_id: receiverId,
      receiver_pda: receiver_pda.toBase58(),
    };
    console.log("🚀 ~ file: validator1.js:185 ~ solanaToSoroban ~ data:", data);
    await axios.post(`${base_url}/gmp/message_queue`, data).then((response) => {
      console.log(
        "🚀 ~ file: depositEvent.js:149 ~ awaitaxios.post ~ response:",
        response.data.message
      );
    });

    let res = await axios.get(`${base_url}/gmp/Message/${event.withdrawerAddress}`);
    console.log(
      "🚀 ~ file: depositEvent.js:142 ~ solanaDeposit ~ res.data.length :",
      res.data.data.length
    );
    // if (!receiverId || res.data.data.length == 0) {
    if (true) {
      let message_data = {
        amount: event.amount.toNumber(),
        from: user_key.toBase58(),
        receiver: event.receiverAddress,
        destination_chain_id: event.toChain,
        date: date,
        transaction_hash: `${transaction_id}`,
        status: "pending",
        message: message,
        queue_id: receiverId,
      };

      // Signature
      console.log(
        "🚀 ~ file: solanaWithdrawHandle.js:159 ~ solanaWithdrawEventHandle ~ process.env.PRIVATE_KEY:",
        process.env.PRIVATE_KEY
      );
      let stellar_kp = StellarSdk.Keypair.fromSecret(process.env.PRIVATE_KEY);
      let buffer_signatures = stellar_kp.sign(Buffer.from(message));
      let buffer_raw_public_key = stellar_kp.rawPublicKey();
      let validator_pkey = buffer_raw_public_key.toString("base64");
      let va_sign = buffer_signatures.toString("base64");

      let response = await axios.post(`${base_url}/gmp/Message`, message_data);
      console.log(
        "🚀 ~ file: depositEvent.js:165 ~ solanaDeposit ~ response:",
        response.data
      );

      let validator_data = {
        validator_sig: va_sign,
        validator_pkey: validator_pkey,
        message_id: response.data.row_id,
      };
      console.log(
        "🚀 ~ file: depositEvent.js:182 ~ solanaDeposit ~ validator_data:",
        validator_data
      );
      await axios
        .post(`${base_url}/gmp/Signature`, validator_data)
        .then(async (response) => {
          console.log(
            "🚀 ~ file: depositEvent.js:186 ~ .then ~ response:",
            response.data.message
          );
        });
    }
  } catch (error) {
    console.log(
      "🚀 ~ file: solanaWithdrawHandle.js:118 ~ solanaWithdrawEventHandle ~ error:",
      error
    );
  }
}

module.exports = { solanaWithdrawEventHandle };
