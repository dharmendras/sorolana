const claim = require('./claimmethod')
const deposit = require('./deposit')
const customtoken = require('./customtoken')
const withdraw = require('./withdraw')
const release = require('./release')
const { data } = require('./message')
const util = require('tweetnacl-util');
const { randomBytes } = require('crypto')

const chai = require('chai');
const expect = chai.expect;
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
    const contractId = 'CAJW2YDE7YKGDTDHV7QOGZAOLVX3JV6VLOJRW7EYXGJK3EGXNH3VJRGK';
    const pk = 'GBTTNN33W77EZX4EBG6OV7A3UORCMZOGREXTHN46HXYML623RHZMAW6W';
    const secret = 'SCYBSBDINLEJQY6ZSKOAMF6L7PGURHK45C5ETGRORRFWJXQIPWFN6A6C';
    const user = 'GBTTNN33W77EZX4EBG6OV7A3UORCMZOGREXTHN46HXYML623RHZMAW6W';
    let amount = 10000000
    it('deposit method test case', () => {
        let source_token = "CB64D3G7SM2RTH6JSGG34DDTFTQ5CFDKVDZJZSODMCX4NJ2HV2KN7OHT"

        // deposit(contractId , secret , source_token , amount)


    });
    it('custom method test case', () => {
        const salt = randomBytes(32);

        let wasm_hash = "6b7e4bfbf47157a12e24e564efc1f9ac237e7ae6d7056b6c2ab47178b9e7a510"
        console.log("🚀 ~ file: index.js:244 ~ it ~ wasm_hash:", wasm_hash)
        //  customtoken(contractId, secret, wasm_hash, salt)
        // claim(contractId  , secret , public_key , messageUint8 ,signUint8Array , user , amount)

    });
    it('claim method test case', () => {
        const address = "IQcwIpPAKbs2zdRongIduJ7MzVTHejmp9vVI+kyj2HU=";
        let public_key = convertToBytes32(address)
        let signString = "a41QhVZLTi7hIJl5LYUQZ6h47Lm2RJZ/IZ1PVTNNU260Tthv3QB676EXxRCxwwvApyyXJGpIyiPHxE/T50yVCg=="

        const signUint8Array = new Uint8Array(Buffer.from(signString, 'base64'));
        let jsonString = JSON.stringify(data)
        let string = jsonString.toString();
        const messageUint8 = util.decodeUTF8(string);

        //  claim(contractId  , secret , public_key , messageUint8 ,signUint8Array , user , amount)

    });
    it('withdraw method test case', () => {
        //withdraw(contractId  , secret,amount , user)
        // claim(contractId  , secret , public_key , messageUint8 ,signUint8Array , user , amount)

    });
    it('withdraw method test case', () => {
        // withdraw(contractId  , secret,amount , user)
        // claim(contractId  , secret , public_key , messageUint8 ,signUint8Array , user , amount)

    });
    it('release method test case', () => {
        release(contractId, secret, user, user)
        // claim(contractId  , secret , public_key , messageUint8 ,signUint8Array , user , amount)

    });

});
