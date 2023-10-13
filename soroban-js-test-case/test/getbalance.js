const SorobanClient = require('soroban-client')
const encode = require('./encode')
const { use } = require('chai')
const get_balance = async (contractId, holder) => {
    const server = new SorobanClient.Server(
        `https://rpc-futurenet.stellar.org:443`
    )

    const contract = new SorobanClient.Contract(contractId);


    const obj1 = { type: 'address', value: holder };

    const params = [encode(obj1)]

    const method = 'balance';

    const account = await server.getAccount(holder);

    let tx = new SorobanClient.TransactionBuilder(account, {
        fee: '200',
        networkPassphrase: SorobanClient.Networks.FUTURENET,
    })
        .addOperation(contract.call(method, ...params))
        .setTimeout(SorobanClient.TimeoutInfinite)
        .build();
   // console.log("🚀 ~ file: getbalance.js:27 ~ constget_balance= ~ tx:", tx)

    const sim = await server.simulateTransaction(tx);
    console.log("🚀 ~ file: getbalance.js:30 ~ constget_balance= ~ sim:", sim.result.retval._value._attributes.lo._value)


}
module.exports = get_balance