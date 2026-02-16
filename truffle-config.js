const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    sepolia: {
      provider: () => new HDWalletProvider(
        // Private key của ví Sepolia (không có tiền tố 0x)
        'bd65205cd1bb86a45b005173525acc7f6da9f26544eac29f65e53d1d5b19ad96',
        // Endpoint Sepolia từ Alchemy
        'https://eth-sepolia.g.alchemy.com/v2/FHuTWnQgs8moKCX31IqeB'
      ),
      network_id: 11155111,
      gas: 3000000,            // giảm gas limit xuống 3 triệu
      gasPrice: 10000000000,   // giảm gas price xuống 10 gwei
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
