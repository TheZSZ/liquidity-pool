// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LiquidityPool is Ownable {
    // different tokens in system.
    // Peach & Mango is accepted into pool
    // Coconut is payout for stakers
    IERC20 public peachToken;
    IERC20 public mangoToken;
    IERC20 public coconutToken;

    // to track total liquidity in pool
    uint256 public totalLiquidityPeach;
    uint256 public totalLiquidityMango;

    mapping(address => uint256) public stakedAmount;
    mapping(address => uint256) public stakingTime;

    uint256 public rewardRate = 1; // Number of Coconut tokens rewarded per second of staking

    event LiquidityAdded(address indexed provider, uint256 peachAmount, uint256 mangoAmount);
    event Swapped(address indexed swapper, address indexed fromToken, address indexed toToken, uint256 amount);
    event Staked(address indexed staker, uint256 amount);
    event Unstaked(address indexed staker, uint256 amount, uint256 reward);

    constructor(IERC20 _peachToken, IERC20 _mangoToken, IERC20 _coconutToken) Ownable(msg.sender) {
        peachToken = _peachToken;
        mangoToken = _mangoToken;
        coconutToken = _coconutToken;
    }

    function addLiquidity(uint256 _peachAmount, uint256 _mangoAmount) external {
        peachToken.transferFrom(msg.sender, address(this), _peachAmount);
        mangoToken.transferFrom(msg.sender, address(this), _mangoAmount);

        totalLiquidityPeach += _peachAmount;
        totalLiquidityMango += _mangoAmount;

        emit LiquidityAdded(msg.sender, _peachAmount, _mangoAmount);
    }

    function swapPeachForMango(uint256 _peachAmount) external {
        require(totalLiquidityPeach > 0 && totalLiquidityMango > 0, "Insufficient liquidity");
        uint256 mangoAmount = (_peachAmount * totalLiquidityMango) / totalLiquidityPeach;

        peachToken.transferFrom(msg.sender, address(this), _peachAmount);
        mangoToken.transfer(msg.sender, mangoAmount);

        totalLiquidityPeach += _peachAmount;
        totalLiquidityMango -= mangoAmount;

        emit Swapped(msg.sender, address(peachToken), address(mangoToken), _peachAmount);
    }

    function swapMangoForPeach(uint256 _mangoAmount) external {
        require(totalLiquidityPeach > 0 && totalLiquidityMango > 0, "Insufficient liquidity");
        uint256 peachAmount = (_mangoAmount * totalLiquidityPeach) / totalLiquidityMango;

        mangoToken.transferFrom(msg.sender, address(this), _mangoAmount);
        peachToken.transfer(msg.sender, peachAmount);

        totalLiquidityPeach -= peachAmount;
        totalLiquidityMango += _mangoAmount;

        emit Swapped(msg.sender, address(mangoToken), address(peachToken), _mangoAmount);
    }

    function stake(uint256 _amount) external {
        require(_amount > 0, "Cannot stake 0");

        peachToken.transferFrom(msg.sender, address(this), _amount);
        stakedAmount[msg.sender] += _amount;
        stakingTime[msg.sender] = block.timestamp;

        emit Staked(msg.sender, _amount);
    }

    function unstake() external {
        uint256 amount = stakedAmount[msg.sender];
        require(amount > 0, "No staked amount");

        uint256 stakingDuration = block.timestamp - stakingTime[msg.sender];
        uint256 reward = stakingDuration * rewardRate;

        peachToken.transfer(msg.sender, amount);
        coconutToken.transfer(msg.sender, reward);

        stakedAmount[msg.sender] = 0;
        stakingTime[msg.sender] = 0;

        emit Unstaked(msg.sender, amount, reward);
    }
}
