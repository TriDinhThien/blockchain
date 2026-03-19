// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CosmeticsTraceability {
    address public admin;

    struct Product {
        string name;
        string batchID;
        string manufactureDate; 
        string origin;
        bool isAuthentic;
        string[] history;
        address owner;
        string[] ingredients; // Mảng này cần hàm trả về riêng biệt hoặc sửa verifyProduct
        string productImageUrl;
        string certificationUrl;
        string manufacturerName;
        string factoryAddress;
        address[] previousOwners;
        mapping(address => uint) historySnapshot; 
    }

    mapping(uint => Product) private products; // Chuyển sang private để kiểm soát dữ liệu đầu ra
    uint public productCount = 0;

    // Phân quyền: Chỉ địa chỉ ví deploy contract (Manufacturer) mới có quyền tạo sản phẩm
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    event ProductCreated(uint id, string name);
    event OwnershipTransferred(uint id, address indexed oldOwner, address indexed newOwner);

    constructor() {
        admin = msg.sender;
    }

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
    ) public onlyAdmin {
        productCount++;
        
        Product storage p = products[productCount];
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
        
        emit ProductCreated(productCount, _name);
    }

    function transferOwnership(uint _id, address _newOwner) public {
        require(_id <= productCount && _id > 0, "Invalid ID");
        require(products[_id].owner == msg.sender, "Not the owner");
        require(_newOwner != address(0), "Invalid address");

        Product storage p = products[_id];
        address oldOwner = p.owner;
        
        p.historySnapshot[oldOwner] = p.history.length;
        p.owner = _newOwner;
        p.previousOwners.push(_newOwner);
        
        p.history.push(string(abi.encodePacked("Transferred from ", toAsciiString(oldOwner), " to ", toAsciiString(_newOwner))));
        
        emit OwnershipTransferred(_id, oldOwner, _newOwner);
    }

    /**
     * @dev Hàm verifyProduct đã được cập nhật để trả về đầy đủ:
     * 1. Thông tin cơ bản
     * 2. Mảng ingredients (Sửa lỗi không hiển thị ở Frontend)
     * 3. Lịch sử đã qua bộ lọc phân quyền
     */
    function verifyProduct(uint _id) public view returns (
        string memory name,
        string memory batchID,
        string memory manufactureDate,
        string memory origin,
        address owner,
        string memory manufacturerName,
        string memory factoryAddress,
        string memory productImageUrl,
        string[] memory ingredients,
        string[] memory visibleHistory
    ) {
        require(_id <= productCount && _id > 0, "Invalid ID");
        Product storage p = products[_id];

        uint limit = p.history.length;
        bool isCurrentOwner = (p.owner == msg.sender);
        
        if (!isCurrentOwner) {
            if (p.historySnapshot[msg.sender] > 0) {
                limit = p.historySnapshot[msg.sender];
            } else {
                limit = 1;
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
            p.productImageUrl,
            p.ingredients, // Trả về mảng thành phần ở đây
            filteredHistory
        );
    }

    // Helper function để convert address sang string
    function toAsciiString(address x) internal pure returns (string memory) {
        bytes memory s = new bytes(40);
        for (uint i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint(uint160(x)) / (2**(8*(19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
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
