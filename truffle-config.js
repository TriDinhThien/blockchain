const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    sepolia: {
      provider: () => new HDWalletProvider('0x4326C76724E1df1882CFCF6f5B024886d90AB0CF', 'https://eth-mainnet.g.alchemy.com/v2/FHuTWnQgs8moKCX31IqeB'), // Thay private key (từ Bước 4) và Alchemy URL (từ Bước 2)
      network_id: 11155111,
      gas: 5500000,
      gasPrice: 20000000000, // 20 gwei
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    }
  },
  compilers: {
    solc: {
      version: "0.8.0"
    }
  }
};
