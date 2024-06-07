// for saving deployed targets
const fs = require('fs');
const path = require('path');

// emitting warnings of experimental features 
// (ExperimentalWarning: Importing JSON modules is an experimental feature and might change at any time)
const originalEmitWarning = process.emitWarning;
process.emitWarning = (warning, type, ...args) => {
    if (type === 'ExperimentalWarning' || (typeof warning === 'string' && warning.includes('Node.js'))) {
        return;
    }
    originalEmitWarning.call(process, warning, type, ...args);
};

// deploy only Mango and Peach tokens
const hre = require("hardhat");
const { withSpinner } = require("./ascii-spinner");

// delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// save deployed addresses to a file
const saveAddresses = (addresses) => {
    const filePath = path.join(__dirname, 'deployed-addresses.json');
    fs.writeFileSync(filePath, JSON.stringify(addresses, null, 2));
};

// for testing purposes
async function testDeploy() {
    await delay(5000);
    const target = `0xDEADBEEF`;
    const address = `https://cardona-zkevm.polygonscan.com/address/${target}`;
    return { address, target };
}

async function deployMangoToken() {
    const MangoToken = await hre.ethers.getContractFactory("Mango");
    const mangoToken = await MangoToken.deploy();
    await mangoToken.waitForDeployment();
    const address = `https://cardona-zkevm.polygonscan.com/address/${mangoToken.target}`;
    return { address, target: mangoToken.target };
}

async function deployPeachToken() {
    const PeachToken = await hre.ethers.getContractFactory("Peach");
    const peachToken = await PeachToken.deploy();
    await peachToken.waitForDeployment();
    const address = `https://cardona-zkevm.polygonscan.com/address/${peachToken.target}`;
    return { address, target: peachToken.target };
}

async function main() {
//     await withSpinner(deployMangoToken, "Deploying Mango Token...");             // real
//     await withSpinner(deployPeachToken, "Deploying Peach Token...");

    // for testing purposes
    const mangoDeployed = await withSpinner(testDeploy, "Deploying Mango Token...");                     // copy stuff to here
    process.stdout.write(`    — ${mangoDeployed.address}\n`);
    const peachDeployed = await withSpinner(testDeploy, "Deploying Peach Token...");
    process.stdout.write(`    — ${peachDeployed.address}\n`);

    // Save the addresses to a file
    saveAddresses({
        mangoToken: mangoDeployed.target,
        peachToken: peachDeployed.target
    });
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
