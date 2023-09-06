import * as anchor from "@coral-xyz/anchor";
import { Program , web3} from "@coral-xyz/anchor";
import { SolanaSorobanBridge } from "../target/types/solana_soroban_bridge";
import BN, { min } from 'bn.js'
import fs from "fs";
import nacl from "tweetnacl";
import * as assert from 'assert';
import { TransactionInstruction } from '@solana/web3.js';
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, Transaction, SYSVAR_RENT_PUBKEY, MAX_SEED_LENGTH } from '@solana/web3.js';
// import { TOKEN_PROGRAM_ID , MINT_SIZE , createAssociatedTokenAccountInstruction ,
//          createInitializeMintInstruction , getAssociatedTokenAddress} from "@solana/spl-token";
import { publicKey } from "@coral-xyz/anchor/dist/cjs/utils";
const con = new Connection("http://127.0.0.1:8899");
import { 
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getMint,
} from "@solana/spl-token";
//https://api.testnet.solana
//http://127.0.0.1:8899

describe("solana_soroban_bridge", () => {
  
  // Configure the client to use the local cluster.
  const connection = new Connection("http://127.0.0.1:8899");

  const keypair = anchor.web3.Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync('/home/imentus/imentus_project/sorolana/solana/contract/solana_soroban_bridge/tests/key.json').toString())));
  // const newAccountKP2 = anchor.web3.Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync('/home/dell/imentus_project/sorolana/solana/contract/soroban-soloana-bridge/tests/key2.json').toString())));
  console.log("public key 25" , keypair.publicKey)
  //anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.AnchorProvider.env();
  const signer = provider.wallet as anchor.Wallet;

  anchor.setProvider(provider)
  const MSG = Uint8Array.from(Buffer.from(" this is such a good message to sign"));
  let signature: Uint8Array;

  async function myFunction() {
    // Some asynchronous operation that returns a promise
    console.log("key 17 ", keypair.publicKey)
    // Code here will wait for the promise to resolve before continuing
    let persion = await con.getBalance(keypair.publicKey);
    console.log("person one ", persion)

    // let persion2 = await con.getBalance(newAccountKP2.publicKey)
    // console.log("person two " , persion2)
  }
  myFunction()

  const program = anchor.workspace.SolanaSorobanBridge as Program<SolanaSorobanBridge>;
  it("Is initialized!", async () => {
    // Add your test here.
    let listener = null;

    const transferAmount = new BN(1000000);

    await program.methods.deposit(transferAmount).accounts({
      from: keypair.publicKey,
      to: "CSgAJQ5prWg9NMaTWBjAj4ZRVFoFdBkKZiFuZzduEFK9",
      systemProgram: anchor.web3.SystemProgram.programId,
    }).signers([keypair]).rpc()
  
    // await program.methods.deposit(transferAmount).accounts({ 
    //     from: keypair.publicKey,
    //     to: "CSgAJQ5prWg9NMaTWBjAj4ZRVFoFdBkKZiFuZzduEFK9",
    //     systemProgram: anchor.web3.SystemProgram.programId,
    // }).signers([keypair]).rpc()
    //mint 
   // const mint = anchor.web3.Keypair.generate()
  //  const fromWallet = anchor.web3.Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync('/home/imentus/imentus_project/sorolana/solana/contract/solana_soroban_bridge/tests/fromWallet.json').toString())));
  // const mint = anchor.web3.Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync('/home/imentus/imentus_project/sorolana/solana/contract/solana_soroban_bridge/tests/mint.json').toString())));
    //Initialize mint
    //     const [mint] = await web3.PublicKey.findProgramAddressSync(
    //   [Buffer.from("mint")],
    //   program.programId
    // );
//       let txMint = await  program.methods.initializeMint().accounts({ 
//         mint: mint.publicKey,
//     payer: fromWallet.publicKey,
//     systemProgram: anchor.web3.SystemProgram.programId,
//     tokenProgram: TOKEN_PROGRAM_ID,
//     rent: anchor.web3.SYSVAR_RENT_PUBKEY
//         }).signers([fromWallet , mint]).rpc()
//         // const mintAccount = await getMint(provider.connection, mint.publicKey);
//  console.log("==========>txMint<===========" , txMint)
    // const txMint = await program.methods.initializeMint().accounts({
      
    //  }).rpc()

    // const txMint = await program.methods.initializeMint().accounts({ 
      
    // }).signers([fromWallet ]).rpc()
      //console.log("PDA Mint " , mint)
    // const mintAccount = await getMint(provider.connection, mint.publicKey);





   
  });
//     it("mint !", async () => { 
 
 
//      const fromWallet = anchor.web3.Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync('/home/imentus/imentus_project/sorolana/solana/contract/solana_soroban_bridge/tests/fromWallet.json').toString())));
//      const mint = anchor.web3.Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync('/home/imentus/imentus_project/sorolana/solana/contract/solana_soroban_bridge/tests/mint.json').toString())));

//      let associatedTokenAccount = await getAssociatedTokenAddress(
//       mint.publicKey,
//       fromWallet.publicKey,
//   );
//       console.log("=======>associatedTokenAccount<=======" , associatedTokenAccount)
//       await program.methods.mintToken(new BN(10)).accounts({
//         mint: mint.publicKey,
//         tokenProgram: TOKEN_PROGRAM_ID,
//         tokenAccount: associatedTokenAccount,
//         authority:fromWallet.publicKey,
        
//      }).signers([fromWallet]).rpc()
//      //     // const [mint] = await web3.PublicKey.findProgramAddressSync(
// //     //   [Buffer.from("mint")],
// //     //   program.programId
// //     // );
// //   //   let ata = await getAssociatedTokenAddress(
// //   //     mint,
// //   //    signer.publicKey,
// //   // );
 

// //   let associatedTokenAccount = await getAssociatedTokenAddress(
// //     mint.publicKey,
// //     fromWallet.publicKey,
// // );

// // //   console.log("========>ata<=======" , ata)


// //   const mintAccount = await getMint(provider.connection, mint.publicKey);
// // //  console.log("========>mint Account <==========" , mintAccount)
// // //  let getbalance = await connection.getBalance(mintAccount.address)
// // // console.log("getbalance" , getbalance)
// // // const transferAmount = new BN(5);

// // //withdraw

//    })
 });
//9992000000
//B7q7oBUuSH63pjofHzXoFoesjUcRVAyAYyMiCoTRcxhL
//19943980000  19942980000
//CWxK2DZT1pM6MJNqBixfte72VsT4rQLiYfU1s2ytKPdE