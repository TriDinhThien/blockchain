require('dotenv').config();  // Load biến môi trường từ .env (cho PRIVATE_KEY)
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",   // địa chỉ Ganache
      port: 7545,          // cổng mặc định Ganache GUI
      network_id: "*"      // chấp nhận mọi network id
    },
    sepolia: {
      provider: () => new HDWalletProvider(
        process.env.PRIVATE_KEY,  // Private key từ .env
        'https://eth-sepolia.g.alchemy.com/v2/cPo6gulMMQceRabUjyN01'  // RPC Alchemy (thay key đầy đủ nếu cần)
      ),
      network_id: 11155111,  // Chain ID của Sepolia
      gas: 5500000,          // Gas limit mặc định (có thể điều chỉnh nếu tx phức tạp)
      gasPrice: 10000000000, // 10 Gwei (có thể thay đổi dựa trên mạng)
      confirmations: 2,      // Số block confirm trước khi tiếp tục
      timeoutBlocks: 200,    // Timeout nếu tx chậm
      skipDryRun: true       // Bỏ dry run cho public network
    }
  },
  compilers: {
    solc: {
      version: "0.8.0"     // phiên bản Solidity bạn muốn dùng
    }
  }
};
