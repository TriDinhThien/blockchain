module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545, // Port của Ganache
      network_id: "*" // Any network
    }
  },
  compilers: {
    solc: {
      version: "0.8.0" // Phiên bản Solidity
    }
  }
};