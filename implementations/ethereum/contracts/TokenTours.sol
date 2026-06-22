// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenTours is ERC20, Ownable {
    constructor() ERC20("Token Tours", "TT") {}

    // Mints new tokens for a recipient
    function mintTokens(address recipient, uint256 amount) external onlyOwner {
        _mint(recipient, amount);
    }
}
