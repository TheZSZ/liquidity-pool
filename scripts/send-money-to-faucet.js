const hre = require("hardhat");

async function main() {
    // Get the signer (deployer)
    const [deployer] = await hre.ethers.getSigners();

    // addresses of the deployed contracts
    const mangoTokenAddress = "0xcABF8704CF59D9878D250EE882657535155662Ed";
    const peachTokenAddress = "0xa4b6BC9aB930F6e9041df9C25b6A676a02511c19";
    const faucetAddress = "0xc765C1298695B7Ada706357bD026A460A418bB0C";

    // get the contract factories
    const MangoToken = await hre.ethers.getContractAt("Mango", mangoTokenAddress, deployer);
    const PeachToken = await hre.ethers.getContractAt("Peach", peachTokenAddress, deployer);

    // transfer some tokens to the Faucet contract
    const amount = hre.ethers.parseUnits("1000.0", 18); // Transfer 1000 tokens

    // transfer Mango tokens to the Faucet
    let tx = await MangoToken.transfer(faucetAddress, amount);
    await tx.wait();
    console.log(`Transferred 1000 Mango tokens to the Faucet at ${faucetAddress}`);

    // transfer Peach tokens to the Faucet
    tx = await PeachToken.transfer(faucetAddress, amount);
    await tx.wait();
    console.log(`Transferred 1000 Peach tokens to the Faucet at ${faucetAddress}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
