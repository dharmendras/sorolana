//@ts-ignore
import BigNumber from 'bignumber.js';
import * as SorobanClient from 'soroban-client';
import { buffer } from 'stream/consumers';
let xdr = SorobanClient.xdr;


const StellarSdk = require('stellar-sdk');

// BigNumber
export function scvalToBigNumber(scval: SorobanClient.xdr.ScVal | undefined): any {
  switch (scval?.switch()) {
    case undefined: {
      return BigNumber(0);
    }
    case xdr.ScValType.scvU32(): {
      
      return BigNumber(scval.u32());
    }
    case xdr.ScValType.scvI32(): {

      return BigNumber(scval.i32());
    }
    case xdr.ScValType.scvU64(): {

      const { high, low } = scval.u64();
      return bigNumberFromBytes(false, high, low);
    }
    case xdr.ScValType.scvI64(): {
      const { high, low } = scval.i64();
      return bigNumberFromBytes(true, high, low);
    }
    case xdr.ScValType.scvU128(): {
      const parts = scval.u128();
      const a = parts.hi().toString();
      const b = parts.lo().toString();
      const result = new BigNumber(a).times('18446744073709551616').plus(b);
      return result;
    }
    case xdr.ScValType.scvI128(): {
      const parts = scval.i128();
      const a = parts.hi().toString();
      const b = parts.lo().toString();
      const result = new BigNumber(a).times('18446744073709551616').plus(b);
      return result;
    }
    case xdr.ScValType.scvBytes(): {
      let _base64 = scval.bytes().toString('hex');
      const buffer = Buffer.from(_base64, 'hex');
      const base64String = buffer.toString('base64');
      return base64String;
    }
    
    case xdr.ScValType.scvAddress(): {
      let Buffer = JSON.stringify(scval.address().value());
      let value = JSON.parse(Buffer);
      const accountIDBytes = new Uint8Array(value._value.data);
      const publicKey = StellarSdk.StrKey.encodeEd25519PublicKey(accountIDBytes);
      const address = publicKey.toString();    
      return address; 
    }

    case xdr.ScValType.scvMap(): {
   
      let json = JSON.stringify(scval);

     
     

      let object: any = {};

      let parsedJson = JSON.parse(json);


      for (let i = 0; i < parsedJson._value.length; i++) {

        const key = Buffer.from(parsedJson._value[i]._attributes.key._value.data).toString('utf8');
        
        const val = parsedJson._value[i]._attributes.val;
        let bytes = JSON.stringify(val);
        let obj = JSON.parse(bytes);
        

        switch (val._arm) {
          case "i128":
            
            let object_value = obj._value;
            // const initialObject_lo = obj._value._attributes.lo;
            // const loHex = new BigNumber(initialObject_lo.low >= 0 ? initialObject_lo.low.toString() : (initialObject_lo.low + 2 ** 32).toString());
            // const hiHex = new BigNumber(initialObject_lo.high.toString());
            // const bigNumber = hiHex.times(2 ** 32).plus(loHex).toNumber();
            const hi = new BigNumber(object_value._attributes.hi._value);
            const lo = new BigNumber(object_value._attributes.lo._value);
            const result = new BigNumber(hi).times('18446744073709551616').plus(lo);
            object[key] = result.toNumber()

            break;
          case "u128":
            let obj2 = obj._value;
            // const lo = obj2._attributes.lo.low + (obj2._attributes.lo.high * 2 ** 32); 
            // const hi = obj2._attributes.hi.low + (obj2._attributes.hi.high * 2 ** 32); 
            // const u128 = new BigNumber(lo + hi * 2 ** 64).toNumber();
            const hi2 = new BigNumber(obj2._attributes.hi._value);
            const lo2 = new BigNumber(obj2._attributes.lo._value);
            const result2 = new BigNumber(hi2).times('18446744073709551616').plus(lo2);
            object[key] = result2.toNumber();
            break;
          case "bytes":
            object[key] = obj._value.data;

            break;
          case "u64":
            
            let u64 = parseInt(obj._value._value);
            object[key] = u64;
            break;
          case "address":
            
             let arms = obj["_value"]["_arm"];
                        
             if (arms == "accountId"){
               let data = obj["_value"]["_value"]["_value"]["data"];
              const accountIDBytes = new Uint8Array(data);
              const publicKey = StellarSdk.StrKey.encodeEd25519PublicKey(accountIDBytes);
              const address = publicKey.toString();
              object[key] = address;
             }
             else if(arms == "contractId"){
              let array = obj["_value"]["_value"]["data"];
              const hexString = array.map((i:any) => i.toString(16).padStart(2, '0')).join('');
              object[key] = hexString;
             }
            
            break;
            
          case "vec":
            // console.log("vec",obj._value);
          
           let arm = obj._value[0]? obj._value[0]._arm : "undefined";
           
            if (arm === "address") {
              const dataArray = obj._value;               
              let addresslist = [];
              for (let i = 0; i < dataArray.length; i++) {
                let value = obj._value[i]._value._value?._value.data;
                let accountIDBytes2 = new Uint8Array(value);
                let publicKey2 = StellarSdk.StrKey.encodeEd25519PublicKey(accountIDBytes2);
                let address2 = publicKey2.toString();
                addresslist.push(address2)
              }
              object[key] = addresslist;
              break
            } 
            else if (arm === "sym"){
              let array: any = []
              let vec = obj._value[0]._value.data;

              let string = String.fromCharCode(...vec);
              object[key] = string;

              break
            }
            else if (arm === "u64"){
              
              const dataArray = obj._value; 
              let datelist = [];

              for (let i = 0; i < dataArray.length; i++) {
                let value = obj._value[i]._value._value;
                let u64 = parseInt(value);
                datelist.push(u64);
              }
              object[key] = datelist;
              

              break
            }
            else{
              object[key] = [];
              break
            }
            break 
          default:
            const u32Val = val._value;

            object[key] = u32Val;

            break;
        }
      }

      return object
    }
   
    default: {

      return bigNumberFromBytes(true);
    }
  };
}

function bigNumberFromBytes(signed: boolean, ...bytes: (string | number | bigint)[]): BigNumber {
  let sign = 1;
  if (signed && bytes[0] === 0x80) {
    // top bit is set, negative number.
    sign = -1;
    bytes[0] &= 0x7f;
  }
  let b = BigInt(0);
  for (let byte of bytes) {
    b <<= BigInt(8);
    b |= BigInt(byte);
  }
  return BigNumber(b.toString()).multipliedBy(sign);
}

function bigintToBuf(bn: bigint): Buffer {
  var hex = BigInt(bn).toString(16).replace(/^-/, '');
  if (hex.length % 2) { hex = '0' + hex; }

  var len = hex.length / 2;
  var u8 = new Uint8Array(len);

  var i = 0;
  var j = 0;
  while (i < len) {
    u8[i] = parseInt(hex.slice(j, j + 2), 16);
    i += 1;
    j += 2;
  }

  if (bn < BigInt(0)) {
    // Set the top bit
    u8[0] |= 0x80;
  }

  return Buffer.from(u8);
}

export function xdrUint64ToNumber(value: SorobanClient.xdr.Uint64): number {
  let b = 0;
  b |= value.high;
  b <<= 8;
  b |= value.low;
  return b;
}

export function scvalToString(value: SorobanClient.xdr.ScVal): string | undefined {
  return value.bytes().toString();
}