const Web3 = require('web3');
const web3 = new Web3('https://sepolia.infura.io/v3/16f437e5683e4aa09e99a8d1c4b75400');

web3.eth.getBlockNumber().then(console.log).catch(console.error);