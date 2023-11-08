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
import { min } from "bn.js";
// import { abc } from "./msg";

//anchor test --skip-local-validator --skip-build --skip-deploy

const PROGRAM_SEED_PREFIX = "soroban_solana_stag";
const USER_SEED_PREFIX = "prevent_duplicate_claimV1_stage";
const TOKEN_SEED_PREFIX = "sorolan seed for wrapped XLM";
const TOKEN_NAME = "W-XLM";
const TOKEN_SYMBOL = "WXLM";
const TOKEN_URI = "";
const AUTHORITY_SEED_PREFIX = "soroban_authority_stage";
const amount = new anchor.BN(1 * LAMPORTS_PER_SOL);

const destination_address =
  "GDUUZPJFLI6BHGUHH32L7UMAJQHCI5VTHETE3PNRXS554W3OV7HBFIVR";
let user_kp = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(fs.readFileSync("keys/user.json").toString()))
);
let validator0_kp = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(fs.readFileSync("keys/validator1.json").toString()))
);
let validator1_kp = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(fs.readFileSync("keys/validator1.json").toString()))
);
let validator2_kp = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(fs.readFileSync("keys/validator2.json").toString()))
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
  decimals: 7,
};

let db_msg = {
  counter: 1,
  tokenAddress: "CDILU5",
  tokenChain: 456,
  to: "DeGYwpUPA5NgrTJvLFJQk63DuqRUJmoyMreHJcsgrHh5",
  toChain: 123,
  fee: 100,
  method: "W",
  amount: 15000000,
};

let Soroban_msg = {
  counter: 3,
  tokenAddress: "CB5ABZGAAFXZXB7XHAQT6SRT6JXH2TLIDVVHJVBEJEGD2CQAWNFD7D2U",
  tokenChain: 1234,
  to: "8CSbDYyUJGZRby3nbsJ2FzJS3nzfXojCNHGeSrtTHvGA",
  toChain: 5678,
  fee: 100,
  method: "Burn",
  amount: 10000000,
};

let validator_signature =
  "6369015fa7da1ea96bc8b683ed6b5549b065afae6bd9e6e9f0c108f76f10ce7dd33f76c6e77f1c7f965d82cb542bbe1918f3ae792d2498631977265fa1d3a307";
let user_kp_pubkey = new PublicKey(
  "DeGYwpUPA5NgrTJvLFJQk63DuqRUJmoyMreHJcsgrHh5"
);
// let user_kp_pubkey = new PublicKey(
//   "Y959mtt5U4SRzLnXUtPvQDR5RRfX5vYwZJisrftWckC"
// );
let Withdraw_msg = {
  counter: 1,
  tokenAddress: "CB5ABZGAAFXZXB7XHAQT6SRT6JXH2TLIDVVHJVBEJEGD2CQAWNFD7D2U",
  tokenChain: 123,
  to: "GGPud2eDjZ4QNrCrriLcppB617BEAKPXcyPGYsFrxeeP",
  toChain: 456,
  fee: 100,
  method: "Burn",
  amount: 100000000,
};

describe("sorolan_bridge", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SorolanBridge as Program<SorolanBridge>;
  console.log(
    "🚀 ~ file: sorolan_bridge.ts:99 ~ describe ~ program:",
    program.programId
  );
  let isRunTestCase = true;

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

  let metaId = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
  let seed1 = Buffer.from(anchor.utils.bytes.utf8.encode("metadata"));
  let seed2 = Buffer.from(metaId.toBytes());

  it("Can initialize a authority pda: ", async () => {
    if (isRunTestCase) {
      const [mint, mintBump] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from(TOKEN_SEED_PREFIX)],
        program.programId
      );
      console.log(
        "🚀 ~ file: custom_token.ts:58 ~ it ~ mint:",
        mint.toBase58()
      );
      // addMetadata();
      let [metadata, metabump] = PublicKey.findProgramAddressSync(
        [seed1, seed2, Buffer.from(mint.toBytes())],
        metaId
      );
      console.log(
        "🚀 ~ file: custom_token.ts:42 ~ it ~ metadata:",
        metadata.toBase58()
      );

      try {
        let initTx = await program.methods
          .initTokenAddress(mintBump, TOKEN_NAME, TOKEN_SYMBOL, TOKEN_URI)
          .accounts({
            metadata: metadata,
            mint: mint,
            authority: program.provider.publicKey,
            rent: web3.SYSVAR_RENT_PUBKEY,
            systemProgram: web3.SystemProgram.programId,
            tokenProgram: spltoken.TOKEN_PROGRAM_ID,
            tokenMetadataProgram: metaId,
          })
          .rpc();
        console.log("🚀 ~ file: sorolan_bridge.ts:196 ~ it ~ initTx:", initTx);
      } catch (error) {
        console.log("🚀 ~ file: sorolan_bridge.ts:184 ~ it ~ error:", error);
      }
    }
  });

  // it("Authority can initialize the mint account: ", async () => {
  //   if (isRunTestCase) {
  //     try {
  //       let authorityPdaInfo = await getAuthorityPda();
  //       console.log("authorityPdaInfo:", authorityPdaInfo[0].toBase58());
  //       console.log("Token mint address:", mint_kp.publicKey.toBase58());
  //       const initPdaTx = await program.methods
  //         .initTokenMint()
  //         .accounts({
  //           authority: program.provider.publicKey,
  //           authorityPda: authorityPdaInfo[0],
  //           mint: mint_kp.publicKey,
  //           rent: web3.SYSVAR_RENT_PUBKEY,
  //           systemProgram: SystemProgram.programId,
  //           tokenProgram: spltoken.TOKEN_PROGRAM_ID,
  //         })
  //         .signers([mint_kp])
  //         .rpc();
  //       console.log(
  //         "🚀 ~ file: sorolan_bridge.ts:195 ~ it ~ initPdaTx:",
  //         initPdaTx
  //       );
  //     } catch (error) {
  //       console.log("🚀 ~ file: sorolana.ts:56 ~ it ~ error:", error);
  //     }
  //   }
  // });

  it("Users can deposit funds to the program pda: ", async () => {
    if (isRunTestCase) {
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
    }
  });

  it("Listen events at the time of deposit the funds: ", async () => {
    if (!isRunTestCase) {
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
    }
  });

  it("Verfiy and mint method: ", async () => {
    if (!isRunTestCase) {
      const message = JSON.stringify(db_msg);
      console.log("🚀 ~ file: sorolan_bridge.ts:234 ~ it ~ message:", message);
      const messageBytes = Buffer.from(message, "utf-8");
      console.log(
        "🚀 ~ file: sorolan_bridge.ts:280 ~ it ~ messageBytes:",
        messageBytes,
        messageBytes.length
      );
      const signer_pkey = validator0_kp.publicKey.toBytes();

      const signature = nacl.sign.detached(
        messageBytes,
        validator0_kp.secretKey
      );

      let signature_str = Buffer.from(signature).toString("hex");
      let signature_buf = Buffer.from(signature_str, "hex");

      const result = nacl.sign.detached.verify(
        messageBytes,
        signature_buf,
        validator0_kp.publicKey.toBytes()
      );
      console.log("🚀 ~ file: sorolan_bridge.ts:159 ~ it ~ result:", result);

      let ix01 = anchor.web3.Ed25519Program.createInstructionWithPublicKey({
        publicKey: validator0_kp.publicKey.toBytes(), // The public key associated with the instruction (as bytes)
        message: messageBytes, // The message to be included in the instruction (as a Buffer)
        signature: signature_buf, // The signature associated with the instruction (as a Buffer)
        // instructionIndex: 0
      });

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

      const [mint, mintBump] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from(TOKEN_SEED_PREFIX)],
        program.programId
      );
      console.log(
        "🚀 ~ file: sorolan_bridge.ts:347 ~ it ~ mint:",
        mint.toBase58()
      );

      // let info = await provider.connection.getAccountInfo(userPda);
      // console.log("🚀 ~ file: sorolan_bridge.ts:316 ~ it ~ info:", info);

      console.log(
        "🚀 ~ file: sorolan_bridge.ts:369 ~ it ~ program_pda:",
        program_pda.toBase58()
      );
      console.log(
        "🚀 ~ file: sorolan_bridge.ts:364 ~ it ~ program.provider.publicKey:",
        program.provider.publicKey.toBase58()
      );
      const claimIx = await program.methods
        .claim(
          //@ts-ignore
          validator0_kp.publicKey.toBuffer(),
          Buffer.from(message),
          // Buffer.from(signature),
          signature_buf,
          userBump,
          mintBump
        )
        .accounts({
          claimer: program.provider.publicKey,
          user: user_kp_pubkey,
          validator: validator0_kp.publicKey,
          authority: program.provider.publicKey,
          programPda: program_pda,
          userPda: userPda,
          // authorityPda: authorityPdaInfo[0],
          tokenAccount: await getAta(mint, user_kp_pubkey, false),
          mint: mint,
          tokenProgram: spltoken.TOKEN_PROGRAM_ID,
          associatedTokenProgram: spltoken.ASSOCIATED_TOKEN_PROGRAM_ID,
          rent: web3.SYSVAR_RENT_PUBKEY,
          ixSysvar: web3.SYSVAR_INSTRUCTIONS_PUBKEY,
          systemProgram: web3.SystemProgram.programId,
        })
        .instruction();
      // Instruction: 1

      let budgetIx = web3.ComputeBudgetProgram.setComputeUnitLimit({
        units: 1_400_000,
      });
      let claimTx = new web3.Transaction().add(budgetIx,claimIx, ix01);
      // budgetIx.data.byteLength;
      console.log(
        "🚀 ~ file: sorolan_bridge.ts:348 ~ it ~ budgetIx.data.byteLength:",
        budgetIx.data.byteLength
      );
      // claimTx.add(budgetIx);
      claimTx.recentBlockhash = (
        await provider.connection.getLatestBlockhash()
      ).blockhash;
      claimTx.feePayer = program.provider.publicKey;
      // console.log("🚀 ~ file: sorolan_bridge.ts:351 ~ it ~ claimTx:", claimTx);

      try {
        let signedTx = await provider.wallet.signTransaction(claimTx);

        let claimHash = await provider.connection.sendRawTransaction(
          signedTx.serialize()
        );
        console.log(
          "🚀 ~ file: sorolan_bridge.ts:349 ~ it ~ claimHash:",
          claimHash
        );
      } catch (error) {
        console.log("🚀 ~ file: sorolan_bridge.ts:351 ~ it ~ error:", error);
      }
      // try {
      //   let claimHash = await web3.sendAndConfirmTransaction(
      //     provider.connection,
      //     claimTx,
      //     [deployer_kp]
      //   );
      //   console.log(
      //     "🚀 ~ file: sorolan_bridge.ts:213 ~ it ~ claimHash:",
      //     claimHash
      //   );
      // } catch (error) {
      //   console.log("🚀 ~ file: sorolan_bridge.ts:211 ~ it ~ error:", error);
      // }
    }
  });

  it("Burn the token from the user's wallet", async () => {
    if (!isRunTestCase) {
      try {
        const [mint, mintBump] = web3.PublicKey.findProgramAddressSync(
          [Buffer.from(TOKEN_SEED_PREFIX)],
          program.programId
        );
        let balance = await spltoken.getAccount(
          provider.connection,
          await getAta(mint, user_kp.publicKey, false)
        );
        console.log(
          "🚀 ~ file: sorolan_bridge.ts:295 ~ it ~ balance:",
          balance
        );
        const withdrawTx = await program.methods
          .withdraw(new anchor.BN(6000000), "fghjk")
          .accounts({
            user: user_kp.publicKey,
            mint: mint,
            tokenProgram: spltoken.TOKEN_PROGRAM_ID,
            tokenAccount: await getAta(
              mint,
              user_kp.publicKey,
              false
            ),
          })
          .signers([user_kp])
          .rpc();
        console.log(
          "🚀 ~ file: sorolan_bridge.ts:288 ~ it ~ withdrawTx:",
          withdrawTx
        );
      } catch (error) {
        console.log("🚀 ~ file: sorolan_bridge.ts:281 ~ it ~ error:", error);
      }
    }
  });

  it("release the funds into the user's wallet: ", async () => {
    if (!isRunTestCase) {
      try {
        const message = JSON.stringify(Withdraw_msg);
        const messageBytes = Buffer.from(message, "utf-8");
        const signer_pkey = validator0_kp.publicKey.toBytes();
        const signature = nacl.sign.detached(
          messageBytes,
          validator0_kp.secretKey
        );
        console.log(
          "🚀 ~ file: sorolan_bridge.ts:333 ~ it ~ signature:",
          signature
        );

        const result = nacl.sign.detached.verify(
          messageBytes,
          signature,
          validator0_kp.publicKey.toBytes()
        );
        console.log("🚀 ~ file: sorolan_bridge.ts:340 ~ it ~ result:", result);

        let ix01 = anchor.web3.Ed25519Program.createInstructionWithPublicKey({
          publicKey: validator0_kp.publicKey.toBytes(), // The public key associated with the instruction (as bytes)
          message: messageBytes, // The message to be included in the instruction (as a Buffer)
          signature: signature, // The signature associated with the instruction (as a Buffer)
          // instructionIndex: 0
        });

        const [program_pda, player_bump] = await getProgramPda();
        console.log(
          "🚀 ~ file: sorolan_bridge.ts:362 ~ it ~ await getProgramPda()[0]:",
          program_pda.toBase58()
        );
        let [userPda, userBump] = await getUserPda(
          user_kp.publicKey,
          validator0_kp.publicKey
        );
        let authorityPdaInfo = await getAuthorityPda();

        const releaseIx = await program.methods
          .claim(
            //@ts-ignore
            validator0_kp.publicKey.toBuffer(),
            Buffer.from(message),
            Buffer.from(signature),
            userBump
          )
          .accounts({
            claimer: program.provider.publicKey,
            user: user_kp.publicKey,
            authority: program.provider.publicKey,
            programPda: program_pda,
            userPda: userPda,
            // authorityPda: authorityPdaInfo[0],
            tokenAccount: await getAta(
              mint_kp.publicKey,
              user_kp.publicKey,
              false
            ),
            mint: mint_kp.publicKey,
            tokenProgram: spltoken.TOKEN_PROGRAM_ID,
            associatedTokenProgram: spltoken.ASSOCIATED_TOKEN_PROGRAM_ID,
            // authority: program.provider.publicKey,
            ixSysvar: web3.SYSVAR_INSTRUCTIONS_PUBKEY,
            systemProgram: web3.SystemProgram.programId,
          })
          .instruction();

        let releaseTx = new web3.Transaction().add(ix01, releaseIx);
        releaseTx.recentBlockhash = (
          await provider.connection.getLatestBlockhash()
        ).blockhash;

        let claimHash = await web3.sendAndConfirmTransaction(
          provider.connection,
          releaseTx,
          [deployer_kp]
        );
        console.log(
          "🚀 ~ file: sorolan_bridge.ts:378 ~ it ~ claimHash:",
          claimHash
        );
      } catch (error) {
        console.log("🚀 ~ file: sorolan_bridge.ts:325 ~ it ~ error:", error);
      }
    }
  });
});
