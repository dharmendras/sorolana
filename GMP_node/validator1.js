const { hash } = require("soroban-client");
const SorobanClient = require("soroban-client");
const NETWORK_PASSPHRASE = "Test SDF Future Network ; October 2022";
const SOROBAN_RPC_URL = "https://rpc-futurenet.stellar.org:443/";
const scvalToBigNumber = require("./convert.js");
const solanaWeb3 = require("@solana/web3.js");
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

const db_url = "http://localhost:3400/Message";

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


const server = new StellarSdk.Server("https://horizon-testnet.stellar.org/");
solanaToSoroban();
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
      axios.post(db_url, data).then((response) => {
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
