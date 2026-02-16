// Import thư viện web3
const Web3 = require('web3');

// Khởi tạo kết nối tới Sepolia qua Infura
const web3 = new Web3('https://sepolia.infura.io/v3/16f437e5683e4aa09e99a8d1c4b75400');

// Kiểm tra kết nối bằng cách lấy số block hiện tại
web3.eth.getBlockNumber()
  .then(blockNumber => {
    console.log("Block hiện tại:", blockNumber);
  })
  .catch(err => {
    console.error("Lỗi RPC:", err);
  });
