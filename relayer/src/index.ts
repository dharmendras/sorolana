import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor'
import { SolanaSorobanBridge , IDL } from './solana_soroban_bridge';
import { PublicKey } from '@solana/web3.js'
import findConfig from 'find-config'
import dotenv from 'dotenv'
import { publicKey } from '@project-serum/anchor/dist/cjs/utils';
import solanaWeb3  from '@solana/web3.js'
import fs from "fs";
import  client  from './connection.ts';
import { Connection } from '@solana/web3.js';

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
 async function getData() {
  client.query(`SELECT * FROM transaction` ,(err , result) => { 
    if(!err) { 
     // result.send(result.rows)
     console.log("result" , result.rows)
     console.log("result typeOf" , typeof result.rows)
  //   invokeMethod(result.rows)
     
    }
    else { 
      console.log("=====> error <======" , err)
    }
  } );
 }
//  invokeMethod()
invokeMethod()
async function invokeMethod() { 
  
  const keypair = anchor.web3.Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync('/home/imentus/imentus_project/sorolana/relayer/key.json').toString())));
 console.log("public key " , keypair.publicKey)
  // let publicKey: solanaWeb3.PublicKey
  //let your_pubkey = Pubkey::from_str("base58_pubkey").unwrap();
 // publicKey = PublicKey::from_str("base58_pubkey").unwrap();

 let msg =  [
  {
    amount: 12,
    tokenAddress: '9ZJdKLk57wS3NDPqHNybYX8aoApzZXmRhCKzZ3fLhZpo',
    tokenChain: 123,
    to: 'ALeMyZqeNSzZKTrcwHU1EJnBkxTnWXHc22iCvhyzZ3f',
    toChain: 456,
    fee: 100
  },
  109515
]
// Convert the object to a string
const objString = JSON.stringify(msg);

// Convert the string to a Buffer
const buffer = Buffer.from(objString, 'utf-8');

// Convert the Buffer to a Uint8Array
const uint8Array = new Uint8Array(buffer);
 const MSG = Uint8Array.from(Buffer.from("this is such a good message to sign"));
 let publicKey = Buffer.from("2Z8h4KGK9E5mkBj3BxJ9CFu2nE1rWdpNiF7LWWoAUvVx" , "utf8")
 let publicKey1 = "CsB3APUthSoXTq3bufyMwyHuxAUwRRo1rMw3Nccc1YbE";
// let signString = "P208fHVT5nZPXbBbSInwSBM8zioRysEGYMKszhaa4OmuSeek7gd5yiPvx5V8PQt+zjzoFub5WbstfkreL4NADA=="
let signString = "YIS9dH5kYWLykOpk8hw7QPqKnwNZMcSMk+c4L3xPO8S72hvxskPjnKZxmw5Sq9c8qd5UuZfEzaWq9fDiwC1KAw=="
let signString1 = "HV92+o5SemAsXkhBCaXhzOvMBDysZKQdySAjAp69pPVVKx4Y1gtGQpq87/BVyx6U9tHfRa+HIo9QwQXcmzJXCg=="
//const signString = Buffer.from(x).toString('base64');
const signUint8Array = new Uint8Array(Buffer.from(signString, 'base64'));
//YIS9dH5kYWLykOpk8hw7QPqKnwNZMcSMk+c4L3xPO8S72hvxskPjnKZxmw5Sq9c8qd5UuZfEzaWq9fDiwC1KAw==
//console.log(" signature " ,  signature)
//let signature: Uint8Array;

   let ix01 = anchor.web3.Ed25519Program.createInstructionWithPublicKey( {  
     publicKey: keypair.publicKey.toBytes() ,
     message : MSG ,
     signature : signUint8Array
   })
  console.log("=======>ix01<=========" , ix01)
  
 
let ix02 = await  program.methods.claim(
  //@ts-ignore
  keypair.publicKey.toBuffer() ,
  Buffer.from(MSG),
  Buffer.from(signUint8Array)
   ).accounts({ 
    sender: keypair.publicKey,
    ixSysvar: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY
   }).instruction()
console.log("======>tx02<======" , ix02)

let tx =  new  anchor.web3.Transaction().add( 
    ix01 , ix02
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
 }
// //invokeMethod()
// //7e19c86a1a26d4a4fcf994208dddfccfccd3a491f025812359c4460b4aa0806f6b015678fbe43a32b81a4bfb87b37dd7790eac4afd6f6b31eea4618540d3dc0f
// //GBKHPSI4AUQYJZC3DM22WZ7MDW6TG2TAV6QCCJMNE3D22B7CHQMMYBSY


// invokeMethod()
// async function invokeMethod() { 
//   let tx = await program.methods.hello().rpc()
//   console.log("tx" , tx)
// }

// const con = new Connection("http://127.0.0.1:8899");
// console.log("hiii")
// import express, { Request, Response } from 'express';
// let invoker = anchor.web3.Keypair.generate()
// const MSG = Uint8Array.from(Buffer.from("this is such a good message to sign"));

// //getdata
// const app = express();
// const port = 3000;

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
// client.connect();
// app.get('/Message', (req: Request, res: Response) => {
//   client.query(`SELECT * FROM message` ,(err , result) => { 
//     if(!err) { 
//         res.send(result.rows)
//       //  invokeMethod(result.rows)
        
//     }
// } );
// client.end;
// });
// app.get('/Signature', (req: Request, res: Response) => {
//   client.query(`SELECT * FROM signature` ,(err , result) => { 
//     if(!err) { 
//         res.send(result.rows)
//        // invokeMethod(result.rows)
        
//     }
// } );
// client.end;
// });