// const SorobanClient = require('soroban-client')
const stellar_sdk = require('stellar-sdk')

const encode = require('./encode')
const { use } = require('chai')

const withdraw = async (contractId, secret, amount, user) => {
   console.log("🚀 ~ file: withdraw.js:8 ~ withdraw ~ contractId:", contractId)
   

    const server = new stellar_sdk.SorobanRpc.Server(
        `https://rpc-futurenet.stellar.org:443`
    );
    const contract = new stellar_sdk.Contract(contractId);
  //  console.log("🚀 ~ file: withdraw.js:12 ~ withdraw ~ contract:", contract)
    
    let keypair = stellar_sdk.Keypair.fromSecret(secret)
 //   console.log("🚀 ~ file: withdraw.js:15 ~ withdraw ~ keypair:", keypair)

    const account = await server.getAccount(keypair.publicKey());
   // console.log("🚀 ~ file: withdraw.js:18 ~ withdraw ~ account:", account)

    const obj1 = { type: 'scoI128', value: amount };
    const obj2 = { type: 'address', value: keypair.publicKey() };
    const obj3 = { type: 'scvString', value: "receiver"};

    const params = [encode(obj1),
    encode(obj2),encode(obj3),
    ]
    const method = 'withdraw';

    let tx = new stellar_sdk.TransactionBuilder(account, {
        fee: '200',
        networkPassphrase: stellar_sdk.Networks.FUTURENET,
    })
        .addOperation(contract.call(method, ...params))
        .setTimeout(stellar_sdk.TimeoutInfinite)
        .build();
   // console.log("🚀 ~ file: withdraw.js:35 ~ withdraw ~ tx:", tx)

    const sim = await server.simulateTransaction(tx);
  //  console.log("🚀 ~ file: withdraw.js:38 ~ withdraw ~ sim:", sim)

    let _prepareTx = await server.prepareTransaction(tx, stellar_sdk.Networks.FUTURENET)
    _prepareTx.sign(stellar_sdk.Keypair.fromSecret(secret))

    try {
        let { hash } = await server.sendTransaction(_prepareTx);
    //    console.log("🚀 ~ file: withdraw.js:45 ~ withdraw ~ hash:", hash)
        
        const sleepTime = Math.min(1000, 60000);
        for (let i = 0; i <= 60000; i += sleepTime) {
            await sleep(sleepTime);
            try {
                //get transaction response
                const response = await server?.getTransaction(hash);
                //console.log("🚀 ~ file: withdraw.js:53 ~ withdraw ~ response:", response)

                if (response.status == "SUCCESS") {
                    //    let result = JSON.parse(JSON.stringify(response.returnValue));
                    //    let return_vaule = returnval.scvalToBigNumber(result._arm,result);
                    //   //  console.log("return value" , return_vaule)
                    //     return return_vaule
                    break
                }

            } catch (err) {
                if ('code' in err && err.code === 404) {
             //   console.log("🚀 ~ file: withdraw.js:65 ~ withdraw ~ err:", err)

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
module.exports = withdraw