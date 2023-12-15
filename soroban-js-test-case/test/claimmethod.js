const encode = require('./encode')
const { use } = require('chai')
const stellar_sdk = require('stellar-sdk')

const claim = async (contractId, secret, public_key, messageUint8, signUint8Array, amount) => {
    
 
    const server = new stellar_sdk.SorobanRpc.Server(
        `https://rpc-futurenet.stellar.org:443`
    );
    const contract = new stellar_sdk.Contract(contractId);
  
     let keypair = stellar_sdk.Keypair.fromSecret(secret)

    const account = await server.getAccount(keypair.publicKey());
    console.log("🚀 ~ file: claimmethod.js:18 ~ claim ~ account:", account)
  
    const obj1 = { type: 'bytes', value: public_key };
    const obj2 = { type: 'bytes', value: messageUint8 };
    const obj3 = { type: 'bytes', value: signUint8Array }
    const obj4 = { type: 'address', value: keypair.publicKey() }
    const obj5 = { type: 'scoI128', value: amount };

    const params = [encode(obj1), encode(obj2), encode(obj3), encode(obj4), encode(obj5)]
   // console.log("🚀 ~ file: claimmethod.js:34 ~ claim ~ params:", params)

    const method = 'claim';
   
    let tx = new stellar_sdk.TransactionBuilder(account, {
        fee: '200',
        networkPassphrase: stellar_sdk.Networks.FUTURENET,
    })
        .addOperation(contract.call(method, ...params))
        .setTimeout(stellar_sdk.TimeoutInfinite)
        .build();
    console.log("🚀 ~ file: claimmethod.js:45 ~ claim ~ tx:", tx)

    const sim = await server.simulateTransaction(tx);
    console.log("🚀 ~ file: claimmethod.js:49 ~ claim ~ sim:", sim)

    let _prepareTx = await server.prepareTransaction(tx, stellar_sdk.Networks.FUTURENET)
    _prepareTx.sign(stellar_sdk.Keypair.fromSecret(secret))

    try {
        let { hash } = await server.sendTransaction(_prepareTx);
       console.log("🚀 ~ file: claimmethod.js:46 ~ claim ~ hash:", hash)

        const sleepTime = Math.min(1000, 60000);
        for (let i = 0; i <= 60000; i += sleepTime) {
            await sleep(sleepTime);
            try {
                //get transaction response
                const response = await  server._getTransaction(hash);
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
    console.log("🚀 ~ file: claimmethod.js:86 ~ claim ~ err:", err)

    }
}
async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
module.exports = claim