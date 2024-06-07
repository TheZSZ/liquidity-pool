// deploy mango, peach, and faucet contracts
const hre = require("hardhat");

async function main() {
    // Deploy Mango Token Contract
    const MangoToken = await hre.ethers.getContractFactory("Mango");
    const mangoToken = await MangoToken.deploy();
    await mangoToken.waitForDeployment();
    console.log(
        `Mango Token contract deployed to https://cardona-zkevm.polygonscan.com/address/${mangoToken.target}`
    );

    // Deploy Peach Token Contract
    const PeachToken = await hre.ethers.getContractFactory("Peach");
    const peachToken = await PeachToken.deploy();
    await peachToken.waitForDeployment();
    console.log(
        `Peach Token contract deployed to https://cardona-zkevm.polygonscan.com/address/${peachToken.target}`
    );

    // Deploy Faucet Contract
    const Faucet = await hre.ethers.getContractFactory("Faucet");
    const faucet = await Faucet.deploy(mangoToken.target, peachToken.target);
    await faucet.waitForDeployment();
    console.log(
        `Faucet contract deployed to https://cardona-zkevm.polygonscan.com/address/${faucet.target}`
    );

    // const deployedContract = await hre.ethers.deployContract("Counter");
    // await deployedContract.waitForDeployment();
    // console.log(
    //     `Counter contract deployed to https://cardona-zkevm.polygonscan.com/address/${deployedContract.target}`
    // );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
