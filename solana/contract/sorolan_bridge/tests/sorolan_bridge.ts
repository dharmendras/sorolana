import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SorolanBridge } from "../target/types/sorolan_bridge";
import * as web3 from "@solana/web3.js";
import {
  LAMPORTS_PER_SOL,
  Keypair,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";
import fs from "fs";

const PROGRAM_SEED_PREFIX = "sorolana";
const amount = new anchor.BN(0.01 * LAMPORTS_PER_SOL);
const destination_address =
  "GDUUZPJFLI6BHGUHH32L7UMAJQHCI5VTHETE3PNRXS554W3OV7HBFIVR";
let user_kp = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(fs.readFileSync("keys/user.json").toString()))
);

describe("sorolan_bridge", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SorolanBridge as Program<SorolanBridge>;
  let isRunTestCase = true;

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

  it("Authority can initialize the program pda: ", async () => {
    if (!isRunTestCase) {
      try {
        const [program_pda, player_bump] = await getProgramPda();
        console.log(
          "🚀 ~ file: sorolana.ts:57 ~ it ~ program_pda:",
          program_pda.toBase58()
        );

        const initPdaTx = await program.methods
          .initProgramPda()
          .accounts({
            authority: program.provider.publicKey,
            programPda: program_pda,
            systemProgram: SystemProgram.programId,
          })
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
    if (!isRunTestCase) {
      try {
        const [program_pda, player_bump] = await getProgramPda();
        console.log("User: ", user_kp.publicKey.toBase58());

        const depositTx = await program.methods
          .deposit(amount, destination_address)
          .accounts({
            from: user_kp.publicKey,
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
    if (isRunTestCase) {
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
              from: user_kp.publicKey,
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
});
