let base_url = "http://localhost:3400";

const axios = require("axios");
const bs58 = require("bs58");
const nacl = require("tweetnacl");
const web3 = require("@solana/web3.js");
const anchorr = require("@coral-xyz/anchor");
const { Program } = require("@coral-xyz/anchor");
const { AnchorProvider } = require("@coral-xyz/anchor");
const idl = require("../idl.json");

const { Keypair, PublicKey } = require("@solana/web3.js");

const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

const opts = {
  preflightCommitment: "processed",
};
//const network = "https://api.devnet.solana.com";
const network = "http://localhost:8899";

const connection = new web3.Connection(network, "confirmed");
const programID = new PublicKey(idl.metadata.address);
const provider = new AnchorProvider(connection, opts.preflightCommitment);
const program = new Program(idl, programID, provider);
const USER_SEED_PREFIX = "prevent_duplicate_claimV1";
let validator_kp = Keypair.fromSecretKey(
  new Uint8Array(
    JSON.parse(fs.readFileSync("./solana_validators/validator3.json"))
    // JSON.parse(fs.readFileSync("/home/imentus/Documents/imentus_project/sorolana/GMP_node/solana_validators/validator1.json"))
  )
);
const getUserPda = async (user) => {
  const userPdaInfo = web3.PublicKey.findProgramAddressSync(
    [
      anchorr.utils.bytes.utf8.encode(USER_SEED_PREFIX),
      user.toBuffer(),
    ],
    program.programId
  );
  return userPdaInfo;
};
async function solanaDeposit(event, slot, transaction_id) {
  // console.log(
  //   "🚀 ~ file: depositEvent.js:36 ~ solanaDeposit ~ event.receiver_address:",
  //   event
  // );
  let receiverId = 0;
  let [receiver_pda, userBump] = await getUserPda(
    new PublicKey(event.receiver_address.toString())
  );
  console.log("🚀 ~ solanaDeposit ~ receiver_pda:", receiver_pda)
  console.log(
    "🚀 ~ file: validator1.js:196 ~ axios.get ~ receiver_pda.toBase58():",
    receiver_pda.toBase58()
  );
  const message_queue_response = await axios.get(`${base_url}/gmp/CheckTransactionHashInMessage_queue/${transaction_id}`);
  console.log("message_queue_response length:", message_queue_response.data.length);

  const message_response = await axios.get(`${base_url}/gmp/CheckTransactionHashInMessage/${transaction_id}`);
  console.log("message_response length:", message_response.data.length);
  let userAddress = event.receiver_address

  const isclaimed_response = await axios.get(`${base_url}/gmp/CheckIsClaimedInMessage/${userAddress}`);
  console.log("🚀 ~ solanaDeposit ~ isclaimed_response:", isclaimed_response.data.length)
  // No similar transaction hash in data base 
  if (message_response.data.length == 0 && message_queue_response.data.length == 0) {
    console.log(" There is no  similar transaction hash in data base")

    if (isclaimed_response.data.length == 0) {
      console.log("user come first time or is_claimed is clear")
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

      let solana_msg = {
        counter: receiverId,
        tokenAddress: event.token_address,
        tokenChain: Number(event.token_chain),
        to: event.receiver_address,
        toChain: Number(event.to_chain),
        fee: 100,
        method: event.method,
        // method: "Deposit",
        amount: Number(event.amount),
      };
      const message = JSON.stringify(solana_msg);
      console.log(
        "🚀 ~ file: validator1.js:272 ~ solanaDeposit ~ message:",
        message
      );

      if (Number(event.amount) > 0) {
        try {
          const date = new Date(Date.now()).toISOString()
          let data = {
            amount: Number(event.amount),
            from: event.from,
            receiver: event.receiver_address,
            destination_chain_id: Number(event.to_chain),
            date: date,
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
          await axios
            .post(`${base_url}/gmp/message_queue`, data)
            .then((response) => {
              console.log(
                "🚀 ~ file: depositEvent.js:149 ~ awaitaxios.post ~ response:",
                response.data.message
              );
            });

          let res = await axios.get(
            `${base_url}/gmp/Message/${event.receiver_address}`
          );
          console.log(
            "🚀 ~ file: depositEvent.js:142 ~ solanaDeposit ~ res.data.length :",
            res.data.data.length
          );
          if (!receiverId || res.data.data.length == 0) {
            let message_data = {
              amount: Number(event.amount),
              from: event.from,
              receiver: event.receiver_address,
              destination_chain_id: Number(event.to_chain),
              date: date,
              transaction_hash: `${transaction_id}`,
              status: "success",
              message: message,
              queue_id: receiverId,
              is_claimed: "NO",
            };
            let response = await axios.post(
              `${base_url}/gmp/Message`,
              message_data
            );
            console.log(
              "🚀 ~ file: depositEvent.js:165 ~ solanaDeposit ~ response:",
              response.data
            );

            const messageBytes = Buffer.from(message, "utf-8");
            console.log(
              "🚀 ~ file: sorolan_bridge.ts:152 ~ it ~ messageBytes:",
              messageBytes,
              messageBytes.length
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


            const buffer_signature = [Buffer.from(signature).toString("hex")];
            const validator_array = [validator_kp.publicKey.toBase58()]
            let validator_data = {
              validator_sig: buffer_signature,
              validator_pkey: validator_array,
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
            "🚀 ~ file: validator1.js:178 ~ solanaToSoroban ~ error:",
            error
          );
        }
      } else {
        console.log("Not Matched");
      }

    }
    else {
      console.log(" user come for second transaction transaction is not available but user address is on message table")
      
      const message_queue_response = await axios.get(`${base_url}/gmp/CheckTransactionHashInMessage_queue/${transaction_id}`);
      console.log("🚀 ~ solanaDeposit ~ message_queue_response:", message_queue_response.data.length)

      if(message_queue_response.data.length == 0) { 
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
      let solana_msg = {
        counter: receiverId,
        tokenAddress: event.token_address,
        tokenChain: Number(event.token_chain),
        to: event.receiver_address,
        toChain: Number(event.to_chain),
        fee: 100,
        method: event.method,
        // method: "Deposit",
        amount: Number(event.amount),
      };
      const message = JSON.stringify(solana_msg);
      console.log(
        "🚀 ~ file: validator1.js:272 ~ solanaDeposit ~ message:",
        message
      );
      if (Number(event.amount) > 0) {
        try {
          const date = new Date(Date.now()).toISOString()
          let data = {
            amount: Number(event.amount),
            from: event.from,
            receiver: event.receiver_address,
            destination_chain_id: Number(event.to_chain),
            date: date,
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
          await axios
            .post(`${base_url}/gmp/message_queue`, data)
            .then((response) => {
              console.log(
                "🚀 ~ file: depositEvent.js:149 ~ awaitaxios.post ~ response:",
                response.data.message
              );
            });
        }
        catch (err) {
          console.log("🚀 ~ solanaDeposit ~ err:", err)

        }
      }
      
      
      }
      else { 
        console.log(" ek validator message queue mai dump kar chuka hai")
      }

    }

  }
  else {

    console.log(" Yup there is a  transaction hash")
    console.log(" append sign")
    const message_response = await axios.get(`${base_url}/gmp/CheckTransactionHashInMessage/${transaction_id}`);
  
    if (message_response.data.length == 1) {
      console.log(" sign the signature")

      let solana_msg = {
        counter: receiverId,
        tokenAddress: event.token_address,
        tokenChain: Number(event.token_chain),
        to: event.receiver_address,
        toChain: Number(event.to_chain),
        fee: 100,
        method: event.method,
        // method: "Deposit",
        amount: Number(event.amount),
      };
      const message = JSON.stringify(solana_msg);
      console.log("🚀 ~ solanaDeposit ~ message:", message)

      const messageBytes = Buffer.from(message, "utf-8");
      console.log(
        "🚀 ~ file: sorolan_bridge.ts:152 ~ it ~ messageBytes:",
        messageBytes,
        messageBytes.length
      );
      const signature = nacl.sign.detached(
        messageBytes,
        validator_kp.secretKey
      );
      console.log("🚀 ~ solanaDeposit ~ signature:", signature)

      const buffer_signature = [Buffer.from(signature).toString("hex")];
      const validator_array = [validator_kp.publicKey.toBase58()]

      let validator_data = {
        validator_sig: buffer_signature,
        validator_pkey: validator_array,
        message_id: message_response.data[0].id,
      };

      console.log("🚀 ~ solanaDeposit ~ validator_data:", validator_data)

      const response = await axios.put(`${base_url}/gmp/AppendSignature/`, validator_data);
    }
    else {
      console.log("dont sign the signature")
    }
  }


}

module.exports = { solanaDeposit };