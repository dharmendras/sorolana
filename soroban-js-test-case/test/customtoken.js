const SorobanClient = require('soroban-client')
const encode = require('./encode')
const convertData = require('./convertreturn')

const { use } = require('chai')

const customtoken = async (contractId, secret, wasm_hash, salt) => {
   

    const server = new SorobanClient.Server(
        `https://rpc-futurenet.stellar.org:443`
    );
    const contract = new SorobanClient.Contract(contractId);

    let keypair = SorobanClient.Keypair.fromSecret(secret)
   // console.log("🚀 ~ file: customtoken.js:16 ~ customtoken ~ keypair:", keypair)

    const account = await server.getAccount(keypair.publicKey());
   // console.log("🚀 ~ file: customtoken.js:19 ~ customtoken ~ account:", account)

    const obj1 = { type: 'bytes', value: wasm_hash };
    const obj2 = { type: 'bytes', value: salt };


    const params = [encode(obj1),
    encode(obj2)
    ]
    const method = 'createwrappedtoken';

    let tx = new SorobanClient.TransactionBuilder(account, {
        fee: '200',
        networkPassphrase: SorobanClient.Networks.FUTURENET,
    })
        .addOperation(contract.call(method, ...params))
        .setTimeout(SorobanClient.TimeoutInfinite)
        .build();
  //  console.log("🚀 ~ file: customtoken.js:37 ~ customtoken ~ tx:", tx)

    const sim = await server.simulateTransaction(tx);
   // console.log("🚀 ~ file: customtoken.js:40 ~ customtoken ~ sim:", sim)

    let _prepareTx = await server.prepareTransaction(tx, SorobanClient.Networks.FUTURENET)
    _prepareTx.sign(SorobanClient.Keypair.fromSecret(secret))

    try {
        let { hash } = await server.sendTransaction(_prepareTx);
     //   console.log("🚀 ~ file: customtoken.js:47 ~ customtoken ~ hash:", hash)
        
        const sleepTime = Math.min(1000, 60000);

        for (let i = 0; i <= 60000; i += sleepTime) {
            await sleep(sleepTime);
            try {
                //get transaction response
                const response = await server?.getTransaction(hash);
              //  console.log("🚀 ~ file: customtoken.js:56 ~ customtoken ~ response:", response)

                if (response.status == "SUCCESS") {
                    let result = JSON.parse(JSON.stringify(response.returnValue));
                    convertData(result._arm, result)
                    //    let return_vaule = returnval.scvalToBigNumber(result._arm,result);
                    //   //  console.log("return value" , return_vaule)
                    //     return return_vaule
                    break
                }

            } catch (err) {
                if ('code' in err && err.code === 404) {
                console.log("🚀 ~ file: customtoken.js:69 ~ customtoken ~ err:", err)
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
module.exports = customtoken