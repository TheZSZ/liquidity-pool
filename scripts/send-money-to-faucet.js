const hre = require("hardhat");

async function main() {
    // Get the signer (deployer)
    const [deployer] = await hre.ethers.getSigners();

    // addresses of the deployed contracts
    const mangoTokenAddress = "0xc1bbf533c9Cf8Cd5ce1787BAA3CC1e328b9242e6";
    const peachTokenAddress = "0xBbf8D38C15767fbd083f35939B849c272AA79334";
    const faucetAddress = "0x8ddC496089DCbB54508cc14AB1722E3131E80754";

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
