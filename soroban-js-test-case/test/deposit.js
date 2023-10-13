const SorobanClient = require('soroban-client')
const encode = require('./encode')
const { use } = require('chai')

const deposit = async (contractId, secret, source_token, amount) => {
   

    const server = new SorobanClient.Server(
        `https://rpc-futurenet.stellar.org:443`
    );
    const contract = new SorobanClient.Contract(contractId);

    let keypair = SorobanClient.Keypair.fromSecret(secret)
    //console.log("🚀 ~ file: deposit.js:14 ~ deposit ~ keypair:", keypair)

    const account = await server.getAccount(keypair.publicKey());
   // console.log("🚀 ~ file: deposit.js:17 ~ deposit ~ account:", account)

    const obj1 = { type: 'address', value: keypair.publicKey() };
    const obj2 = { type: 'address', value: source_token };
    const obj3 = { type: 'scoI128', value: amount };
    const obj4 = { type: 'scvString', value: "deposit" };

    const params = [encode(obj1),
    encode(obj2),
    encode(obj3),
    encode(obj4)]
    const method = 'deposit';

    let tx = new SorobanClient.TransactionBuilder(account, {
        fee: '200',
        networkPassphrase: SorobanClient.Networks.FUTURENET,
    })
        .addOperation(contract.call(method, ...params))
        .setTimeout(SorobanClient.TimeoutInfinite)
        .build();
   // console.log("🚀 ~ file: deposit.js:37 ~ deposit ~ tx:", tx)


    const sim = await server.simulateTransaction(tx);
   // console.log("🚀 ~ file: deposit.js:41 ~ deposit ~ sim:", sim)

    let _prepareTx = await server.prepareTransaction(tx, SorobanClient.Networks.FUTURENET)
    _prepareTx.sign(SorobanClient.Keypair.fromSecret(secret))

    try {
        let { hash } = await server.sendTransaction(_prepareTx);
        console.log("🚀 ~ file: deposit.js:48 ~ deposit ~ hash:", hash)
        
        const sleepTime = Math.min(1000, 60000);

        for (let i = 0; i <= 60000; i += sleepTime) {
            await sleep(sleepTime);
            try {
                //get transaction response
                const response = await server?.getTransaction(hash);
              //  console.log("🚀 ~ file: deposit.js:57 ~ deposit ~ response:", response)

                if (response.status == "SUCCESS") {
                    //    let result = JSON.parse(JSON.stringify(response.returnValue));
                    //    let return_vaule = returnval.scvalToBigNumber(result._arm,result);
                    //   //  console.log("return value" , return_vaule)
                    //     return return_vaule
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