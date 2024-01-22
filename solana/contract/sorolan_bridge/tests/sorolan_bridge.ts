import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SorolanBridge } from "../target/types/sorolan_bridge";
import * as spltoken from "@solana/spl-token";
import nacl from "tweetnacl";
import { decodeUTF8, encodeUTF8 } from "tweetnacl-util";
import * as web3 from "@solana/web3.js";
import {
  LAMPORTS_PER_SOL,
  Keypair,
  SystemProgram,
  PublicKey,
} from "@solana/web3.js";
import fs from "fs";
import { base64 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { BN } from "bn.js";
// import { abc } from "./msg";

//anchor test --skip-local-validator --skip-build --skip-deploy

const PROGRAM_SEED_PREFIX = "soroban_solana";
const USER_SEED_PREFIX = "prevent_duplicate_claimV1";
const AUTHORITY_SEED_PREFIX = "soroban_authority";
const SIGNATURESTORE_SEED = "SIGNATURESTORE";

const amount = new anchor.BN(2 * LAMPORTS_PER_SOL);
const destination_address =
  "GDUUZPJFLI6BHGUHH32L7UMAJQHCI5VTHETE3PNRXS554W3OV7HBFIVR";
let user_kp = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(fs.readFileSync("keys/user.json").toString()))
);
let validator0_kp = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(fs.readFileSync("keys/validator1.json").toString()))
);
let validator1_kp = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(fs.readFileSync("keys/validator2.json").toString()))
);
let validator2_kp = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(fs.readFileSync("keys/validator3.json").toString()))
);
let validator3_kp = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(fs.readFileSync("keys/validator4.json").toString()))
);
let validator4_kp = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(fs.readFileSync("keys/validator5.json").toString()))
);
let deployer_kp = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(fs.readFileSync("keys/deployer.json").toString()))
);
let mint_kp = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(fs.readFileSync("keys/mint.json").toString()))
);
let provider = anchor.AnchorProvider.env();

let sorolanaTokenParams = {
  name: "Sorolana",
  symbol: "WSOR",
  uri: "sorolana_bridge",
  decimals: 100,
};

let db_msg = {
  counter: 0,
  tokenAddress: "CDILU5GSXZLRM6JTYTGDKBTIPJD43GEBJVSECE6DKNJ4I7KBN2Z4EKAS",
  tokenChain: 456,
  to: "4ubRFnu8fNE5jz42bQ9ipDxb2zietTHFEv9YbvnPqsYQ",
  toChain: 123,
  fee: 100,
  method: "Deposit",
  amount: 1,
};

let Soroban_msg = {
  counter: 0,
  tokenAddress: "CB5ABZGAAFXZXB7XHAQT6SRT6JXH2TLIDVVHJVBEJEGD2CQAWNFD7D2U",
  tokenChain: 1234,
  to: "8CSbDYyUJGZRby3nbsJ2FzJS3nzfXojCNHGeSrtTHvGA",
  toChain: 5678,
  fee: 100,
  method: "Burn",
  amount: 10,
};

let validator_signature =
  "6369015fa7da1ea96bc8b683ed6b5549b065afae6bd9e6e9f0c108f76f10ce7dd33f76c6e77f1c7f965d82cb542bbe1918f3ae792d2498631977265fa1d3a307";
let user_kp_pubkey = new PublicKey(
  "2NEijqdfBX6DuBHGht9CaqjfnZsATpfEzbPoDYdFh5Pc"
);
// let user_kp_pubkey = new PublicKey(
//   "Y959mtt5U4SRzLnXUtPvQDR5RRfX5vYwZJisrftWckC"
// );
let Withdraw_msg = {
  counter: 0,
  tokenAddress: "CB5ABZGAAFXZXB7XHAQT6SRT6JXH2TLIDVVHJVBEJEGD2CQAWNFD7D2U",
  tokenChain: 123,
  to: "GGPud2eDjZ4QNrCrriLcppB617BEAKPXcyPGYsFrxeeP",
  toChain: 456,
  fee: 100,
  method: "release",
  amount: 10,
};

describe("sorolan_bridge", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SorolanBridge as Program<SorolanBridge>;
  let isRunTestCase = true;

  const [singleTxPDA, singleTxBump] =
    web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode(SIGNATURESTORE_SEED),
        user_kp.publicKey.toBuffer(),
      ],
      program.programId
    );

  // Authority Pda to init the token Address
  const getAuthorityPda = async () => {
    const authorityPdaInfo = web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode(AUTHORITY_SEED_PREFIX),
        deployer_kp.publicKey.toBuffer(),
      ],
      program.programId
    );
    return authorityPdaInfo;
  };
  console.log("🚀 ~ file: sorolan_bridge.ts:117 ~ getAuthorityPda ~ getAuthorityPda:", getAuthorityPda)

  // Program pda acts as a treasury, have all the funds deposit by users
  const getProgramPda = async () => {
    const programPdaInfo = web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode(PROGRAM_SEED_PREFIX),
        deployer_kp.publicKey.toBuffer(),
      ],
      program.programId
    );
    return programPdaInfo;
  };

  // User-Validator pda, saves counter to prevent multiple claim invokation
  const getUserPda = async (user: PublicKey, validator: PublicKey) => {
    const userPdaInfo = web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode(USER_SEED_PREFIX),
        validator.toBuffer(),
        user.toBuffer(),
      ],
      program.programId
    );
    return userPdaInfo;
  };

  // To get ATA of the user, so token can be stored here
  const getAta = async (
    mint: PublicKey,
    owner: PublicKey,
    allowOwnerOffCurve?: boolean
  ) => {
    const ata = await spltoken.getAssociatedTokenAddress(
      mint,
      owner,
      allowOwnerOffCurve
    );
    return ata;
  };

  it.only("Can initialize a authority pda: ", async () => {
    // if (!isRunTestCase) {
    const [authorityPda, authorityBump] =
      web3.PublicKey.findProgramAddressSync(
        [
          anchor.utils.bytes.utf8.encode(AUTHORITY_SEED_PREFIX),
          program.provider.publicKey.toBuffer(),
        ],
        program.programId
      );
    console.log(
      "🚀 ~ file: sorolan_bridge.ts:151 ~ it ~ authorityPda:",
      authorityPda.toBase58()
    );
    const tx = await program.methods
      .initAuthorityPda(authorityBump)
      .accounts({
        authority: program.provider.publicKey,
        authorityPda: authorityPda,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();
    console.log("🚀 ~ file: sorolan_bridge.ts:110 ~ it ~ tx:", tx);
    // }
  });

  it.only(" AccountsInInitializeSingleTxPda !", async () => {


    try {
      const tx = await program.methods.initializeSingleTxPda(singleTxBump).accounts({
        singleTxPda: singleTxPDA,
        initializer: user_kp.publicKey,
        systemProgram: SystemProgram.programId
      }).signers([user_kp]).rpc()
      console.log("🚀 ~ file: sorolan_bridge.ts:190 ~ txSig ~ txSig:", tx)


    } catch (error) {
      console.log("🚀 ~ file: counter.ts:44 ~ it ~ error:", error)
      // If PDA Account already created, then we expect an error
      console.log(error);
    }
  });

  it.only("Authority can initialize the mint account: ", async () => {
    //  if (!isRunTestCase) {

    try {
      let authorityPdaInfo = await getAuthorityPda();
      console.log("authorityPdaInfo:", authorityPdaInfo[0].toBase58());
      console.log("Token mint address:", mint_kp.publicKey.toBase58());
      const initPdaTx = await program.methods
        .initTokenMint()
        .accounts({
          authority: program.provider.publicKey,
          authorityPda: authorityPdaInfo[0],
          mint: mint_kp.publicKey,
          rent: web3.SYSVAR_RENT_PUBKEY,
          systemProgram: SystemProgram.programId,
          tokenProgram: spltoken.TOKEN_PROGRAM_ID,
        })
        .signers([mint_kp])
        .rpc();
      console.log(
        "🚀 ~ file: sorolan_bridge.ts:195 ~ it ~ initPdaTx:",
        initPdaTx
      );
    } catch (error) {
      console.log("🚀 ~ file: sorolana.ts:56 ~ it ~ error:", error);
    }
    //  }
  });

  it("Users can deposit funds to the program pda: ", async () => {
    // if (!isRunTestCase) {
    try {
      const [program_pda, player_bump] = await getProgramPda();
      console.log(
        "🚀 ~ file: sorolan_bridge.ts:209 ~ it ~ program_pda:",
        program_pda.toBase58()
      );

      const depositTx = await program.methods
        .deposit(amount, destination_address)
        .accounts({
          user: user_kp.publicKey,
          authority: program.provider.publicKey,
          programPda: program_pda,
          systemProgram: SystemProgram.programId,
        })
        .signers([user_kp])
        .rpc({ skipPreflight: true, commitment: "confirmed" });
      console.log(
        "🚀 ~ file: sorolan_bridge.ts:75 ~ it ~ depositTx:",
        depositTx
      );
    } catch (error) {
      console.log("🚀 ~ file: sorolana.ts:78 ~ it ~ error:", error);
    }
    // }
  });

  it("Listen events at the time of deposit the funds: ", async () => {
    //if (!isRunTestCase) {
    try {
      const depositListener = program.addEventListener(
        "DepositEvent",
        (event, slot) => {
          console.log("DepositEvent: ", event, slot);
        }
      );
      const [program_pda, player_bump] = await getProgramPda();

      for (let i = 0; i < 3; i++) {
        const depositTx = await program.methods
          .deposit(amount, destination_address)
          .accounts({
            user: user_kp.publicKey,
            authority: program.provider.publicKey,
            programPda: program_pda,
            systemProgram: SystemProgram.programId,
          })
          .signers([user_kp])
          .rpc({ skipPreflight: true, commitment: "confirmed" });
        console.log(
          "🚀 ~ file: sorolan_bridge.ts:75 ~ it ~ depositTx:",
          depositTx
        );
      }

      await program.removeEventListener(depositListener);
    } catch (error) {
      console.log("🚀 ~ file: sorolan_bridge.ts:101 ~ it ~ error:", error);
    }
    // }
  });

  it.only("Verfiy and mint method: ", async () => {
    if (isRunTestCase) {
      const message = JSON.stringify(db_msg);
      console.log("🚀 ~ file: sorolan_bridge.ts:234 ~ it ~ message:", message);
      const messageBytes = Buffer.from(message, "utf-8");
      console.log(
        "🚀 ~ file: sorolan_bridge.ts:280 ~ it ~ messageBytes:",
        messageBytes,
        messageBytes.length
      );
      const signer_pkey = validator0_kp.publicKey.toBytes();

      var private_key_arr: Uint8Array[];
      let signature_arr: Uint8Array[] = [];
      let signer_pkey_arr: Uint8Array[];

      console.log(" ====> program.provider.publicKey <==== ", program.provider.publicKey)
      console.log(" ====> user_kp_pubkey <==== ", user_kp_pubkey)

      //validator1_kp.secretKey, validator2_kp.secretKey, validator3_kp.secretKey, validator4_kp.secretKey
      //, validator1_kp.publicKey.toBytes(), validator2_kp.publicKey.toBytes(), validator3_kp.publicKey.toBytes(), validator4_kp.publicKey.toBytes()

      private_key_arr = [validator0_kp.secretKey, validator1_kp.secretKey, validator2_kp.secretKey, validator3_kp.secretKey, validator4_kp.secretKey];
      signer_pkey_arr = [validator0_kp.publicKey.toBytes(), validator1_kp.publicKey.toBytes(), validator2_kp.publicKey.toBytes(), validator3_kp.publicKey.toBytes(), validator4_kp.publicKey.toBytes()]

      const [program_pda, player_bump] = await getProgramPda();
      let authorityPdaInfo = await getAuthorityPda();
      let [userPda, userBump] = await getUserPda(
        user_kp_pubkey,
        validator0_kp.publicKey
      );
      console.log(
        "🚀 ~ file: sorolan_bridge.ts:310 ~ it ~ userPda:",
        userPda.toBase58()
      );

      for (let i = 0; i < private_key_arr.length; i++) {

        const signature = nacl.sign.detached(
          messageBytes,
          private_key_arr[i]
        );
        signature_arr.push(signature)

      }
      console.log("🚀 ~ it.only ~ signature_arr:", signature_arr)

      console.log("🚀 ~ it.only ~ private_key_arr:", private_key_arr)

      // const signature = nacl.sign.detached(
      //   messageBytes,
      //   validator0_kp.secretKey
      // );

      // let signature_str = Buffer.from(signature).toString("hex");
      // let signature_buf = Buffer.from(signature_str, "hex");

      for (let i = 0; i < private_key_arr.length; i++) {
        const result = nacl.sign.detached.verify(
          messageBytes,
          signature_arr[i],
          signer_pkey_arr[i]
        );
        console.log("🚀 ~ file: sorolan_bridge.ts:159 ~ it ~ result:", result);

      }


      for (let i = 0; i < private_key_arr.length; i++) {

        let ix01 = anchor.web3.Ed25519Program.createInstructionWithPublicKey({
          publicKey: signer_pkey_arr[i],
          message: messageBytes,
          signature: signature_arr[i]

        });

        const claimIx = await program.methods
          .claim(
            //@ts-ignore
            signer_pkey_arr[i],
            Buffer.from(message),
            // Buffer.from(signature),
            signature_arr[i],
            userBump,
          )
          .accounts({
            claimer: program.provider.publicKey,
            user: user_kp_pubkey,
            validator: validator0_kp.publicKey,
            authority: program.provider.publicKey,
            programPda: program_pda,
            userPda: userPda,
            authorityPda: authorityPdaInfo[0],
            singleTxPda: singleTxPDA,
            tokenAccount: await getAta(mint_kp.publicKey, user_kp_pubkey, false),
            mint: mint_kp.publicKey,
            tokenProgram: spltoken.TOKEN_PROGRAM_ID,
            associatedTokenProgram: spltoken.ASSOCIATED_TOKEN_PROGRAM_ID,
            ixSysvar: web3.SYSVAR_INSTRUCTIONS_PUBKEY,
            systemProgram: web3.SystemProgram.programId,
          }).instruction()

        let claimTx = new web3.Transaction().add(ix01, claimIx);
        claimTx.recentBlockhash = (
          await provider.connection.getLatestBlockhash()
        ).blockhash;
        claimTx.feePayer = program.provider.publicKey;
        console.log("🚀 ~ file: sorolan_bridge.ts:351 ~ it ~ claimTx:", claimTx)

        try {

          let signedTx = await provider.wallet.signTransaction(claimTx);
          console.log("🚀 ~ file: sorolan_bridge.ts:346 ~ it ~ signedTx:", signedTx.serialize().byteLength)
          console.log("🚀 ~ file: sorolan_bridge.ts:358 ~ it ~ signedTx:", signedTx)


          let claimHash = await provider.connection.sendRawTransaction(signedTx.serialize());
          console.log("🚀 ~ file: sorolan_bridge.ts:349 ~ it ~ claimHash:", claimHash)

        } catch (error) {
          console.log("🚀 ~ it.only ~ error:", error)

        }
      }

    }
  });

  // it("Burn the token from the user's wallet", async () => {
  //   if (!isRunTestCase) {
  //     try {
  //       console.log(
  //         "🚀 ~ file: sorolan_bridge.ts:286 ~ it ~ await getAta(mint_kp.publicKey, user_kp.publicKey, false):",
  //         (await getAta(mint_kp.publicKey, user_kp.publicKey, false)).toBase58()
  //       );
  //       let balance = await spltoken.getAccount(
  //         provider.connection,
  //         await getAta(mint_kp.publicKey, user_kp.publicKey, false)
  //       );
  //       console.log(
  //         "🚀 ~ file: sorolan_bridge.ts:295 ~ it ~ balance:",
  //         balance
  //       );
  //       const withdrawTx = await program.methods
  //         .withdraw(new anchor.BN(0.06 * LAMPORTS_PER_SOL), "fghjk")
  //         .accounts({
  //           user: user_kp.publicKey,
  //           mint: mint_kp.publicKey,
  //           tokenProgram: spltoken.TOKEN_PROGRAM_ID,
  //           tokenAccount: await getAta(
  //             mint_kp.publicKey,
  //             user_kp.publicKey,
  //             false
  //           ),
  //         })
  //         .signers([user_kp])
  //         .rpc();
  //       console.log(
  //         "🚀 ~ file: sorolan_bridge.ts:288 ~ it ~ withdrawTx:",
  //         withdrawTx
  //       );
  //     } catch (error) {
  //       console.log("🚀 ~ file: sorolan_bridge.ts:281 ~ it ~ error:", error);
  //     }
  //   }
  // });

  it("release the funds into the user's wallet: ", async () => {

    if (isRunTestCase) {
      const message = JSON.stringify(Withdraw_msg);
      console.log("🚀 ~ file: sorolan_bridge.ts:234 ~ it ~ message:", message);
      const messageBytes = Buffer.from(message, "utf-8");
      console.log(
        "🚀 ~ file: sorolan_bridge.ts:280 ~ it ~ messageBytes:",
        messageBytes,
        messageBytes.length
      );
      const signer_pkey = validator0_kp.publicKey.toBytes();

      var private_key_arr: Uint8Array[];
      let signature_arr: Uint8Array[] = [];
      let signer_pkey_arr: Uint8Array[];

      console.log(" ====> program.provider.publicKey <==== ", program.provider.publicKey)
      console.log(" ====> user_kp_pubkey <==== ", user_kp_pubkey)

      //validator1_kp.secretKey, validator2_kp.secretKey, validator3_kp.secretKey, validator4_kp.secretKey
      //, validator1_kp.publicKey.toBytes(), validator2_kp.publicKey.toBytes(), validator3_kp.publicKey.toBytes(), validator4_kp.publicKey.toBytes()

      private_key_arr = [validator0_kp.secretKey, validator1_kp.secretKey, validator2_kp.secretKey, validator3_kp.secretKey, validator4_kp.secretKey];
      signer_pkey_arr = [validator0_kp.publicKey.toBytes(), validator1_kp.publicKey.toBytes(), validator2_kp.publicKey.toBytes(), validator3_kp.publicKey.toBytes(), validator4_kp.publicKey.toBytes()]

      const [program_pda, player_bump] = await getProgramPda();
      let authorityPdaInfo = await getAuthorityPda();
      let [userPda, userBump] = await getUserPda(
        user_kp_pubkey,
        validator0_kp.publicKey
      );
      console.log(
        "🚀 ~ file: sorolan_bridge.ts:310 ~ it ~ userPda:",
        userPda.toBase58()
      );

      for (let i = 0; i < private_key_arr.length; i++) {

        const signature = nacl.sign.detached(
          messageBytes,
          private_key_arr[i]
        );
        signature_arr.push(signature)

      }
      console.log("🚀 ~ it.only ~ signature_arr:", signature_arr)

      console.log("🚀 ~ it.only ~ private_key_arr:", private_key_arr)

      // const signature = nacl.sign.detached(
      //   messageBytes,
      //   validator0_kp.secretKey
      // );

      // let signature_str = Buffer.from(signature).toString("hex");
      // let signature_buf = Buffer.from(signature_str, "hex");

      for (let i = 0; i < private_key_arr.length; i++) {
        const result = nacl.sign.detached.verify(
          messageBytes,
          signature_arr[i],
          signer_pkey_arr[i]
        );
        console.log("🚀 ~ file: sorolan_bridge.ts:159 ~ it ~ result:", result);

      }


      for (let i = 0; i < private_key_arr.length; i++) {

        let ix01 = anchor.web3.Ed25519Program.createInstructionWithPublicKey({
          publicKey: signer_pkey_arr[i],
          message: messageBytes,
          signature: signature_arr[i]

        });

        const claimIx = await program.methods
          .claim(
            //@ts-ignore
            signer_pkey_arr[i],
            Buffer.from(message),
            // Buffer.from(signature),
            signature_arr[i],
            userBump,
          )
          .accounts({
            claimer: program.provider.publicKey,
            user: user_kp_pubkey,
            validator: validator0_kp.publicKey,
            authority: program.provider.publicKey,
            programPda: program_pda,
            userPda: userPda,
            authorityPda: authorityPdaInfo[0],
            singleTxPda: singleTxPDA,
            tokenAccount: await getAta(mint_kp.publicKey, user_kp_pubkey, false),
            mint: mint_kp.publicKey,
            tokenProgram: spltoken.TOKEN_PROGRAM_ID,
            associatedTokenProgram: spltoken.ASSOCIATED_TOKEN_PROGRAM_ID,
            ixSysvar: web3.SYSVAR_INSTRUCTIONS_PUBKEY,
            systemProgram: web3.SystemProgram.programId,
          }).instruction()

        let claimTx = new web3.Transaction().add(ix01, claimIx);
        claimTx.recentBlockhash = (
          await provider.connection.getLatestBlockhash()
        ).blockhash;
        claimTx.feePayer = program.provider.publicKey;
        console.log("🚀 ~ file: sorolan_bridge.ts:351 ~ it ~ claimTx:", claimTx)

        try {

          let signedTx = await provider.wallet.signTransaction(claimTx);
          console.log("🚀 ~ file: sorolan_bridge.ts:346 ~ it ~ signedTx:", signedTx.serialize().byteLength)
          console.log("🚀 ~ file: sorolan_bridge.ts:358 ~ it ~ signedTx:", signedTx)


          let claimHash = await provider.connection.sendRawTransaction(signedTx.serialize());
          console.log("🚀 ~ file: sorolan_bridge.ts:349 ~ it ~ claimHash:", claimHash)

        } catch (error) {
          console.log("🚀 ~ it.only ~ error:", error)

        }
      }

    }
   
  });
});