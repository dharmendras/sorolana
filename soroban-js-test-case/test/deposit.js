const encode = require('./encode')
const { use } = require('chai')
const stellar_sdk = require('stellar-sdk')
const deposit = async (contractId, secret, source_token, amount) => {
    //const server = new stellar_sdk.SorobanRpc.Server(`https://rpc-futurenet.stellar.org:443`)

    const server = new stellar_sdk.SorobanRpc.Server(
        `https://rpc-futurenet.stellar.org:443`
    );
    const contract = new stellar_sdk.Contract(contractId)
   
    let keypair = stellar_sdk.Keypair.fromSecret(secret)

    const account = await server.getAccount(keypair.publicKey());


    let param1 = stellar_sdk.nativeToScVal(keypair.publicKey(), { type: 'address' })
    let param2 = stellar_sdk.nativeToScVal(source_token, { type: 'address' })
    let param3 = stellar_sdk.nativeToScVal(amount, { type: 'i128' })
    let param4 = stellar_sdk.nativeToScVal('9cxGAnXieeQ4dGYFK5QAAJtdBCVnRM1pWZDHDB9PCEW3', { type: 'string' })

    const params = [param1, param2, param3, param4]

    
    const method = 'deposit';

    let tx = new stellar_sdk.TransactionBuilder(account, {
        fee: '200',
        networkPassphrase: stellar_sdk.Networks.FUTURENET,
    })
        .addOperation(contract.call(method, ...params))
        .setTimeout(stellar_sdk.TimeoutInfinite)
        .build();
    // console.log("🚀 ~ file: deposit.js:37 ~ deposit ~ tx:", tx)


    const sim = await server.simulateTransaction(tx);

    let _prepareTx = await server.prepareTransaction(tx, stellar_sdk.Networks.FUTURENET)
    _prepareTx.sign(stellar_sdk.Keypair.fromSecret(secret))

    try {
        let { hash } = await server.sendTransaction(_prepareTx);
        console.log("🚀 ~ file: deposit.js:62 ~ deposit ~ hash:", hash)

        const sleepTime = Math.min(1000, 60000);

        for (let i = 0; i <= 60000; i += sleepTime) {
            await sleep(sleepTime);
            try {
                
                const response = await  server._getTransaction(hash);

                if (response.status == "SUCCESS") {
                  
                    break
                }

            } catch (err) {
                if ('code' in err && err.code === 404) {
                    console.log("🚀 ~ file: deposit.js:69 ~ deposit ~ err:", err)

                } else {
                    throw err;
                }
            }

        }
    }
    catch (err) {

    }
}
async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
module.exports = deposit