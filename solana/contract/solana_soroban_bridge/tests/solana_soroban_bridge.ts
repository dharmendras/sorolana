import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaSorobanBridge } from "../target/types/solana_soroban_bridge";
import  BN from 'bn.js'
import fs from "fs";
import nacl  from "tweetnacl";
import * as assert from 'assert';
import { TransactionInstruction } from '@solana/web3.js';


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
  const connection = new Connection("http://127.0.0.1:8899");

  const keypair = anchor.web3.Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync('/home/dell/imentus_project/sorolana/solana/contract/solana_soroban_bridge/tests/key.json').toString())));
 // const newAccountKP2 = anchor.web3.Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync('/home/dell/imentus_project/sorolana/solana/contract/soroban-soloana-bridge/tests/key2.json').toString())));
  
  //anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.AnchorProvider.env();
   anchor.setProvider(provider)
   const MSG = Uint8Array.from(Buffer.from("Hello Solana"));
   let signature: Uint8Array;

  async function myFunction() {
    // Some asynchronous operation that returns a promise
    console.log("key 17 " , keypair.publicKey)
    // Code here will wait for the promise to resolve before continuing
          let persion1  = await con.getBalance(keypair.publicKey);
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
           from: keypair.publicKey,
           to : "2zkUob2Rnac9RM3tJwHmeqoabHvSpfKo68515XDSRu57",
           systemProgram: anchor.web3.SystemProgram.programId
      }).signers([keypair]).rpc();
      console.log("tx" , tx)
      
    await program.methods.claim("SDFTLC3274HR57LB7JTFG6EQBZRUE5T5ICVEPCCABADUGQS7HZVKGRDX").rpc()
   
     //Ed25519 signature
 signature = nacl.sign.detached(MSG , keypair.secretKey)
 console.log(signature) // here console signature as a bytes
let signatureString = Buffer.from(signature).toString('hex') // convert uint8array in string
console.log("signature String" , signatureString) // console signature as a string

let edtx = new anchor.web3.Transaction().add( 
  // Ed25519 instruction
   anchor.web3.Ed25519Program.createInstructionWithPublicKey( 
     { 
      instructionIndex: 0, // The index of the instruction within the program
       publicKey: keypair.publicKey.toBytes(), // The public key associated with the instruction (as bytes)
       message: MSG,  // The message to be included in the instruction (as a Buffer)
       signature: signature // The signature associated with the instruction (as a Buffer)
     }
   )
 )
 console.log(" Tx Line Number 44 " , tx)
 // this is our program instruction
   const methodTx = await program.methods.verifyEd25519("A67BBEvwooNmYqxjieS12EUMCGC6potVYtsK9fy7dLaL" ,
    "Hello Solana" , 
   "4e37dca6186b6f7ad81f5ec9f310600b0f7390b7d6f3becdf7550d7cb0068e980fa9fb12ce62e02e965a54d929f700036d66df600dd84bcd4375dd180106f105").accounts({
     sender: keypair.publicKey,
     ixSysvar: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
   }).signers([keypair]).rpc();

   let result;
  try {
    result = await anchor.web3.sendAndConfirmTransaction(
 //    program.provider.connection,
      connection,
      edtx,
    [keypair]
  );
   } catch (error) {
    assert.fail(`Should not have failed with the following error:\n${error}`);

   }

    console.log("result line number 67 " , result)
  });
});
//9992000000
//B7q7oBUuSH63pjofHzXoFoesjUcRVAyAYyMiCoTRcxhL