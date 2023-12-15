const stellar_sdk = require('stellar-sdk')

const { Address, Contract } = require('soroban-client')
const encode = (data) => {
    // console.log("🚀 ~ file: encode.js:6 ~ encode ~ data:", data)
    
    switch (data.type) {
        case "address":
            return new  stellar_sdk.Address(data.value).toScVal();

        case "scoI128":
            let lo =  stellar_sdk.xdr.Uint64.fromString(data.value.toString());
            let hi = stellar_sdk.xdr.Int64.fromString("0");
            let i128 = new  stellar_sdk.xdr.Int128Parts({ hi: hi, lo: lo });
            let scoI128 =  stellar_sdk.xdr.ScVal.scvI128(i128);
            // console.log("value of i128", scoI128);
            return scoI128;

        case "bytes":
          //  console.log("data", data.type)
            return stellar_sdk.xdr.ScVal.scvBytes(Buffer.from(data.value, "hex"))

        case "scvString":
            return stellar_sdk.xdr.ScVal.scvString(data.value)
        default:
            break;

    }
    return  stellar_sdk.xdr.ScVal.scvSymbol(data.value);

}
module.exports = encode