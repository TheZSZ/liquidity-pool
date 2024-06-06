// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Coconut is ERC20, Ownable {
    constructor() ERC20("Coconut Token", "CTK") Ownable(msg.sender) {
        // initial minting not necessary, rewards will be minted dynamically
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
