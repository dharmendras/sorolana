const SorobanClient = require('soroban-client')
const { Address, Contract } = require('soroban-client')
const encode = (data) => {
    switch (data.type) {
        case "address":
            return new SorobanClient.Address(data.value).toScVal();

        case "scoI128":
            let lo = SorobanClient.xdr.Uint64.fromString(data.value.toString());
            let hi = SorobanClient.xdr.Int64.fromString("0");
            let i128 = new SorobanClient.xdr.Int128Parts({ hi: hi, lo: lo });
            let scoI128 = SorobanClient.xdr.ScVal.scvI128(i128);
            // console.log("value of i128", scoI128);
            return scoI128;

            case "bytes":
                console.log("data" , data.type)
           return SorobanClient.xdr.ScVal.scvBytes(Buffer.from(data.value, "hex"))

        case "scvString":
            return SorobanClient.xdr.ScVal.scvString(data.value)
            default:
                break;

    }
    return SorobanClient.xdr.ScVal.scvSymbol(data.value);

}
module.exports = encode