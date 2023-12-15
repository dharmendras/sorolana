const stellar_sdk = require('stellar-sdk')

const encode = require('./encode')
const { use } = require('chai')
function convertBigIntToString(obj) {
    for (const key in obj) {
      if (obj[key] instanceof Object) {
        obj[key] = convertBigIntToString(obj[key]);  // Recursive call for nested objects
      } else if (typeof obj[key] === 'bigint') {
        obj[key] = obj[key].toString();  // Convert BigInt to string
      }
    }
    return obj;
  }
const get_balance = async (contractId, holder) => {
    const server = new stellar_sdk.SorobanRpc.Server(
        `https://rpc-futurenet.stellar.org:443`
    )

    const contract = new  stellar_sdk.Contract(contractId);


    const obj1 = { type: 'address', value: holder };

    const params = [encode(obj1)]

    const method = 'balance';

    const account = await server.getAccount(holder);

    let tx = new stellar_sdk.TransactionBuilder(account, {
        fee: '200',
        networkPassphrase: stellar_sdk.Networks.FUTURENET,
    })
        .addOperation(contract.call(method, ...params))
        .setTimeout(stellar_sdk.TimeoutInfinite)
        .build();
   // console.log("🚀 ~ file: getbalance.js:27 ~ constget_balance= ~ tx:", tx)

    const sim = await server.simulateTransaction(tx);
   // console.log("🚀 ~ file: getbalance.js:30 ~ constget_balance= ~ sim:", sim.result.retval._value._attributes.lo._value)
    const bigIntValue = BigInt(sim.result.retval._value._attributes.lo._value);

    const amount  = Number(bigIntValue);
 //   console.log("🚀 ~ file: getbalance.js:44 ~ constget_balance= ~ amount:", amount)
   return amount.toString()

}
module.exports = get_balance