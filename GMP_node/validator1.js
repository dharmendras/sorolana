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
const util = require("tweetnacl-util");
const idl = require("./idl.json");
const Message = require("../DataBase/message.js");
const nacl = require("tweetnacl");
const { anchor } = require("@coral-xyz/anchor");
const axios = require("axios");
const { Program } = require("@coral-xyz/anchor");
const { AnchorProvider } = require("@coral-xyz/anchor");
const fs = require("fs");
// const {SorobanDeposit} = require('./SorobanEventsFunction/SorobanDeposit.js')
const { solanaClaim } = require("./SolanaEventsFunctions/claimEvent.js");
const { SorobanClaim } = require("./SorobanEventsFunctions/SorobanClaim.js");
// const { solanaWithdraw } = require("./SolanaEventsFunctions/withdrawEvent.js");
const { solanaWithdrawEventHandle } = require("./SorobanEventsFunctions/solanaWithdrawHandle.js");
// import fs from "fs";


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

// const server = new StellarSdk.Server("https://horizon-testnet.stellar.org/");

program.addEventListener("DepositEvent", (event, slot, transaction_id) => {
 console.log("🚀 ~ file: validator1.js:65 ~ program.addEventListener ~ event:", event)
 // solanaDeposit(event, slot, transaction_id);
  SorobanClaim(event , slot , transaction_id)

});
program.addEventListener("WithdrawEvent", (event, slot, transaction_id) => {
  solanaWithdrawEventHandle(event, slot, transaction_id);
});
program.addEventListener("ClaimEvent", (event, slot, transaction_id) => {
  solanaClaim(event, slot, transaction_id);
});
