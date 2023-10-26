const claim = require('./claimmethod')
const deposit = require('./deposit')
const customtoken = require('./customtoken')
const withdraw = require('./withdraw')
const release = require('./release')
const get_balance = require('./getbalance')
const upgrade = require('./upgrademethod')
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
describe('MyTestSuite', () => {
    //  this.timeout(10000)
    const contractId = 'CB6GDPMFKKHZ2DZ33SIVCJTCLL5SAYXNSFM7URGLVME2TGW6QDIFQK7Z';
    // const pblic_key = 'GBTTNN33W77EZX4EBG6OV7A3UORCMZOGREXTHN46HXYML623RHZMAW6W';
    //SCYBSBDINLEJQY6ZSKOAMF6L7PGURHK45C5ETGRORRFWJXQIPWFN6A6C
    //SCTD6IW4WTEHXKURKIQKL2URWA3WTZFZJYX373GG2KH5CARX4P56JAYO
    const secret_key = 'SCYBSBDINLEJQY6ZSKOAMF6L7PGURHK45C5ETGRORRFWJXQIPWFN6A6C';
    const user = 'GBTTNN33W77EZX4EBG6OV7A3UORCMZOGREXTHN46HXYML623RHZMAW6W';
    let native_source_token = "CB64D3G7SM2RTH6JSGG34DDTFTQ5CFDKVDZJZSODMCX4NJ2HV2KN7OHT"
    let custom_source_token = "CDQ7OU7H77PBIK6WZIRHARD3EZCZ3I3VH4U6NPKHEFZQETZW6CYCVC2J"
    const sleepTime = Math.min(1000, 120000);

    let amount = 1000_000_000_0
    it('deposit method test case', async () => {

      //  await get_balance(native_source_token, user)
      await deposit(contractId, secret_key, native_source_token, amount)
     //   await get_balance(native_source_token, user)


    });


    it('custom method test case', async () => {
        const salt = randomBytes(32);

        let wasm_hash = "6b7e4bfbf47157a12e24e564efc1f9ac237e7ae6d7056b6c2ab47178b9e7a510"

        // await customtoken(contractId, secret_key, wasm_hash, salt)


    });
    it('claim method test case', async () => {
        const validator_public_key = "WMJN8yXuwl2vDFH+XSOavdKG1DdbBWOQe7rQzmhgPuI=";
        //   const validator_public_key = "GADQONWGKD63YVBKZV54GKVK5XOYKDVJ4J4FA2S2GFN4V53KXYTZQMMJ";

        let validator_key = convertToBytes32(validator_public_key)
        //   let validator_key = convertToBytes(validator_public_key)
        //console.log("🚀 ~ file: index.js:77 ~ it ~ validator_key:", validator_key)

        let signature = "4Ip/vTrE5frtJSk/9RjSoLBoWXZ5MRK5x9K7z+/v0ylw4fSVfeEwIkfFnGJD2Ag53JIMU+XS6JE3kb17dcZtAA=="

        const validator_signature = new Uint8Array(Buffer.from(signature, 'base64'));

        let jsonString = JSON.stringify(data)

        let string = jsonString.toString();

        const message = util.decodeUTF8(string);
        
        // console.log("Balance Before  claim method")
        // await get_balance(custom_source_token, user)
        // await claim(contractId, secret_key, validator_key, message, validator_signature, user, amount)
        // await get_balance(custom_source_token, user)
        // console.log("Balance after claim method")


    });
    it('withdraw method test case', async () => {

        //    await withdraw(contractId, secret_key, amount, user)
        //   await get_balance(native_source_token, user)

    });

    it('release method test case', async () => {

        // await release(contractId, secret_key, amount)
        // await get_balance(custom_source_token, user)

    });
    it('upgrade method test case', async () => {
        let custom_contract_wasm_hash = "a0801bbaf040dc96d1466d5c7ea9797438c3b31e786c877fcb4b7595ee882673"

        //  await  upgrade(contractId ,secret_key, custom_contract_wasm_hash)


    });

});
