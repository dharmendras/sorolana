const SorobanClient = require('soroban-client')
const encode = require('./encode')
const { use } = require('chai')

const claim = async (contractId, secret_key, public_key, messageUint8, signUint8Array, amount) => {
    

    const server = new SorobanClient.Server(
        `https://rpc-futurenet.stellar.org:443`
    );
    const contract = new SorobanClient.Contract(contractId);
  
     let keypair = SorobanClient.Keypair.fromSecret(secret_key)
   //  console.log("🚀 ~ file: claimmethod.js:14 ~ claim ~ keypair:", keypair)
  // const account = await server.getAccount(keypair.publicKey());

    const account = await server.getAccount(keypair.publicKey());
  //  console.log("🚀 ~ file: claimmethod.js:17 ~ claim ~ account:", account)

    const obj1 = { type: 'bytes', value: public_key };
    const obj2 = { type: 'bytes', value: messageUint8 };
    const obj3 = { type: 'bytes', value: signUint8Array }
    const obj4 = { type: 'address', value: keypair.publicKey() }
    const obj5 = { type: 'scoI128', value: amount };

    const params = [encode(obj1), encode(obj2), encode(obj3), encode(obj4), encode(obj5)]

    const method = 'claim';

    let tx = new SorobanClient.TransactionBuilder(account, {
        fee: '200',
        networkPassphrase: SorobanClient.Networks.FUTURENET,
    })
        .addOperation(contract.call(method, ...params))
        .setTimeout(SorobanClient.TimeoutInfinite)
        .build();
  //  console.log("🚀 ~ file: claimmethod.js:36 ~ claim ~ tx:", tx)

    const sim = await server.simulateTransaction(tx);
//    console.log("🚀 ~ file: claimmethod.js:39 ~ claim ~ sim:", sim)

    let _prepareTx = await server.prepareTransaction(tx, SorobanClient.Networks.FUTURENET)
    _prepareTx.sign(SorobanClient.Keypair.fromSecret(secret_key))

    try {
        let { hash } = await server.sendTransaction(_prepareTx);
       console.log("🚀 ~ file: claimmethod.js:46 ~ claim ~ hash:", hash)

        const sleepTime = Math.min(1000, 60000);
        for (let i = 0; i <= 60000; i += sleepTime) {
            await sleep(sleepTime);
            try {
                //get transaction response
                const response = await server?.getTransaction(hash);
                console.log("🚀 ~ file: claimmethod.js:54 ~ claim ~ response:", response)

                if (response.status == "SUCCESS") {
                    //    let result = JSON.parse(JSON.stringify(response.returnValue));
                    //    let return_vaule = returnval.scvalToBigNumber(result._arm,result);
                    //   //  console.log("return value" , return_vaule)
                    //     return return_vaule
                    break
                }

            } catch (err) {

                if ('code' in err && err.code === 404) {
                console.log("🚀 ~ file: claimmethod.js:66 ~ claim ~ err:", err)

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
module.exports = claim