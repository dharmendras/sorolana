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
// const programID = new web3.PublicKey(idl.metadata.address);
// const provider = new AnchorProvider(connection, opts.preflightCommitment);
// const USER_SEED_PREFIX = "prevent_duplicate_claimV1";
// const program = new Program(idl, programID, provider);

// const getUserPda = async (user) => {
//     const userPdaInfo = web3.PublicKey.findProgramAddressSync(
//         [anchorr.utils.bytes.utf8.encode(USER_SEED_PREFIX), user.toBuffer()],
//         program.programId
//     );
//     return userPdaInfo;
// };

let receiverId = 0;

async function SorobanClaim(event, slot, transaction_id) {
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

    let method_name = event.method;
    let amount = event.amount.toNumber();
    let tokenAddress = event.tokenAddress;
    let tokenChain = event.tokenChain;
    let receiver = event.receiverAddress;
    let toChain = event.toChain;
    let fee = event.fee;

    let tx = await connection.getParsedTransaction(transaction_id);
    let user_key = tx.transaction.message.accountKeys[0].pubkey;
    console.log("====> user_key <===", user_key)
    // // let [receiver_pda, userBump] = await getUserPda(user_key);

    await axios
        .get(`${base_url}/gmp/userCounter/${receiver}`)
        .then(async (response) => {
            if (response.data.length == 0) {
                receiverId = 0;
                console.log(
                    "🚀 ~ file: validator1.js:206 ~ axios.get ~ receiverId:",
                    receiverId
                );
                let receiverDetails = {
                    receiver: receiver,
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
                    `${base_url}/gmp/userCounter/${receiver}`,
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
        tokenAddress: tokenAddress,
        tokenChain: tokenChain,
        to: receiver,
        toChain: toChain,
        fee: 100,
        method: method_name,
        amount: amount,
    };
    console.log(
        "🚀 ~ file: solanaWithdrawHandle.js:103 ~ solanaWithdrawEventHandle ~ event.amount.toNumber():",
        amount
    );
    const message = JSON.stringify(soroban_msg);
    console.log(
        "🚀 ~ file: validator1.js:272 ~ solanaDeposit ~ message:",
        message
    );

    try {
        const date = new Date(Date.now()).toLocaleString();
        let data = {
            amount: amount,
            from: user_key.toBase58(),
            receiver: receiver,
            destination_chain_id: toChain,
            date: date,
            transaction_hash: `${transaction_id}`,
            status: "pending",
            message: message,
            queue_id: receiverId,
            receiver_pda: "qqqqqqqqqqqq",
        };
        console.log("🚀 ~ file: validator1.js:185 ~ solanaToSoroban ~ data:", data);
        await axios.post(`${base_url}/gmp/message_queue`, data).then((response) => {
            console.log(
                "🚀 ~ file: depositEvent.js:149 ~ awaitaxios.post ~ response:",
                response.data.message
            );
        });

        let res = await axios.get(`${base_url}/gmp/Message/${receiver}`);
        console.log(
            "🚀 ~ file: depositEvent.js:142 ~ solanaDeposit ~ res.data.length :",
            res.data.data.length
        );
        // if (!receiverId || res.data.data.length == 0) {
        console.log("🚀 ~ file: SorobanClaim.js:146 ~ receiverId:", receiverId)
        // if (!receiverId || res.data.data.length == 0) {
            if (true) {                 //TODO: update it after listening the claim event of soroban
            let message_data = {
                amount: amount,
                from: user_key.toBase58(),
                receiver: receiver,
                destination_chain_id: toChain,
                date: date,
                transaction_hash: `${transaction_id}`,
                status: "success",
                message: message,
                queue_id: receiverId,
                is_claimed: 'NO'
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
            console.log("🚀 ~ file: SorobanClaim.js:184 ~ validator_data:", validator_data)
            console.log("🚀 ~ file: SorobanClaim.js:184 ~ validator_data.validator_sig:", validator_data.validator_sig)

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

module.exports = { SorobanClaim };