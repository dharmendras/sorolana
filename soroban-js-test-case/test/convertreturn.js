// const SorobanClient = require('soroban-client')
// let xdr = SorobanClient.xdr;
const stellar_sdk = require('stellar-sdk')

const convertData = (arm, data) => {
  // console.log("🚀 ~ file: convertreturn.js:6 ~ convertData ~ arm:", arm)
  // console.log("🚀 ~ file: convertreturn.js:6 ~ convertData ~ data:", data)

  switch (arm) {
    case "address":
      //  let object1: any = {};

      console.log("address");
      let arms = data._value._arm;
    //  console.log("result1", arms);
      if (arms == "contractId") {
      //  console.log("inside if in convert ")
        let array = data["_value"]["_value"]["data"];
     //   console.log("address", array)
        //   let array = obj["val"]["_value"]["_value"]["data"];
        const hexString = array.map((i) => i.toString(16).padStart(2, '0')).join('');
    //    console.log("hexString", hexString)
        return hexString
      }
  }

}
module.exports = convertData
