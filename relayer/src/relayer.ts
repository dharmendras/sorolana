import * as SorobanClient from 'soroban-client'
//import { encode } from './encode';
import { encode } from '../src/encode';
import * as convert from './convert';

import * as decode from '../src/convert';
import { bytes } from '@project-serum/anchor/dist/cjs/utils';
const util = require('tweetnacl-util');
import client from './connection';
const xdr = SorobanClient.xdr
//New Contract id //CB7CVFVSVJJLBU7Q3BPQ7UABTNA3KM3WX56ZXXIC3WVO2RIXGUO5S63T // correct
//Old Contract id //CDYJIZWBM7XKUBU3TAT2YKCZQ2NOMNBO3DBEYBGKCNB7A2PTCMBIYOXJ 
const contractId ='CABY4TXCIAVPQN2FDQR6KJJ7QJQT5YXIXTBNLEUGFB7XCEJ32CGVPBKB';
const pk = 'GCGYPV74AQEWXRIKSUJOZSDDKK5EKW5YKQNTDGHIIFRIBINEKHVBNAUV';
const secret = 'SDUVNU7NXHQT6WVLOLR6FK7E44AK2TKYQZRTCCY34DWZPMGJQD4Q66OR';

function base64Decode(encoded: string): Uint8Array {
    return new Uint8Array(Buffer.from(encoded, 'base64'));
  }
  
  // Convert the Ed25519 address to bytes32
  function convertToBytes32(address: string): Uint8Array {
    // Step 1: Decode the base64-encoded address into a byte array
    const decodedAddressBytes = base64Decode(address);
  
    // Step 2: Extract the public key portion of the address
    const publicKeyBytes = decodedAddressBytes.slice(0, 32);
  
    // Step 3: Pad the public key with zeros to make it a bytes32 array
    const bytes32Array = new Uint8Array(32);
    bytes32Array.set(publicKeyBytes, 32 - publicKeyBytes.length);
  
    return bytes32Array;
  }
//Bpr5jj5KqSbNaxhvobLvAEguLRAFL59TKWcoA64i8kqH
//CB5ABZGAAFXZXB7XHAQT6SRT6JXH2TLIDVVHJVBEJEGD2CQAWNFD7D2U
const test = async () => { 
    const data= {
        amount: 12,
        tokenAddress: 'CB5ABZGAAFXZXB7XHAQT6SRT6JXH2TLIDVVHJVBEJEGD2CQAWNFD7D2U',
        tokenChain: 123,
        to: 'GAA6YOQZPDWMBXYIOW4LZFHXI4WRCFGBW4PM2ATVQBYMEZPWVNU77Z2T',
        toChain: 456,
        fee: 100
      }
      let jsonString = JSON.stringify(data)
    console.log("====>jsonString<=====" , jsonString)
  
    let string = jsonString.toString();
    console.log("======>string<======" , string);
    const messageUint8 = util.decodeUTF8(string);
      console.log("=======>messageUint8<========" , messageUint8);
    const ed25519Address = "RuHOWf4MLSGS/O/66jlJQaYcGzr0Cu50R9heVWpVjKg="; // public key 1
    const ed25519Address1 = "naJVdV67IpqE1WDJeEn+iN+uBOJnkTveQyGA6P9plOs="; // public key 2
    const ed25519Address2= "A+DMjDLH14/vqqgZNgUGwhxGdYPTD4YvmQkH7kgMEOA="; // public key  3
    const ed25519Address3 = "30uCRZAdb/8guPrNrv9pwP8aBEwDE0VBuaVMhmtCkek="; // public key 4

    
const bytes32Array = convertToBytes32(ed25519Address);
const bytes32Array1 = convertToBytes32(ed25519Address1);
const bytes32Array2 = convertToBytes32(ed25519Address2);
const bytes32Array3 = convertToBytes32(ed25519Address3);


let signString = "nEbocQHopClU+usbhja2PIPq0q6IKuLJxv8ipZiTRdqUv/KhyM+xSdKL8f3UNPuSFRIcO1i2w5CnNcLis3dVCg=="
let signString1 = "GZWyt+CQooeQ3OpGNiO0jRWCwvtPQS9iq2eRUxtlUQ9ihLP5tWksZDSI6bWPuIWw0E20w36yaZVMXa9LJQJLBg=="
let signString2 = "uZLZSm353++u86npRZsDSvzFR6misDk3vjUTmOdlEBn5QooJJcvEYCaRb8s5a57jpHuPUxrsz2vjIfhgZJx/AQ=="
let signString3 = "hTbe9FzQKyCJOkmRxFoyXq0nWgCwMKUFTo4qoiRf/+ZTJZzXbvr6Q94HqF7Uw5+xmI0RYhKDeEvuhZQ/C3loBg==";
const signUint8Array = new Uint8Array(Buffer.from(signString, 'base64'));
const signUint8Array1 = new Uint8Array(Buffer.from(signString1, 'base64'));
const signUint8Array2 = new Uint8Array(Buffer.from(signString2, 'base64'));
const signUint8Array3 = new Uint8Array(Buffer.from(signString3, 'base64'));

let signature_array: Uint8Array[] = [signUint8Array , signUint8Array1 , signUint8Array2 , signUint8Array3];
let public_array: Uint8Array[] = [bytes32Array , bytes32Array1 , bytes32Array2 , bytes32Array3];
console.log("======><=======" , bytes32Array); // Output: Uint8Array(32) [...bytes]
    const server = new SorobanClient.Server(
        `https://rpc-futurenet.stellar.org:443`
    );
    
    try {
        const contract = new SorobanClient.Contract(contractId);
        const account = await server.getAccount(pk);
        let method = 'claim'
        
     
        const obj1 = { type: 'bytes', value: bytes32Array }; //public key
        const obj2 = {type: 'bytes' , value: messageUint8} // message
        const obj3 = {type: 'bytes' , value: signUint8Array} // signature
        const params = [
            encode(obj1),
            encode(obj2),
            encode(obj3)
            
        ];
        
      
        // console.log("=====><===" , params)
        let tx = new SorobanClient.TransactionBuilder(account, {
            fee: '200',
            networkPassphrase: SorobanClient.Networks.FUTURENET,
        })
            .addOperation(contract.call(method, ...params))
            .setTimeout(SorobanClient.TimeoutInfinite)
            .build();
            console.log("=====>tx<======" , tx)
            const sim = await server.simulateTransaction(tx);
            console.log("🚀 ~ file: relayer.ts:47 ~ test ~ sim:", sim)
            const { results } = await server.simulateTransaction(tx);
            if (!results || results.length !== 1) {
                throw new Error('Invalid response from simulateTransaction');
            }
            const result = results[0];

               let _answer =  convert.scvalToBigNumber(
                    xdr.ScVal.fromXDR(Buffer.from(result.xdr,'base64'))
                )
            // let _ans = decode.scvalToBigNumber(
            //     xdr.ScVal.fromXDR(Buffer.from(result.xdr, 'base64'))
            //   );
            console.log("🚀 ~ file: get_vault.ts:57 ~ test ~ _ans:", _answer)
            let _prepareTx = await server.prepareTransaction(tx, SorobanClient.Networks.FUTURENET)
            _prepareTx.sign(SorobanClient.Keypair.fromSecret(secret))
            try {
                let { hash } = await server.sendTransaction(_prepareTx);
                console.log("🚀 ~ test ~ hash", hash)
    
                const sleepTime = Math.min(1000, 60000);
    
                for (let i = 0; i <= 60000; i += sleepTime) {
                    await sleep(sleepTime);
                    try {
                        //get transaction response
                        const response = await server?.getTransaction(hash);
                        console.log("==>response<====" , response);
                        switch (response.status) {
                            case 'NOT_FOUND': {
                                continue;
                            }
                            case 'SUCCESS': {
                                if (!response?.resultXdr) {
                                    throw new Error('Expected exactly one result');
                                }
    
                                
                                console.log("🚀 ~ test ~ success and the value is",_answer)
                                return _answer;
                            }
                            case 'FAILED': {
                                console.log("🚀 ~ test ~ FAILED", response)
                                throw response.resultXdr;
                            }
                            default: {
                                throw new Error(
                                    'Unexpected transaction status: ' + response.status
                                );
                            }
                        }
                    } catch (err: any) {
                        if ('code' in err && err.code === 404) {
                            console.log('🚀 ~ withdraw ~ err', err);
                        } else {
                            throw err;
                        }
                    }
                }
            } catch (error) {
                console.log("🚀 ~ test ~ error", error)
    
            }
            console.log("Hello-World")

    } catch (error) {
     console.log("======>error<=======" , error)   
    }
       

       // let method = 'hello'


}
test();
async function sleep(ms: any) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}