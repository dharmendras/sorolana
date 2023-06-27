import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaSorobanBridge } from "../target/types/solana_soroban_bridge";
import  BN from 'bn.js'
import fs from "fs";
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL,PublicKey, Transaction,SYSVAR_RENT_PUBKEY, MAX_SEED_LENGTH } from '@solana/web3.js';
// import { TOKEN_PROGRAM_ID , MINT_SIZE , createAssociatedTokenAccountInstruction ,
//          createInitializeMintInstruction , getAssociatedTokenAddress} from "@solana/spl-token";
import { publicKey } from "@coral-xyz/anchor/dist/cjs/utils";
const con = new Connection("http://127.0.0.1:8899");
//https://api.testnet.solana
//http://127.0.0.1:8899
const fromWallet = anchor.web3.Keypair.generate()
const mint = anchor.web3.Keypair.generate()
describe("solana_soroban_bridge", () => {
  // Configure the client to use the local cluster.
  const newAccountKP1 = anchor.web3.Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync('/home/dell/imentus_project/sorolana/solana/contract/solana_soroban_bridge/tests/key.json').toString())));
 // const newAccountKP2 = anchor.web3.Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync('/home/dell/imentus_project/sorolana/solana/contract/soroban-soloana-bridge/tests/key2.json').toString())));
  
  //anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.AnchorProvider.env();
   anchor.setProvider(provider)
  
  async function myFunction() {
    // Some asynchronous operation that returns a promise
    console.log("key 17 " , newAccountKP1.publicKey)
    // Code here will wait for the promise to resolve before continuing
          let persion1  = await con.getBalance(newAccountKP1.publicKey);
          console.log("person one " , persion1)

          // let persion2 = await con.getBalance(newAccountKP2.publicKey)
          // console.log("person two " , persion2)
  }
  myFunction()

  const program = anchor.workspace.SolanaSorobanBridge as Program<SolanaSorobanBridge>;
  it("Is initialized!", async () => {
    // Add your test here.
    let listener = null;

    const transferAmount = new BN(1000000);
  
      const tx = await program.methods.deposite(transferAmount).accounts({ 
           from: newAccountKP1.publicKey,
           to : "2zkUob2Rnac9RM3tJwHmeqoabHvSpfKo68515XDSRu57",
           systemProgram: anchor.web3.SystemProgram.programId
      }).signers([newAccountKP1]).rpc();
      console.log("tx" , tx)
      
    await program.methods.claim("SDFTLC3274HR57LB7JTFG6EQBZRUE5T5ICVEPCCABADUGQS7HZVKGRDX").rpc()
   

  });
});
//9992000000
//B7q7oBUuSH63pjofHzXoFoesjUcRVAyAYyMiCoTRcxhL