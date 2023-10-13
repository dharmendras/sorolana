const claim = require('./claimmethod')
const deposit = require('./deposit')
const customtoken = require('./customtoken')
const withdraw = require('./withdraw')
const release = require('./release')
const get_balance = require('./getbalance')
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
    const contractId = 'CAJW2YDE7YKGDTDHV7QOGZAOLVX3JV6VLOJRW7EYXGJK3EGXNH3VJRGK';
    // const pblic_key = 'GBTTNN33W77EZX4EBG6OV7A3UORCMZOGREXTHN46HXYML623RHZMAW6W';
    const secret_key = 'SCYBSBDINLEJQY6ZSKOAMF6L7PGURHK45C5ETGRORRFWJXQIPWFN6A6C';
    const user = 'GBTTNN33W77EZX4EBG6OV7A3UORCMZOGREXTHN46HXYML623RHZMAW6W';
    let native_source_token = "CB64D3G7SM2RTH6JSGG34DDTFTQ5CFDKVDZJZSODMCX4NJ2HV2KN7OHT"
    let custom_source_token = "CCQW3P4SESVPTG4K5XPHCNKRCBGY2IT3G5WMKYSDTLNTG772WTVWZQU7"
    const sleepTime = Math.min(1000, 120000);

    let amount = 100000
    it('deposit method test case', async () => {

        await get_balance(native_source_token, user)
        await deposit(contractId, secret_key, native_source_token, amount)
        await get_balance(native_source_token, user)

        // get_balance(native_source_token , pblic_key)
    });


    it('custom method test case', async () => {
        const salt = randomBytes(32);

        let wasm_hash = "6b7e4bfbf47157a12e24e564efc1f9ac237e7ae6d7056b6c2ab47178b9e7a510"

        await customtoken(contractId, secret_key, wasm_hash, salt)


    });
    it('claim method test case', async () => {
        const validator_public_key = "IQcwIpPAKbs2zdRongIduJ7MzVTHejmp9vVI+kyj2HU=";

        let validator_key = convertToBytes32(validator_public_key)

        let signature = "a41QhVZLTi7hIJl5LYUQZ6h47Lm2RJZ/IZ1PVTNNU260Tthv3QB676EXxRCxwwvApyyXJGpIyiPHxE/T50yVCg=="

        const validator_signature = new Uint8Array(Buffer.from(signature, 'base64'));

        let jsonString = JSON.stringify(data)

        let string = jsonString.toString();

        const message = util.decodeUTF8(string);

        await get_balance(custom_source_token, user)
        await claim(contractId, secret_key, validator_key, message, validator_signature, user, amount)
        await get_balance(custom_source_token, user)

    });
    it('withdraw method test case', async () => {

        await withdraw(contractId, secret_key, amount, user)
        await get_balance(custom_source_token, user)

    });

    it('release method test case', async () => {

        await release(contractId, secret_key, user, amount)
        await get_balance(custom_source_token, user)

    });

});
