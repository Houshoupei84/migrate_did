Web3 = require("web3");
web3 = new Web3("http://127.0.0.1:20646");
//var Tx = require('ethereumjs-tx');
//var Transaction = require('ethereumjs-tx').Transaction;
var Tx = require('ethereumjs-tx').Transaction;

// contract = new web3.eth.Contract([
//     {
//         "inputs": [
//             {
//                 "internalType": "string",
//                 "name": "didDocument",
//                 "type": "string"
//             }
//         ],
//         "name": "operationDID",
//         "outputs": [],
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "inputs": [],
//         "stateMutability": "nonpayable",
//         "type": "constructor"
//     },
//     {
//         "inputs": [],
//         "name": "leftGas",
//         "outputs": [
//             {
//                 "internalType": "uint256",
//                 "name": "",
//                 "type": "uint256"
//             }
//         ],
//         "stateMutability": "view",
//         "type": "function"
//     }
// ]);
contract = new web3.eth.Contract([
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "data",
                "type": "string"
            }
        ],
        "name": "publishDidTransaction",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]);

//did合约地址
contract.options.address = "0x46E5936a9bAA167b3368F4197eDce746A66f7a7a";

//账号
//acc = web3.eth.accounts.decrypt({"address":"53781e106a2e3378083bdcede1874e5c2a7225f8","crypto":{"cipher":"aes-128-ctr","ciphertext":"bc53c1fcd6e31a6392ddc1777157ae961e636c202ed60fb5dda77244c5c4b6ff","cipherparams":{"iv":"c5d1a7d86d0685aa4542d58c27ae7eb4"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"409429444dabb5664ba1314c93f0e1d7a1e994a307e7b43d3f6cc95850fbfa9f"},"mac":"4c37821c90d35118182c2d4a51356186482662bb945f0fcd33d3836749fe59c0"},"id":"39e7770e-4bc6-42f3-aa6a-c0ae7756b607","version":3}, "123");
acc = web3.eth.accounts.decrypt(account, "did contract account password");

//var myContract = MyContract.at("0x491bC043672B9286fA02FA7e0d6A3E5A0384A31A");
// contract.defaults({
//     gasLimit: "12345678"
// });
//async
//module.exports =
function sendMigrateDIDTX(payloadStr,nonce,index,payloads, callback) {
    cdata  = contract.methods.publishDidTransaction(payloadStr).encodeABI();
    console.log("#### payloadStr.length ", payloadStr.length)

    tx = {data: cdata, to: contract.options.address, from: acc.address, gasPrice:1000000000000}
    tx.nonce = nonce;

    // web3.eth.estimateGas(tx).then((gas)=> {
    //     tx.gas = gas
    //     console.log("gas", gas)
    //     console.log("sendMigrateDIDTX  signTransaction coming");
    //
    //     web3.eth.sendTransaction(tx).then(function (data ,err) {
    //         console.log("sendSignedTransaction data", data,"err", err, " nonce " ,nonce);
    //         web3.eth.getTransactionCount(acc.address).then((nextNonce) => {
    //             console.log( "lbq nonce", nonce, "nextNonce", nextNonce);
    //             index++;
    //             callback(payloads,nextNonce, index);
    //         }).catch(console.log);
    //     }).catch(console.log);
    // })
    //require('ethereumjs-tx').Transaction;
    var txBaseFee = new Tx(tx);
    var baseFee =  txBaseFee.getBaseFee().toNumber()
    console.log("####baseFee#### ", baseFee)

   // web3.eth.estimateGas(tx).then((gas)=> {
        //149195760
        var gas = baseFee;
        console.log("gas", gas, "txfee ", tx.gasPrice*gas, "baseFee", baseFee)
        if (gas < baseFee){
            gas = baseFee;
            console.log("gas < baseFee")
        }
        tx.gas = gas
        console.log("sendMigrateDIDTX  signTransaction coming");

        acc.signTransaction(tx).then((res)=>{
            stx = res;
            web3.eth.sendSignedTransaction(stx.rawTransaction).then(function (data ,err) {
               console.log("sendSignedTransaction data", data,"err", err, " nonce " ,nonce);
                web3.eth.getTransactionCount(acc.address).then((nextNonce) => {
                   console.log( "lbq nonce", nonce, "nextNonce", nextNonce);
                    index++;
                   callback(payloads,nextNonce, index);
               }).catch(console.log);
           }).catch(console.log);
        }).catch(console.log);
    //})

    // acc.signTransaction(tx).then((res)=>{
    //     console.log("sendMigrateDIDTX  signTransaction coming");
    //     stx = res;
    //     console.log(stx.rawTransaction);
    //    web3.eth.sendSignedTransaction(stx.rawTransaction).then(function (data ,err) {
    //       console.log("sendSignedTransaction data", data,"err", err, " nonce " ,nonce);
    //        web3.eth.getTransactionCount(acc.address).then((nextNonce) => {
    //           console.log( "lbq nonce", nonce, "nextNonce", nextNonce);
    //            index++;
    //           callback(payloads,nextNonce, index);
    //       }).catch(console.log);
    //   }).catch(console.log);
    // }).catch(console.log);
}

//module.exports =
function getTransactionCount(callback) {
    web3.eth.getTransactionCount(acc.address).then((nextNonce) => {
        console.log("lbq getTransactionCount", "nextNonce", nextNonce);
        callback(nextNonce)
    }).catch(console.log);

}

module.exports ={
    getTransactionCount:getTransactionCount,
    sendMigrateDIDTX:sendMigrateDIDTX
};