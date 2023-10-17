const { hash } = require("soroban-client");
const SorobanClient = require("soroban-client");
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
const ed25519 = require("ed25519");
const util = require("tweetnacl-util");
const idl = require("./idl.json");
const Message = require("../DataBase/message.js");
const nacl = require("tweetnacl");
const { anchor } = require("@coral-xyz/anchor");
const axios = require("axios");
const { Program } = require("@coral-xyz/anchor");
const { AnchorProvider } = require("@coral-xyz/anchor");
const fs = require("fs");

const {solanaClaim} = require('./SolanaEventsFunctions/claimEvent.js')
// import fs from "fs";

const db_url = "http://localhost:3400";
const get_queue_id = "http://localhost:3400/userCounter";

const dotenv = require("dotenv");
dotenv.config();

const opts = {
  preflightCommitment: "processed",
};
const network = "https://api.devnet.solana.com";
const connection = new solanaWeb3.Connection(network, "confirmed");
const programID = new PublicKey(idl.metadata.address);
const provider = new AnchorProvider(connection, opts.preflightCommitment);
const program = new Program(idl, programID, provider);
const USER_SEED_PREFIX = "prevent_duplicate_claimV1";

//sorobanToSolana();
async function sorobanToSolana() {
  const server = new SorobanClient.Server(SOROBAN_RPC_URL, { allowHttp: true });

  try {
    let res = await server.getEvents({
      startLedger: 802779,
      filters: [],
      limit: 1,
    });

    console.log("line number 71 ", res);
    console.log(
      "line number 72 ",
      JSON.parse(JSON.stringify(res)).events[0].value
    );
  } catch (error) {
    console.log(error);
  }
  // try {

  //     let hash = "8e67f1a59cec3490bda3bcb7e8a3a4f43dc9b50a722cbc96fcad43b120975e5c";
  //     let res = await server.getTransaction(hash);
  //     console.log("line number 28 ", res)
  // } catch (error) {
  //     console.log(error)
  // }
  const data = {
    amount: 12,
    tokenAddress: "CB5ABZGAAFXZXB7XHAQT6SRT6JXH2TLIDVVHJVBEJEGD2CQAWNFD7D2U",
    tokenChain: 123,
    to: "GAA6YOQZPDWMBXYIOW4LZFHXI4WRCFGBW4PM2ATVQBYMEZPWVNU77Z2T",
    toChain: 456,
    fee: 100,
  };
  const jsonString = JSON.stringify(data);
  let encoder = new TextEncoder();
  const binaryData = encoder.encode(jsonString);

  const MSG = new Uint8Array(binaryData);

  //  console.log("======>Data<=======>" , uint8array)
  //const MSG = Uint8Array.from(Buffer.from("Never give up "));
  // const keypair1 = anchor.web3.Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync('/home/imentus/imentus_project/sorolana/relayer/key.json').toString())));

  const keypair = solanaWeb3.Keypair.generate();
  const publicKey = keypair.publicKey.toBytes();
  const base64String = Buffer.from(publicKey).toString("base64");
  console.log("====>base64String<====", base64String);

  console.log("====>keypair<====", keypair);
  const privateKey = keypair.secretKey;
  console.log("MSG", MSG);
  console.log("solana public key 1:", publicKey);
  console.log("private key:", privateKey);
  const uint8Array = Buffer.from("str", "utf-8");
  let sign = nacl.sign.detached(MSG, keypair.secretKey);
  console.log(" ====> Line Nmber 15  <======", sign);
  const buffer = Buffer.from(sign);
  const base64string = buffer.toString("base64");
  let signatureString = Buffer.from(sign).toString("hex"); // convert uint8array in string
  console.log("signature String", base64string); // console signature as a string
}

let validator_kp = Keypair.fromSecretKey(
  new Uint8Array(
    JSON.parse(fs.readFileSync("solana_validators/validator1.json").toString())
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

const server = new StellarSdk.Server("https://horizon-testnet.stellar.org/");
// solanaToSoroban();
async function solanaToSoroban() {
  // Generate key pair
  // const keypair = nacl.sign.keyPair();
  // const publicKey = Buffer.from(keypair.publicKey).toString("base64");
  let listener = null;

  // 1 Listen message
  let deposit_event = await new Promise((resolve, _reject) => {
    listener = program.addEventListener(
      "DepositEvent",
      (event, slot, transaction_id) => {
        resolve([event, slot, transaction_id]);
      }
    );
    console.log("🚀 ~ file: validator1.js:132 ~ event ~ listener:", listener);
  });
  let message = {
    tokenAddress: deposit_event[0].tokenAddress,
    tokenChain: deposit_event[0].tokenChain,
    to: deposit_event[0].recieverAddress,
    toChain: deposit_event[0].toChain,
    fee: deposit_event[0].fee.toNumber(),
    amount: deposit_event[0].amount.toNumber() / web3.LAMPORTS_PER_SOL,
  };
  console.log(
    "🚀 ~ file: validator1.js:139 ~ solanaToSoroban ~ message:",
    message
  );

  let message_string = JSON.stringify(message);
  const messageBytes = Buffer.from(message_string, "utf-8");

  // const signature = nacl.sign.detached(messageBytes, keypair.secretKey);
  if (deposit_event[0].amount.toNumber() > 0) {
    console.log("matched");
    try {
      let tx = await connection.getParsedTransaction(
        deposit_event[2],
        "confirmed"
      );
      let data = {
        // amount: message.amount,
        amount: 1,
        // from: tx.transaction.message.instructions[0].accounts[0].toBase58(),
        from: "9Bxt5hHicRnJSLy5f8KAWf2Cmgrcke9zqx1BfXGeF3jH",
        to: message.to,
        toChain: "message.toChain",
        date: new Date().toString(),
        // date: "2023-09-28",
        transaction_hash: deposit_event[2],
        status: "success",
        message: message_string,
      };
      console.log(
        "🚀 ~ file: validator1.js:185 ~ solanaToSoroban ~ data:",
        data
      );
      axios.post(`${db_url}/message_queue`, data).then((response) => {
        console.log(response);
      });
      solanaToSoroban();
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

// program.addEventListener("DepositEvent", (event, slot, transaction_id) => {
//   solanaDeposit(event, slot, transaction_id);
// });
// program.addEventListener("WithdrawEvent", (event, slot, transaction_id) => {
//   solanaWithdraw(event, slot, transaction_id);
// });
program.addEventListener("ClaimEvent", (event, slot, transaction_id) => {
  solanaClaim(event, slot, transaction_id);
});

// solana Deposit();
async function solanaDeposit(event, slot, transaction_id) {
  console.log("Deposit method invokes");
  console.log("🚀 ~ file: validator1.js:206 ~ solanaDeposit ~ transaction_id:", transaction_id)
  console.log("🚀 ~ file: validator1.js:206 ~ solanaDeposit ~ slot:", slot)
  console.log("🚀 ~ file: validator1.js:206 ~ solanaDeposit ~ event:", event)
  let receiverId = 0;
  let [receiver_pda, userBump] = await getUserPda(
    new PublicKey(event.sender.toBase58())
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
        from: event.sender,
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

// solanaClaim();
// async function solanaClaim(event, slot, transaction_id) {
//   console.log(
//     "🚀 ~ file: validator1.js:296 ~ solanaClaim ~ transaction_id:",
//     transaction_id
//   );
//   console.log("🚀 ~ file: validator1.js:296 ~ solanaClaim ~ slot:", slot);
//   console.log("🚀 ~ file: validator1.js:296 ~ solanaClaim ~ event:", event);

//   let userAddress = event.userAddress.toBase58();
//   // let userAddress = "9rdobDxmeeM9B3yZPqt69Xyf8TGSuJk2J2nk1H5PNjGp";
//   let userCounter = event.claimCounter;
//   // let userCounter = 8;

//   let message_data = {
//     queue_id: userCounter,
//   };

//   await axios
//     .delete(`${db_url}/message_queue/${userAddress}`, {
//       data: message_data,
//     })
//     .then((response) => {
//       console.log(response);
//     });

//   // to know if there is more unclaimed msgs presents in the queue
//   await axios
//     .get(`${db_url}/message_queue/${userAddress}`)
//     .then(async (response) => {
//       console.log(
//         "🚀 ~ file: validator1.js:201 ~ axios.get ~ response:",
//         response.data.length
//       );
//       if (response.data[0].queue_id == userCounter + 1) {
//         let res = response.data[0];
//         console.log(
//           "🚀 ~ file: validator1.js:209 ~ awaitaxios.get ~ response.data:",
//           response.data[0].queue_id
//         );
//         let msg = response.data[0].message_info;

//         const message = JSON.stringify(msg);
//         console.log(
//           "🚀 ~ file: sorolan_bridge.ts:234 ~ it ~ message:",
//           message
//         );
//         const messageBytes = Buffer.from(message, "utf-8");

//         console.log(
//           "🚀 ~ file: sorolan_bridge.ts:152 ~ it ~ messageBytes:",
//           messageBytes
//         );
//         const signer_pkey = validator_kp.publicKey.toBytes();
//         console.log(
//           "🚀 ~ file: sorolan_bridge.ts:155 ~ it ~ signer_pkey:",
//           signer_pkey
//         );

//         const signature = nacl.sign.detached(
//           messageBytes,
//           validator_kp.secretKey
//         );
//         console.log(
//           "🚀 ~ file: sorolan_bridge.ts:154 ~ it ~ signature:",
//           signature
//         );
//         console.log(
//           "🚀 ~ file: validator1.js:354 ~ .then ~ Buffer.from(signature).toString('base64'):",
//           Buffer.from(signature).toString("base64")
//         );
//         let validator_data = {
//           validator_sig: Buffer.from(signature).toString("base64"),
//           validator_pkey: validator_kp.publicKey.toBase58(),
//           message_id: response.data[0].id,
//         };
//         await axios
//           .post(`${db_url}/Signature`, validator_data)
//           .then(async (response) => {
//             console.log(
//               "🚀 ~ file: validator1.js:364 ~ .then ~ response:",
//               response
//             );
//           });

//         let message_queue_data = {
//           amount: res.amount,
//           from: res.from_address,
//           to: res.receiver,
//           toChain: res.destination_chain_id,
//           date: new Date().getDate,
//           transaction_hash: res.transaction_hash,
//           status: "pending",
//           message: res.message_info,
//           queue_id: res.queue_id,
//         };

//         await axios
//           .post(`${db_url}/Message`, message_queue_data)
//           .then(async (response) => {
//             console.log(
//               "🚀 ~ file: validator1.js:364 ~ .then ~ response:",
//               response
//             );
//           });
//       } else {
//         console.log("Some thing went wrong");
//       }
//     });
// }
