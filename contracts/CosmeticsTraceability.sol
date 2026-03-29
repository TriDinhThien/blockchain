// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CosmeticsTraceability {
    
    struct Product {
        string name;
        string batchID;
        string manufactureDate; 
        string origin;
        bool isAuthentic;
        string[] history;
        address owner;
        string[] ingredients;           // Thành phần sản phẩm
        string productImageUrl;
        string certificationUrl;
        string manufacturerName;
        string factoryAddress;
        address[] previousOwners;
        // Không để mapping bên trong struct
    }

    mapping(uint => Product) public products;
    
    // Mapping riêng để lưu snapshot lịch sử
    mapping(uint => mapping(address => uint)) public historySnapshots;

    uint public productCount = 0;

    event ProductCreated(uint id, string name);
    event StatusUpdated(uint id, string newStatus);
    event OwnershipTransferred(uint id, address indexed oldOwner, address indexed newOwner);

    function createProduct(
        string memory _name,
        string memory _batchID,
        string memory _manufactureDate,
        string memory _origin,
        string[] memory _ingredients,
        string memory _productImageUrl,
        string memory _certificationUrl,
        string memory _manufacturerName,
        string memory _factoryAddress
    ) public {
        productCount++;
        uint id = productCount;
        
        Product storage p = products[id];
        
        p.name = _name;
        p.batchID = _batchID;
        p.manufactureDate = _manufactureDate;
        p.origin = _origin;
        p.isAuthentic = true;
        p.owner = msg.sender;
        p.ingredients = _ingredients;
        p.productImageUrl = _productImageUrl;
        p.certificationUrl = _certificationUrl;
        p.manufacturerName = _manufacturerName;
        p.factoryAddress = _factoryAddress;
        
        p.history.push("Created by Manufacturer");
        p.previousOwners.push(msg.sender);
        
        // Manufacturer thấy toàn bộ lịch sử
        historySnapshots[id][msg.sender] = 0;

        emit ProductCreated(id, _name);
    }

    function transferOwnership(uint _id, address _newOwner) public {
        require(_id <= productCount && _id > 0, "Invalid ID");
        require(products[_id].owner == msg.sender, "Not the owner");
        require(_newOwner != address(0), "Invalid address");

        Product storage p = products[_id];
        address oldOwner = p.owner;
        
        // Lưu snapshot cho chủ cũ
        historySnapshots[_id][oldOwner] = p.history.length;
        
        p.owner = _newOwner;
        p.previousOwners.push(_newOwner);
        
        p.history.push(string(abi.encodePacked("Transferred from ", toAsciiString(oldOwner), " to ", toAsciiString(_newOwner))));
        
        emit OwnershipTransferred(_id, oldOwner, _newOwner);
    }

    function verifyProduct(uint _id) public view returns (
        string memory name,
        string memory batchID,
        string memory manufactureDate,
        string memory origin,
        address owner,
        string memory manufacturerName,
        string memory factoryAddress,
        string[] memory ingredients,      // ← Thêm thành phần
        string[] memory visibleHistory
    ) {
        require(_id <= productCount && _id > 0, "Invalid ID");
        Product storage p = products[_id];

        uint limit = p.history.length;
        bool isCurrentOwner = (p.owner == msg.sender);
        
        if (!isCurrentOwner) {
            uint snapshot = historySnapshots[_id][msg.sender];
            if (snapshot > 0) {
                limit = snapshot;                    // Chủ cũ chỉ xem đến lúc chuyển đi
            } else {
                limit = 1;                           // Người lạ chỉ xem dòng đầu tiên
            }
        }

        string[] memory filteredHistory = new string[](limit);
        for (uint i = 0; i < limit; i++) {
            filteredHistory[i] = p.history[i];
        }

        return (
            p.name,
            p.batchID,
            p.manufactureDate,
            p.origin,
            p.owner,
            p.manufacturerName,
            p.factoryAddress,
            p.ingredients,
            filteredHistory
        );
    }

    function toAsciiString(address x) internal pure returns (string memory) {
        bytes memory s = new bytes(40);
        for (uint i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint160(x) >> (8 * (19 - i))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) % 16);
            s[2*i] = char(hi);
            s[2*i+1] = char(lo);
        }
        return string(s);
    }

    function char(bytes1 b) internal pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }
}
