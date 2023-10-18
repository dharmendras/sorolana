const SorobanClient = require('soroban-client')
const encode = require('./encode')
const { use } = require('chai')

const   upgrade = async (contractId ,secret_key, custom_contract_wasm_hash) => {
   

    const server = new SorobanClient.Server(
        `https://rpc-futurenet.stellar.org:443`
    );
    const contract = new SorobanClient.Contract(contractId);

    let keypair = SorobanClient.Keypair.fromSecret(secret_key)
    //console.log("🚀 ~ file: deposit.js:14 ~ deposit ~ keypair:", keypair)

    const account = await server.getAccount(keypair.publicKey());
   // console.log("🚀 ~ file: deposit.js:17 ~ deposit ~ account:", account)
   const obj1 = { type: 'bytes', value: custom_contract_wasm_hash };
    // const obj1 = { type: 'address', value: keypair.publicKey() };
    // const obj2 = { type: 'address', value: source_token };
    // const obj3 = { type: 'scoI128', value: amount };
    // const obj4 = { type: 'scvString', value: "deposit" };

    const params = [encode(obj1),
    ]

    // let param1 = SorobanClient.nativeToScVal(keypair.publicKey() , {type: 'address'})
    // let param2 = SorobanClient.nativeToScVal(source_token , {type: 'address'})
    // let param3 = SorobanClient.nativeToScVal(amount , {type: 'i128'})
    // let param4 = SorobanClient.nativeToScVal('9cxGAnXieeQ4dGYFK5QAAJtdBCVnRM1pWZDHDB9PCEW3' , {type: 'string'})

   // const params = [param1 , param2 , param3 , param4]

    // console.log("🚀 ~ file: deposit.js:28 ~ deposit ~ encode(obj1):", encode(obj1))
    // console.log("🚀 ~ file: deposit.js:28 ~ deposit ~ encode(obj2):", encode(obj2))
    // console.log("🚀 ~ file: deposit.js:28 ~ deposit ~ encode(obj3):", encode(obj3))
    // console.log("🚀 ~ file: deposit.js:28 ~ deposit ~ encode(obj4):", encode(obj4))

    const method = 'upgrade';

    let tx = new SorobanClient.TransactionBuilder(account, {
        fee: '200',
        networkPassphrase: SorobanClient.Networks.FUTURENET,
    })
        .addOperation(contract.call(method, ...params))
        .setTimeout(SorobanClient.TimeoutInfinite)
        .build();
    console.log("🚀 ~ file: upgrademethod.js:48 ~ upgrade ~ tx:", tx)
  


    const sim = await server.simulateTransaction(tx);
    console.log("🚀 ~ file: upgrademethod.js:53 ~ upgrade ~ sim:", sim)

    let _prepareTx = await server.prepareTransaction(tx, SorobanClient.Networks.FUTURENET)
    _prepareTx.sign(SorobanClient.Keypair.fromSecret(secret_key))

    try {
        let { hash } = await server.sendTransaction(_prepareTx);
        console.log("🚀 ~ file: upgrademethod.js:60 ~ upgrade ~ hash:", hash)
        
        const sleepTime = Math.min(1000, 60000);

        for (let i = 0; i <= 60000; i += sleepTime) {
            await sleep(sleepTime);
            try {
                //get transaction response
                const response = await server?.getTransaction(hash);
                console.log("🚀 ~ file: upgrademethod.js:69 ~ upgrade ~ response:", response)

                if (response.status == "SUCCESS") {
                    //    let result = JSON.parse(JSON.stringify(response.returnValue));
                    //    let return_vaule = returnval.scvalToBigNumber(result._arm,result);
                    //   //  console.log("return value" , return_vaule)
                    //     return return_vaule
                    break
                }

            } catch (err) {
                if ('code' in err && err.code === 404) {
                console.log("🚀 ~ file: upgrademethod.js:81 ~ upgrade ~ err:", err)

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
module.exports = upgrade