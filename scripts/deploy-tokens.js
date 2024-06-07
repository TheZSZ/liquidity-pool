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

// for testing purposes
async function testDeploy() {
    await delay(5000);
    return `Contract deployed to https://cardona-zkevm.polygonscan.com/address/TEST-DEPLOY`;
}

async function deployMangoToken() {
    const MangoToken = await hre.ethers.getContractFactory("Mango");
    const mangoToken = await MangoToken.deploy();
    await mangoToken.waitForDeployment();
    return `Contract deployed to https://cardona-zkevm.polygonscan.com/address/${mangoToken.target}`;
}

async function deployPeachToken() {
    const PeachToken = await hre.ethers.getContractFactory("Peach");
    const peachToken = await PeachToken.deploy();
    await peachToken.waitForDeployment();
    return `Contract deployed to https://cardona-zkevm.polygonscan.com/address/${peachToken.target}`;
}

async function main() {
//     await withSpinner(deployMangoToken, "Deploying Mango Token...");             // real
//     await withSpinner(deployPeachToken, "Deploying Peach Token...");

    // for testing purposes
    const mangoDeployed = await withSpinner(testDeploy, "Deploying Mango Token...");                     // copy stuff to here
    process.stdout.write("    — " + mangoDeployed + "\n");
    const peachDeployed = await withSpinner(testDeploy, "Deploying Peach Token...");
    process.stdout.write("    — " + peachDeployed + "\n");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
