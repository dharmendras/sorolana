const encode = require('./encode')
const { use } = require('chai')
const stellar_sdk = require('stellar-sdk')
const hello = async (contractId, secret) => {
    //`https://rpc-futurenet.stellar.org:443`
    
     try {
        console.log("🚀 ~ file: hello.js:5 ~ hello ~ contractId:", contractId)
        //const server = new stellar_sdk.SorobanRpc.Server(`https://rpc-futurenet.stellar.org:443`)
    
        const server = new stellar_sdk.SorobanRpc.Server(
            `https://soroban-futurenet.stellar.org:443`
        );
        const contract = new stellar_sdk.Contract(contractId)
       
        let keypair = stellar_sdk.Keypair.fromSecret(secret)
    
        const account = await server.getAccount(keypair.publicKey());
    
    
        // let param1 = stellar_sdk.nativeToScVal(keypair.publicKey(), { type: 'address' })
        // let param2 = stellar_sdk.nativeToScVal(source_token, { type: 'address' })
        // let param3 = stellar_sdk.nativeToScVal(amount, { type: 'i128' })
        // let param4 = stellar_sdk.nativeToScVal('9cxGAnXieeQ4dGYFK5QAAJtdBCVnRM1pWZDHDB9PCEW3', { type: 'string' })
    
        // const params = [param4]
    
        
        // const method = 'hello';
    
        // let tx = new stellar_sdk.TransactionBuilder(account, {
        //     fee: '200',
        //     networkPassphrase: stellar_sdk.Networks.FUTURENET,
        // })
        //     .addOperation(contract.call(method, ...params))
        //     .setTimeout(stellar_sdk.TimeoutInfinite)
        //     .build();
            
        //  console.log("🚀 ~ file: deposit.js:37 ~ deposit ~ tx:", tx)
    
    
        // const sim = await server.simulateTransaction(tx);
        // console.log("🚀 ~ file: hello.js:39 ~ hello ~ sim:", sim)
    
        // let _prepareTx = await server.prepareTransaction(tx, stellar_sdk.Networks.FUTURENET)
        // _prepareTx.sign(stellar_sdk.Keypair.fromSecret(secret))
     } catch (error) {
        console.log("🚀 ~ file: hello.js:47 ~ hello ~ error:", error)
        
     }

    // try {
    //     let { hash } = await server.sendTransaction(_prepareTx);
    //     console.log("🚀 ~ file: deposit.js:62 ~ deposit ~ hash:", hash)

    //     const sleepTime = Math.min(1000, 60000);

        // for (let i = 0; i <= 60000; i += sleepTime) {
        //     await sleep(sleepTime);
        //     try {
                
        //         const response = await  server._getTransaction(hash);
        //         console.log("🚀 ~ file: hello.js:54 ~ hello ~ response:", response)

        //         if (response.status == "SUCCESS") {
                  
        //             break
        //         }

        //     } catch (err) {
        //         console.log("🚀 ~ file: hello.js:64 ~ hello ~ err:", err)
        //         if ('code' in err && err.code === 404) {
        //             console.log("🚀 ~ file: deposit.js:69 ~ deposit ~ err:", err)

        //         } else {
        //             throw err;
        //         }
        //     }

        // }
    // }
    // catch (err) {

    // }
}
async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
module.exports = hello