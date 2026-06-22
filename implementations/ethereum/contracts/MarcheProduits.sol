// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MarcheProduits {
    struct Produit {
        uint256 id;
        string name;
        string image;
        uint256 price;
        uint256 quantity;
        string description;
        address payable creator;
    }

    uint256 public nextProductId;
    mapping(uint256 => Produit) public produits;
    mapping(address => uint256[]) public userPurchases;

    event ProductAdded(
        uint256 indexed productId,
        string name,
        uint256 price,
        uint256 quantity,
        string description,
        address indexed creator
    );

    event ProductPurchased(
        address indexed buyer,
        uint256 indexed productId,
        uint256 quantity,
        uint256 totalPrice,
        address indexed creator
    );

    // Checks that the product exists
    modifier validProduct(uint256 productId) {
        require(productId < nextProductId, "The product does not exist");
        _;
    }

    // Adds a new product to the marketplace
    function ajouterProduit(
        string memory name,
        string memory image,
        uint256 price,
        uint256 quantity,
        string memory description
    ) external {
        require(price > 0, "The price must be greater than zero");
        require(quantity > 0, "The quantity must be greater than zero");

        produits[nextProductId] = Produit(
            nextProductId,
            name,
            image,
            price,
            quantity,
            description,
            payable(msg.sender)
        );

        emit ProductAdded(
            nextProductId,
            name,
            price,
            quantity,
            description,
            msg.sender
        );

        nextProductId++;
    }

    // Buys a product by paying in Ether
    function acheterProduit(uint256 productId, uint256 quantity)
        external
        payable
        validProduct(productId)
    {
        Produit storage product = produits[productId];
        require(product.quantity >= quantity, "Insufficient stock");

        uint256 totalPrice = product.price * quantity;
        require(msg.value == totalPrice, "Incorrect ETH amount");

        product.quantity -= quantity;
        userPurchases[msg.sender].push(productId);

        // Direct payment to the product creator
        (bool success, ) = product.creator.call{value: totalPrice}("");
        require(success, "Payment to the creator failed");

        emit ProductPurchased(
            msg.sender,
            productId,
            quantity,
            totalPrice,
            product.creator
        );
    }

    // Returns all available products
    function obtenirTousLesProduits() external view returns (Produit[] memory) {
        Produit[] memory allProducts = new Produit[](nextProductId);
        for (uint256 i = 0; i < nextProductId; i++) {
            allProducts[i] = produits[i];
        }
        return allProducts;
    }

    // Returns the IDs of products purchased by a user
    function obtenirAchatsUtilisateur(address user) external view returns (uint256[] memory) {
        return userPurchases[user];
    }
}
