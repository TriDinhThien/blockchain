// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CosmeticsTraceability {
    struct Product {
        string name;              // Tên sản phẩm
        string batchID;           // Mã lô
        uint manufactureDate;     // Ngày sản xuất (timestamp)
        string origin;            // Nguồn gốc
        bool isAuthentic;         // Xác thực (true nếu chính hãng)
        string[] history;         // Lịch sử trạng thái (mảng string)
    }

    mapping(uint => Product) public products; // Map ID sản phẩm -> chi tiết
    uint public productCount = 0;             // Đếm sản phẩm

    event ProductCreated(uint id, string name);
    event StatusUpdated(uint id, string newStatus);

    // Hàm tạo sản phẩm (chỉ nhà sản xuất gọi)
    function createProduct(
        string memory _name,
        string memory _batchID,
        uint _manufactureDate,
        string memory _origin
    ) public {
        productCount++;
        products[productCount] = Product(
            _name,
            _batchID,
            _manufactureDate,
            _origin,
            true,
            new string[](0) // Khởi tạo mảng rỗng đúng cú pháp
        );
        products[productCount].history.push("Created by Manufacturer");
        emit ProductCreated(productCount, _name);
    }

    // Hàm cập nhật trạng thái (nhà phân phối)
    function updateStatus(uint _id, string memory _newStatus) public {
        require(_id <= productCount && _id > 0, "Invalid product ID");
        products[_id].history.push(_newStatus);
        emit StatusUpdated(_id, _newStatus);
    }

    // Hàm xác thực (người dùng quét QR)
    function verifyProduct(uint _id)
        public
        view
        returns (
            string memory name,
            string memory batchID,
            uint manufactureDate,
            string memory origin,
            bool isAuthentic,
            string[] memory history
        )
    {
        require(_id <= productCount && _id > 0, "Invalid product ID");
        Product memory p = products[_id];
        return (
            p.name,
            p.batchID,
            p.manufactureDate,
            p.origin,
            p.isAuthentic,
            p.history
        );
    }
}
