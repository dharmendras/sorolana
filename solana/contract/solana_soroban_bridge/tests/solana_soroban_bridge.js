"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const anchor = __importStar(require("@coral-xyz/anchor"));
const bn_js_1 = __importDefault(require("bn.js"));
const fs_1 = __importDefault(require("fs"));
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const assert = __importStar(require("assert"));
const web3_js_1 = require("@solana/web3.js");
const con = new web3_js_1.Connection("http://127.0.0.1:8899");
//https://api.testnet.solana
//http://127.0.0.1:8899
const fromWallet = anchor.web3.Keypair.generate();
const mint = anchor.web3.Keypair.generate();
describe("solana_soroban_bridge", () => {
    // Configure the client to use the local cluster.
    const connection = new web3_js_1.Connection("http://127.0.0.1:8899");
    const keypair = anchor.web3.Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs_1.default.readFileSync('/home/imentus/imentus_project/sorolana/solana/contract/solana_soroban_bridge/tests/key.json').toString())));
    // const newAccountKP2 = anchor.web3.Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync('/home/dell/imentus_project/sorolana/solana/contract/soroban-soloana-bridge/tests/key2.json').toString())));
    //anchor.setProvider(anchor.AnchorProvider.env());
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);
    const MSG = Uint8Array.from(Buffer.from(" this is such a good message to sign"));
    let signature;
    function myFunction() {
        return __awaiter(this, void 0, void 0, function* () {
            // Some asynchronous operation that returns a promise
            console.log("key 17 ", keypair.publicKey);
            // Code here will wait for the promise to resolve before continuing
            let persion = yield con.getBalance(keypair.publicKey);
            console.log("person one ", persion);
            // let persion2 = await con.getBalance(newAccountKP2.publicKey)
            // console.log("person two " , persion2)
        });
    }
    myFunction();
    const program = anchor.workspace.SolanaSorobanBridge;
    it("Is initialized!", () => __awaiter(void 0, void 0, void 0, function* () {
        // Add your test here.
        let listener = null;
        const transferAmount = new bn_js_1.default(1000000);
        const tx = yield program.methods.deposite(transferAmount).accounts({
            from: keypair.publicKey,
            to: "4w9ucDgytMHCbCUPvxj5FSFWWQyuoukFvM8t9xRAtvxr",
            systemProgram: anchor.web3.SystemProgram.programId
        }).signers([keypair]).rpc();
        console.log("tx", tx);
        // yield program.methods.claim("SDFTLC3274HR57LB7JTFG6EQBZRUE5T5ICVEPCCABADUGQS7HZVKGRDX").rpc();
        // //Ed25519 signature
        // signature = tweetnacl_1.default.sign.detached(MSG, keypair.secretKey);
        // console.log(signature); // here console signature as a bytes
        // let signatureString = Buffer.from(signature).toString('hex'); // convert uint8array in string
        // console.log("signature String", signatureString); // console signature as a string
        // const { blockhash } = yield connection.getLatestBlockhash();
        // let ix01 = // Ed25519 instruction
        //  anchor.web3.Ed25519Program.createInstructionWithPublicKey({
        //     instructionIndex: 0,
        //     publicKey: keypair.publicKey.toBytes(),
        //     message: MSG,
        //     signature: signature // The signature associated with the instruction (as a Buffer)
        // });
        // let ix02 = yield program.methods.verifyEd25519("A67BBEvwooNmYqxjieS12EUMCGC6potVYtsK9fy7dLaL", "this is such a good message to sign", signatureString).accounts({
        //     sender: keypair.publicKey,
        //     ixSysvar: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
        // }).instruction();
        // console.log(" Tx Line Number 44 ", tx);
        // // this is our program instruction
        // let Ed25519tx = new anchor.web3.Transaction().add(ix01, ix02);
        // let result;
        // try {
        //     result = yield anchor.web3.sendAndConfirmTransaction(
        //     //    program.provider.connection,
        //     connection, Ed25519tx, [keypair]);
        // }
        // catch (error) {
        //     assert.fail(`Should not have failed with the following error:\n${error}`);
        // }
        // console.log("result line number 67 ", result);
    }));
});
//9992000000
//B7q7oBUuSH63pjofHzXoFoesjUcRVAyAYyMiCoTRcxhL
