import * as SorobanClient from "soroban-client";
import { Address, Contract } from "soroban-client";
import { __values } from "tslib";

export const encode = (val: { type: any; value: any }) => {
  switch (val.type) {
    case "scvSymbol":
      return SorobanClient.xdr.ScVal.scvSymbol(val.value);
    case "scoVec":
      return SorobanClient.xdr.ScVal.scvVec([
        SorobanClient.xdr.ScVal.scvSymbol(val.value),
      ]);
   
    case "scvU32":
      return SorobanClient.xdr.ScVal.scvU32(val.value);
    case "address":
     
      return new SorobanClient.Address(val.value).toScVal();
   
    
    // case "bytesn32":
    //   return SorobanClient.xdr.ScVal.scvBytes(Buffer.from(val.value, "hex"));

    case "vecString":
      let vec_string: any = [];
      for (let i = 0; i < val.value.length; i++) {
        // let ScValu32 = SorobanClient.xdr.ScVal.scvU32(val.value[i]);
        let ScValu32 = SorobanClient.xdr.ScVal.scvString(val.value[i]);
        vec_string.push(ScValu32);
      }
      let result = SorobanClient.xdr.ScVal.scvVec(vec_string);
      return result;
    case "scvString":
      return SorobanClient.xdr.ScVal.scvString(val.value)
    case "scoU64":
      return SorobanClient.xdr.ScVal.scvU64(
        new SorobanClient.xdr.Uint64(val.value)
      );
    case "scoU128":
      console.log("aaaaaaaaa");
      
      let low = SorobanClient.xdr.Uint64.fromString(val.value.toString());
      let high = SorobanClient.xdr.Uint64.fromString("0");
      let u128 = new SorobanClient.xdr.UInt128Parts({ hi: high, lo: low});
      let scoU128 = SorobanClient.xdr.ScVal.scvU128(u128);
      return scoU128;
    case "scoI128":
      let lo = SorobanClient.xdr.Uint64.fromString(val.value.toString());
      let hi = SorobanClient.xdr.Int64.fromString("0");
      let i128 = new SorobanClient.xdr.Int128Parts({ hi: hi, lo: lo });
      let scoI128 = SorobanClient.xdr.ScVal.scvI128(i128);
      // console.log("value of i128", scoI128);
      return scoI128;

    case "vecAddress":
      let ar_addr: any = [];
      let scAd;
      let addr;
      let strAddress = "";
      for (let i = 0; i < val.value.length; i++) {
        strAddress = val.value[i].toString();
        scAd = new Address(strAddress).toScAddress();
        addr = SorobanClient.xdr.ScVal.scvAddress(scAd);
        ar_addr.push(addr);
      }
      let vecAddress = SorobanClient.xdr.ScVal.scvVec(ar_addr);
      return vecAddress;
    case "contract_address":
      let contract = new SorobanClient.Contract(val.value).address().toScVal();
      return contract;
    case "vecU32":
      let array: any = [];
      for (let i = 0; i < val.value.length; i++) {
        let ScValu32 = SorobanClient.xdr.ScVal.scvU32(val.value[i]);
        array.push(ScValu32);
      }
      let vecu32 = SorobanClient.xdr.ScVal.scvVec(array);
      return vecu32;

    case "vecBytes":
      let Bytes_array: any = [];
      for (let i = 0; i < val.value.length; i++) {
        let bytes_val = SorobanClient.xdr.ScVal.scvBytes(Buffer.from(val.value[i], "hex"));
        Bytes_array.push(bytes_val);
      }
      let vecBytes = SorobanClient.xdr.ScVal.scvVec(Bytes_array);
      return vecBytes;
   
    case "bytes":
     return SorobanClient.xdr.ScVal.scvBytes(Buffer.from(val.value, "hex"))

    case "scvBool":
      return SorobanClient.xdr.ScVal.scvBool(val.value);
    default:
      break;
  }

  return SorobanClient.xdr.ScVal.scvSymbol(val.value);
};
//npm install --global yarn