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
async function  SorobanClaimEventHandle(event, slot, transaction_id) {
    console.log("🚀 ~ file: sorobanclaimEventHandle.js:3 ~ SorobanClaimEventHandle ~ transaction_id:", transaction_id)
    console.log("🚀 ~ file: sorobanclaimEventHandle.js:4 ~ SorobanClaimEventHandle ~ slot:", slot)
    console.log("🚀 ~ file: sorobanclaimEventHandle.js:5 ~ SorobanClaimEventHandle ~ event:", event)


    //user_address
    // let userAddress = event.userValidatorAddress.toBase58();
    // let userCounter = event.claimCounter.toNumber();

    let userAddress = event.user_address;
    let userCounter = Number(event.Claim_Counter)
    console.log("🚀 ~ file: sorobanclaimEventHandle.js:34 ~ SorobanClaimEventHandle ~ userCounter:", userCounter)

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

                    let stellar_kp = StellarSdk.Keypair.fromSecret(process.env.PRIVATE_KEY);

                    let buffer_signatures = stellar_kp.sign(Buffer.from(message));

                    let buffer_raw_public_key = stellar_kp.rawPublicKey();

                    let validator_pkey = buffer_raw_public_key.toString("base64");

                    let va_sign = buffer_signatures.toString("base64");

                    // console.log(
                    //     "🚀 ~ file: sorolan_bridge.ts:234 ~ it ~ message:",
                    //     message
                    // );
                    // const messageBytes = Buffer.from(message, "utf-8");

                    // console.log(
                    //     "🚀 ~ file: sorolan_bridge.ts:152 ~ it ~ messageBytes:",
                    //     messageBytes
                    // );
                    // const signer_pkey = validator_kp.publicKey.toBytes();
                    // console.log(
                    //     "🚀 ~ file: sorolan_bridge.ts:155 ~ it ~ signer_pkey:",
                    //     signer_pkey
                    // );

                    // const signature = nacl.sign.detached(
                    //     messageBytes,
                    //     validator_kp.secretKey
                    // );
                    // console.log(
                    //     "🚀 ~ file: sorolan_bridge.ts:154 ~ it ~ signature:",
                    //     signature
                    // );
                    // console.log(
                    //     "🚀 ~ file: validator1.js:354 ~ .then ~ Buffer.from(signature).toString('base64'):",
                    //     Buffer.from(signature).toString("hex")
                    // );

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
                        validator_sig: va_sign,
                        validator_pkey: validator_pkey,
                        message_id: message_res.data.row_id,
                    };
                    // let validator_data = {
                    //     validator_sig: Buffer.from(signature).toString("hex"),
                    //     validator_pkey: validator_kp.publicKey.toBase58(),
                    //     message_id: message_res.data.row_id,
                    // };
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

module.exports = { SorobanClaimEventHandle }