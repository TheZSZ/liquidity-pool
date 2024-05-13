// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Peach is ERC20 {
    constructor() ERC20("Peach Token", "PTK") {
        // Since ERC20 tokens are usually divisible, and Solidity does not handle decimals, 
        // you need to define the smallest unit of the token, similar to how Ethereum has Wei.
        // Below, we're assuming each token can be divided into 1e18 smaller units, similar to Wei.
        _mint(msg.sender, 15000000 * 10**uint(decimals())); // Mint 15 million tokens to the deployer's address
    }
}
