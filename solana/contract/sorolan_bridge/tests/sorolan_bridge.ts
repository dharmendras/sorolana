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
// import { abc } from "./msg";

//anchor test --skip-local-validator --skip-build --skip-deploy

const PROGRAM_SEED_PREFIX = "soroban_solana";
const AUTHORITY_SEED_PREFIX = "soroban_authority";
const amount = new anchor.BN(1 * LAMPORTS_PER_SOL);
const destination_address =
  "GDUUZPJFLI6BHGUHH32L7UMAJQHCI5VTHETE3PNRXS554W3OV7HBFIVR";
let user_kp = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(fs.readFileSync("keys/user.json").toString()))
);
let validator_kp = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(fs.readFileSync("keys/validator.json").toString()))
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

let Soroban_msg = {
  tokenAddress: "CB5ABZGAAFXZXB7XHAQT6SRT6JXH2TLIDVVHJVBEJEGD2CQAWNFD7D2U",
  tokenChain: 123,
  to: "9Bxt5hHicRnJSLy5f8KAWf2Cmgrcke9zqx1BfXGeF3jH",
  toChain: 456,
  fee: 100,
  amount: 1,
};

describe("sorolan_bridge", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SorolanBridge as Program<SorolanBridge>;
  let isRunTestCase = true;

  const getAuthorityPda = async () => {
    const programPdaInfo = web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode(AUTHORITY_SEED_PREFIX),
        program.provider.publicKey.toBuffer(),
      ],
      program.programId
    );
    return programPdaInfo;
  };
  const getProgramPda = async () => {
    console.log(
      "🚀 ~ file: sorolana.ts:23 ~ getProgramPda ~ Authority publicKey:",
      program.provider.publicKey.toBase58()
    );
    const programPdaInfo = web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode(PROGRAM_SEED_PREFIX),
        program.provider.publicKey.toBuffer(),
      ],
      program.programId
    );
    return programPdaInfo;
  };

  // Get ATA
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
    // console.log("🚀 ~ file: verifyUtility.ts:42 ~ getAta ~ ata:", ata.toBase58());
    console.log(
      "🚀 ~ file: sorolan_bridge.ts:84 ~ describe ~ owner:",
      owner.toBase58()
    );
    return ata;
  };

  it("Can initialize a authority pda: ", async () => {
    if (!isRunTestCase) {
      const [authorityPda, authorityBump] =
        web3.PublicKey.findProgramAddressSync(
          [
            anchor.utils.bytes.utf8.encode(AUTHORITY_SEED_PREFIX),
            program.provider.publicKey.toBuffer(),
          ],
          program.programId
        );
      console.log(
        "🚀 ~ file: sorolan_bridge.ts:108 ~ it ~ authorityPda:",
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
    }
  });

  it("Authority can initialize the mint account: ", async () => {
    if (isRunTestCase) {
      try {
        let authorityPdaInfo = await getAuthorityPda();
        console.log("🚀 ~ file: sorolan_bridge.ts:135 ~ it ~ authorityPdaInfo:", authorityPdaInfo[0].toBase58())
        console.log("🚀 ~ file: sorolan_bridge.ts:142 ~ it ~ mint_kp.publicKey:", mint_kp.publicKey.toBase58())
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
          "🚀 ~ file: sorolan_bridge.ts:52 ~ it ~ initPdaTx:",
          initPdaTx
        );
      } catch (error) {
        console.log("🚀 ~ file: sorolana.ts:56 ~ it ~ error:", error);
      }
    }
  });

  it("Users can deposit funds to the program pda: ", async () => {
    if (isRunTestCase) {
      try {
        const [program_pda, player_bump] = await getProgramPda();
        console.log(
          "🚀 ~ file: sorolan_bridge.ts:122 ~ it ~ program_pda:",
          program_pda.toBase58()
        );
        console.log("User: ", user_kp.publicKey.toBase58());

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
            console.log("DepositEvent: ", event.amount.toNumber(), slot);
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
    if (isRunTestCase) {
      console.log(
        "🚀 ~ file: sorolan_bridge.ts:145 ~ it ~ Soroban_msg:",
        Soroban_msg
      );

      // const message = `${Soroban_msg}`;
      // const messageBytes = decodeUTF8(message);
      const message = JSON.stringify(Soroban_msg);
      console.log("🚀 ~ file: sorolan_bridge.ts:234 ~ it ~ message:", message)
      const messageBytes = Buffer.from(message, "utf-8");
      console.log("Encode data: ", encodeUTF8(messageBytes)[0]);

      console.log(
        "🚀 ~ file: sorolan_bridge.ts:152 ~ it ~ messageBytes:",
        messageBytes
      );
      const message_vec = Buffer.from(messageBytes);
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
      const result = nacl.sign.detached.verify(
        messageBytes,
        signature,
        validator_kp.publicKey.toBytes()
      );
      console.log("🚀 ~ file: sorolan_bridge.ts:159 ~ it ~ result:", result);

      let signString = Buffer.from(signature).toString("hex");

      let ix01 = anchor.web3.Ed25519Program.createInstructionWithPublicKey({
        publicKey: validator_kp.publicKey.toBytes(), // The public key associated with the instruction (as bytes)
        message: messageBytes, // The message to be included in the instruction (as a Buffer)
        signature: signature, // The signature associated with the instruction (as a Buffer)
        // instructionIndex: 0
      });
      console.log("🚀 ~ file: sorolan_bridge.ts:271 ~ it ~ ix01:", ix01)

      console.log(
        "🚀 ~ file: sorolan_bridge.ts:231 ~ it ~ await getAta(mint_kp.publicKey, user_kp.publicKey, false):",
        (await getAta(mint_kp.publicKey, user_kp.publicKey, false)).toBase58()
      );
      let authorityPdaInfo = await getAuthorityPda();
      const claimIx = await program.methods
        .claim(
          //@ts-ignore
          validator_kp.publicKey.toBuffer(),
          Buffer.from(message),
          Buffer.from(signature)
        )
        .accounts({
          user: user_kp.publicKey,
          authorityPda: authorityPdaInfo[0],
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
      // Instruction: 1

      let claimTx = new web3.Transaction().add(ix01, claimIx);
      claimTx.recentBlockhash = (
        await provider.connection.getLatestBlockhash()
      ).blockhash;
      claimTx.feePayer = await user_kp.publicKey;

      let claimHash;
      try {
        claimHash = await web3.sendAndConfirmTransaction(
          provider.connection,
          claimTx,
          [user_kp]
        );
        console.log(
          "🚀 ~ file: sorolan_bridge.ts:213 ~ it ~ claimHash:",
          claimHash
        );
      } catch (error) {
        console.log("🚀 ~ file: sorolan_bridge.ts:211 ~ it ~ error:", error);
      }
    }
  });

  it("Burn the token from the user's wallet", async () => {
    if (!isRunTestCase) {
      try {
        console.log(
          "🚀 ~ file: sorolan_bridge.ts:286 ~ it ~ await getAta(mint_kp.publicKey, user_kp.publicKey, false):",
          (await getAta(mint_kp.publicKey, user_kp.publicKey, false)).toBase58()
        );
        let balance = await spltoken.getAccount(
          provider.connection,
          await getAta(mint_kp.publicKey, user_kp.publicKey, false)
        );
        console.log(
          "🚀 ~ file: sorolan_bridge.ts:295 ~ it ~ balance:",
          balance
        );
        const withdrawTx = await program.methods
          .withdraw(new anchor.BN(0.06 * LAMPORTS_PER_SOL))
          .accounts({
            user: user_kp.publicKey,
            mint: mint_kp.publicKey,
            tokenProgram: spltoken.TOKEN_PROGRAM_ID,
            tokenAccount: await getAta(
              mint_kp.publicKey,
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
        const message = JSON.stringify(Soroban_msg);
        const messageBytes = Buffer.from(message, "utf-8");
        const signer_pkey = validator_kp.publicKey.toBytes();
        const signature = nacl.sign.detached(
          messageBytes,
          validator_kp.secretKey
        );
        console.log(
          "🚀 ~ file: sorolan_bridge.ts:333 ~ it ~ signature:",
          signature
        );

        const result = nacl.sign.detached.verify(
          messageBytes,
          signature,
          validator_kp.publicKey.toBytes()
        );
        console.log("🚀 ~ file: sorolan_bridge.ts:340 ~ it ~ result:", result);

        let ix01 = anchor.web3.Ed25519Program.createInstructionWithPublicKey({
          publicKey: validator_kp.publicKey.toBytes(), // The public key associated with the instruction (as bytes)
          message: messageBytes, // The message to be included in the instruction (as a Buffer)
          signature: signature, // The signature associated with the instruction (as a Buffer)
          // instructionIndex: 0
        });

        const [program_pda, player_bump] = await getProgramPda();
        console.log(
          "🚀 ~ file: sorolan_bridge.ts:362 ~ it ~ await getProgramPda()[0]:",
          program_pda.toBase58()
        );

        const releaseIx = await program.methods
          .releaseFunds(
            //@ts-ignore
            validator_kp.publicKey.toBuffer(),
            Buffer.from(message),
            Buffer.from(signature)
          )
          .accounts({
            authority: deployer_kp.publicKey,
            programPda: program_pda,
            receiver: user_kp.publicKey,
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
