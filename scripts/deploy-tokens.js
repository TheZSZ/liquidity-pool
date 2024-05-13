async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const TokenA = await ethers.getContractFactory("TokenA");
    const tokenA = await TokenA.deploy();
    await tokenA.deployed();
    console.log("Token A deployed to:", tokenA.address);

    const TokenB = await ethers.getContractFactory("TokenB");
    const tokenB = await TokenB.deploy();
    await tokenB.deployed();
    console.log("Token B deployed to:", tokenB.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
