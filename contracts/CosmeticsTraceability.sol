// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CosmeticsTraceability {
    // Roles enum
    enum Role { None, Manufacturer, Distributor, Consumer }

    struct Product {
        string name;
        string batchID;
        uint manufactureDate;
        string origin;
        bool isAuthentic;
        address owner; // Owner hiện tại
        string[] history; // Lịch sử trạng thái
    }

    mapping(uint => Product) public products;
    mapping(address => Role) public roles; // Vai trò của address
    uint public productCount = 0;

    address public admin; // Deployer là admin

    event ProductCreated(uint id, string name);
    event StatusUpdated(uint id, string newStatus);
    event OwnershipTransferred(uint id, address previousOwner, address newOwner); // Thêm previousOwner
    event RoleAssigned(address user, Role role);

    modifier onlyManufacturer() {
        require(roles[msg.sender] == Role.Manufacturer, "Only manufacturer can call this");
        _;
    }

    modifier onlyDistributor() {
        require(roles[msg.sender] == Role.Distributor, "Only distributor can call this");
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }

    modifier productExists(uint _id) {
        require(_id > 0 && _id <= productCount, "Product does not exist");
        _;
    }

    modifier onlyOwnerOfProduct(uint _id) {
        require(products[_id].owner == msg.sender, "You are not the owner of this product");
        _;
    }

    constructor() {
        admin = msg.sender; // Deployer là admin
        roles[msg.sender] = Role.Manufacturer; // Gán role Manufacturer cho admin ban đầu
    }

    // Admin gán role cho user
    function addRole(address _user, Role _role) public onlyAdmin {
        require(_role != Role.None, "Invalid role");
        roles[_user] = _role;
        emit RoleAssigned(_user, _role);
    }

    // Tạo sản phẩm (chỉ Manufacturer)
    function createProduct(string memory _name, string memory _batchID, uint _manufactureDate, string memory _origin) public onlyManufacturer {
        productCount++;
        products[productCount] = Product(_name, _batchID, _manufactureDate, _origin, true, msg.sender, new string[](0));
        products[productCount].history.push("Created by Manufacturer");
        emit ProductCreated(productCount, _name);
    }

    // Cập nhật trạng thái (chỉ Distributor, và chỉ owner hiện tại)
    function updateStatus(uint _id, string memory _newStatus) public onlyDistributor productExists(_id) onlyOwnerOfProduct(_id) {
        products[_id].history.push(_newStatus);
        emit StatusUpdated(_id, _newStatus);
    }

    // Chuyển quyền sở hữu (chỉ Distributor hoặc Manufacturer, và chỉ owner hiện tại)
    function transferOwnership(uint _id, address _newOwner) public productExists(_id) onlyOwnerOfProduct(_id) {
        require(_newOwner != address(0), "Invalid new owner");
        require(roles[msg.sender] == Role.Manufacturer || roles[msg.sender] == Role.Distributor, "Only manufacturer or distributor can transfer");
        address previousOwner = products[_id].owner;
        products[_id].owner = _newOwner;
        products[_id].history.push(string(abi.encodePacked("Transferred to ", toAsciiString(_newOwner))));
        emit OwnershipTransferred(_id, previousOwner, _newOwner);
    }

    // Hàm view sản phẩm (ai cũng gọi được)
    function verifyProduct(uint _id) public view productExists(_id) returns (string memory name, string memory batchID, uint manufactureDate, string memory origin, bool isAuthentic, string[] memory history, address owner) {
        Product memory p = products[_id];
        return (p.name, p.batchID, p.manufactureDate, p.origin, p.isAuthentic, p.history, p.owner);
    }

    // Helper function to convert address to string
    function toAsciiString(address x) internal pure returns (string memory) {
        bytes memory s = new bytes(40);
        for (uint i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint(uint160(x)) / (2**(8*(19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2*i] = char(hi);
            s[2*i+1] = char(lo);            
        }
        return string(abi.encodePacked("0x", s));
    }

    function char(bytes1 b) internal pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }
}
