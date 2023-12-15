const claim = require('./claimmethod')
const deposit = require('./deposit')
// const customtoken = require('./customtoken')
 const withdraw = require('./withdraw')
 const release = require('./release')
// const get_balance = require('./getbalance')
// const upgrade = require('./upgrademethod')
const { data } = require('./message')
const util = require('tweetnacl-util');
const { randomBytes } = require('crypto')

const chai = require('chai');
const expect = chai.expect;
async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function base64Decode(encoded) {
    const binaryString = atob(encoded);
    const uint8Array = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
    }

    return uint8Array;
}
function convertToBytes(address) {
    const byteValues = [];
    for (let i = 0; i < address.length; i++) {
        byteValues.push(address.charCodeAt(i));
    }
    return byteValues
}
function convertToBytes32(address) {
    // Step 1: Decode the base64-encoded address into a byte array
    const decodedAddressBytes = base64Decode(address);

    // Step 2: Extract the public key portion of the address
    const publicKeyBytes = decodedAddressBytes.slice(0, 32);

    // Step 3: Pad the public key with zeros to make it a bytes32 array
    const bytes32Array = new Uint8Array(32);
    bytes32Array.set(publicKeyBytes, 32 - publicKeyBytes.length);

    return bytes32Array;
}
describe('SorobanTestSuite', () => {
    //  this.timeout(10000)
    const contractId = 'CDHOB2BQ6CGPHA63C6AAXR2EIVC4KSYW4OY2V633KTBK6BZSJOBL4O65';
    // const pblic_key = 'GBTTNN33W77EZX4EBG6OV7A3UORCMZOGREXTHN46HXYML623RHZMAW6W';
    //SCYBSBDINLEJQY6ZSKOAMF6L7PGURHK45C5ETGRORRFWJXQIPWFN6A6C
    //SCTD6IW4WTEHXKURKIQKL2URWA3WTZFZJYX373GG2KH5CARX4P56JAYO
    const secret_key = 'SCZHU5INFAL4C3WDP6Q3IIXLOGSRASZS34XQ6HJVIKWTVZQV6DFXYZCA';
    const user = 'GDW2G6QRSAD33QJKJDHPQ7G4KCEUUGPOT5BIOBN2BTL3GCOLGQHFN4AU';
    let native_source_token = "CB64D3G7SM2RTH6JSGG34DDTFTQ5CFDKVDZJZSODMCX4NJ2HV2KN7OHT"
    let custom_source_token = "CA6VPML65MACFZJUUCRZLNHKSJ5MGGG4NXCBQGXVOWMYDO5HT7H3ZB4X"
    const sleepTime = Math.min(1000, 120000);

 //  let amount = 1000_000_000_0
   let amount = 10000000;
    it('deposit method test case', async () => {

      //  await get_balance(native_source_token, user)
     // deposit(contractId, secret_key, native_source_token, amount)
     //   await get_balance(native_source_token, user)


    });


    it('custom method test case', async () => {
        const salt = randomBytes(32);

        let wasm_hash = "3d57b17eeb0022e534a0a395b4ea927ac318dc6dc4181af5759981bba79fcfbc"

        // await customtoken(contractId, secret_key, wasm_hash, salt)


    });
    it('claim method test case', async () => {
        const validator_public_key = "LKDJue9I0k7WrHD5Ei7vKnAR+7dRuYJ67IHTZI/FwTs=";
        //   const validator_public_key = "GADQONWGKD63YVBKZV54GKVK5XOYKDVJ4J4FA2S2GFN4V53KXYTZQMMJ";

        let validator_key = convertToBytes32(validator_public_key)
        //   let validator_key = convertToBytes(validator_public_key)
        //console.log("🚀 ~ file: index.js:77 ~ it ~ validator_key:", validator_key)

        let signature = "uZRkM/c0GdAh0MZOvy/vqC+KD/UQ4Irt1JTu1yGXKvPVHoT6p7UHaaf6y0tfv7OeK7+deayEOm676xIqu0FOAA=="

        const validator_signature = new Uint8Array(Buffer.from(signature, 'base64'));

        let jsonString = JSON.stringify(data)

        let string = jsonString.toString();

        const message = util.decodeUTF8(string);
        
        //  console.log("Balance Before  claim method")
        //  let before_claim =  await get_balance(custom_source_token, user)

        //  console.log("🚀 ========>User Balance Before Claim<========", before_claim)

      //    claim(contractId, secret_key, validator_key, message, validator_signature, amount)

        //  let after_claim =  await get_balance(custom_source_token, user)

        //  console.log("🚀 ========>User Balance after Claim<========", after_claim)

        //  console.log("Balance after claim method")


    });
    it('claim method test case', async () => {
        let msg = {
            "counter": 1,
            "tokenAddress": "CB5ABZGAAFXZXB7XHAQT6SRT6JXH2TLIDVVHJVBEJEGD2CQAWNFD7D2U", "tokenChain": 123, "to": "GBTTNN33W77EZX4EBG6OV7A3UORCMZOGREXTHN46HXYML623RHZMAW6W", "toChain": 456, "fee": 100, "method": "Deposit", "amount": 8
        }
        const validator_public_key = "9tplgeinj8sHOID2s/znZ8OAIu0/zBhVPUyayBnS320=";
        //   const validator_public_key = "GADQONWGKD63YVBKZV54GKVK5XOYKDVJ4J4FA2S2GFN4V53KXYTZQMMJ";

        let validator_key = convertToBytes32(validator_public_key)
        //   let validator_key = convertToBytes(validator_public_key)
        //console.log("🚀 ~ file: index.js:77 ~ it ~ validator_key:", validator_key)

        let signature = "bHSVR57XtwoZH1Bv9gm6uBzticQrdSFVTKFhrJIg/tYeDexOi2qXyU+Ter+6GA/b6dVFTu3YyGSXfZ9o+YVdBw=="

        const validator_signature = new Uint8Array(Buffer.from(signature, 'base64'));

        let jsonString = JSON.stringify(msg)

        let string = jsonString.toString();

        const message = util.decodeUTF8(string);
        
        //  console.log("Balance Before  claim method")
        //  let before_claim =  await get_balance(custom_source_token, user)

        //  console.log("🚀 ========>User Balance Before Claim<========", before_claim)

       //   await claim(contractId, secret_key, validator_key, message, validator_signature, user, amount)

        //  let after_claim =  await get_balance(custom_source_token, user)

        //  console.log("🚀 ========>User Balance after Claim<========", after_claim)

        //  console.log("Balance after claim method")


    });
    it('withdraw method test case', async () => {
        // let before_withdraw=  await get_balance(custom_source_token, user)

        // console.log("🚀 ========>User Balance Before Burn<========", before_withdraw)

        //   withdraw(contractId, secret_key, amount, user)

        //   let after_withdraw=  await get_balance(custom_source_token, user)
        //   console.log("🚀 ========>User Balance After Burn<========", after_withdraw)


    });

    it('release method test case', async () => {

          release(contractId, secret_key, amount)
        // await get_balance(custom_source_token, user)

    });
    it('upgrade method test case', async () => {
        let custom_contract_wasm_hash = "a0801bbaf040dc96d1466d5c7ea9797438c3b31e786c877fcb4b7595ee882673"

        //  await  upgrade(contractId ,secret_key, custom_contract_wasm_hash)


    });

});
