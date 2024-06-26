// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Faucet is Ownable {
    IERC20 public peach;
    IERC20 public mango;

    // events to track token requests
    event PeachTokensRequested(address indexed to, uint256 amount);
    event MangoTokensRequested(address indexed to, uint256 amount);

    constructor(IERC20 _peach, IERC20 _mango) Ownable(msg.sender) {
        peach = _peach;
        mango = _mango;
    }

    // request peach tokens from faucet
    function requestPeachTokens(address to, uint256 amount) external onlyOwner {
        require(peach.balanceOf(address(this)) >= amount, "Insufficient Peach token balance in faucet");
        peach.transfer(to, amount);
        emit PeachTokensRequested(to, amount);
    }

    // request mango tokens from faucet
    function requestMangoTokens(address to, uint256 amount) external onlyOwner {
        require(mango.balanceOf(address(this)) >= amount, "Insufficient Mango token balance in faucet");
        mango.transfer(to, amount);
        emit MangoTokensRequested(to, amount);
    }

    // returns amount of Peach remaining in faucet
    function getPeachBalance() external view returns (uint256) {
        return peach.balanceOf(address(this));
    }

    // returns amount of Mango remaining in faucet
    function getMangoBalance() external view returns (uint256) {
        return mango.balanceOf(address(this));
    }
}
