import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor'
import { SolanaSorobanBridge , IDL } from './solana_soroban_bridge';
import { PublicKey } from '@solana/web3.js'
import findConfig from 'find-config'
import dotenv from 'dotenv'
import {MINT_SIZE , TOKEN_PROGRAM_ID ,createInitializeMintInstruction, getAssociatedTokenAddress , createAssociatedTokenAccountInstruction} from "@solana/spl-token"
//import { publicKey } from '@project-serum/anchor/dist/cjs/utils';
import solanaWeb3  from '@solana/web3.js'
import fs from "fs";
import  client  from './connection.ts';
import { Connection  } from '@solana/web3.js';

dotenv.config()
// let x = process.env.SIGNATURE
// console.log(typeof x)
const {web3} = anchor;
//const solanaWeb3 = require('@solana/web3.js')

const program_Id = new web3.PublicKey(process.env.DEFIOS_PROGRAM_ID as string)
client.connect();

anchor.setProvider(anchor.AnchorProvider.env())
const program = new anchor.Program(IDL , program_Id) as Program<SolanaSorobanBridge>
const {
  provider: { connection },
} = program


//2Z8h4KGK9E5mkBj3BxJ9CFu2nE1rWdpNiF7LWWoAUvVx
//getData()

//  invokeMethod()
invokeMethod()
async function invokeMethod() { 
  
  const keypair = anchor.web3.Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync('/home/imentus/imentus_project/sorolana/relayer/key.json').toString())));
 console.log("public key " , keypair.publicKey)
 const data = {
  amount: 12,
  tokenAddress: 'CB5ABZGAAFXZXB7XHAQT6SRT6JXH2TLIDVVHJVBEJEGD2CQAWNFD7D2U',
  tokenChain: 123,
  to: 'GAA6YOQZPDWMBXYIOW4LZFHXI4WRCFGBW4PM2ATVQBYMEZPWVNU77Z2T',
  toChain: 456,
  fee: 100
} 
const jsonString = JSON.stringify(data);
let encoder = new  TextEncoder();
const binaryData = encoder.encode(jsonString);

const MSG = new Uint8Array(binaryData);
let publicKey = "rEOqOTduMitzZJT1hUIdIH1mG4M3zMw/zU4Ye6eP/BQ="
 const buffer1 = Buffer.from(publicKey, 'base64');
 const uint8Array1 = new Uint8Array(buffer1);
console.log("======>uint8Array1<======" , uint8Array1)
  // let publicKey: solanaWeb3.PublicKey
  //let your_pubkey = Pubkey::from_str("base58_pubkey").unwrap();
 // publicKey = PublicKey::from_str("base58_pubkey").unwrap();
 let signString = "5H0QEk6gDjhReZzVCNW3IBIFyozQe8H7WFKM7h6wsdzjxfvvAteYOO9CDj3v7MyyBIvz9Sk6oe6Dla4YHSjKCA=="

 const signUint8Array = Buffer.from(signString, 'base64');
 const uint8Array2 = new Uint8Array(signUint8Array);
 console.log("======>uint8Array2<======" , uint8Array2)
 
 
const lamports: number = await program.provider.connection.getMinimumBalanceForRentExemption(
  MINT_SIZE
);
console.log("====>Program id<=====" , process.env.DEFIOS_PROGRAM_ID )
let token_address = new web3.PublicKey("EuCHwX8mqvXjdDFsSzdpq5NPk9Af5thcKTkvg5AA15jx")
let m = process.env.MINT_KEY;
console.log("===>m<====" , m)
const mintKey: anchor.web3.Keypair = anchor.web3.Keypair.generate();

const mintkey_add = new PublicKey("7LjzDrohLRCFSWNz9CfYSab3mPufXwTC6mfTRQHGiUvf")
const token_add = new PublicKey("ELwbXoZtmh3PTQUTD7KSCos89aLd44dC8Hv8Kpp5okyn");
console.log("=======>mintkey_add<=======" , mintkey_add)
console.log("=======>token_add<=========" , token_add)
const key =  anchor.AnchorProvider.env().wallet.publicKey;
const myWallet = anchor.AnchorProvider.env().wallet.publicKey;
const toWallet: anchor.web3.Keypair = anchor.web3.Keypair.generate();
   const toATA = await getAssociatedTokenAddress(
      mintkey_add,
      toWallet.publicKey
    );
      const mint_tx1 = new anchor.web3.Transaction().add(
          // Create the ATA account that is associated with our To wallet
          createAssociatedTokenAccountInstruction(
            myWallet, toATA, toWallet.publicKey, mintkey_add
          )
        );
    await anchor.AnchorProvider.env().sendAndConfirm(mint_tx1, []);

let ix01 = anchor.web3.Ed25519Program.createInstructionWithPublicKey({ 
  publicKey: uint8Array1,
  message: MSG,

  signature: uint8Array2
})
console.log("======>ix01<=======" , ix01)
 

    let ix02 =  await program.methods.claim( 
      //@ts-ignore
   uint8Array1,
   Buffer.from(MSG),
   Buffer.from(uint8Array2)
    ).accounts({
      mint: mintkey_add,
      tokenProgram: TOKEN_PROGRAM_ID,
      tokenAccount: token_add,
      to: toATA,
      authority: key,
      ixSysvar: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY
    }).rpc()

    console.log("======>tx02<======" , ix02)
    let tx =  new  anchor.web3.Transaction().add( 
    ix01 
)
tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

console.log("=======>tx<=======" , tx)
let tx_hash;
try {
  tx_hash = await anchor.web3.sendAndConfirmTransaction(
    connection,
    tx,
    [keypair]
  );
  console.log("🚀 ~ file: ed25519_poc.ts:82 ~ it ~ tx_hash:", tx_hash);

} catch (error) {
  console.log("🚀 ~ file: ed25519_poc.ts:85 ~ it ~ error:", error);
  // assert.fail(`Should not have failed with the following error:\n${error}`);
}
let associatedTokenAccount = undefined;

associatedTokenAccount = await getAssociatedTokenAddress(
  mintKey.publicKey,
  key
);
console.log("====>associatedTokenAccount<=====" , associatedTokenAccount)
console.log("====>associatedTokenAccount toBase58<=====" , associatedTokenAccount.toBase58())

const mint_tx = new anchor.web3.Transaction().add(
  // Use anchor to create an account from the mint key that we created
  anchor.web3.SystemProgram.createAccount({
    fromPubkey: key,
    newAccountPubkey: mintKey.publicKey,
    space: MINT_SIZE,
    programId: TOKEN_PROGRAM_ID,
    lamports,
  }),
  // Fire a transaction to create our mint account that is controlled by our anchor wallet
  createInitializeMintInstruction(
    mintKey.publicKey, 8, key, key
  ),
  // Create the ATA account that is associated with our mint on our anchor wallet
  createAssociatedTokenAccountInstruction(
    key, associatedTokenAccount, key, mintKey.publicKey
  )
);

  // sends and create the transaction
  const res = await anchor.AnchorProvider.env().sendAndConfirm(mint_tx, [mintKey]);

  console.log(
    await program.provider.connection.getParsedAccountInfo(mintKey.publicKey)
  );

  console.log("Account: ", res);
    console.log("Mint key: ", mintKey.publicKey.toString());
    console.log("Mint key Details: ", mintKey);

    console.log("Key : ", key);
    console.log("Key: ", key.toString());



      
 }
