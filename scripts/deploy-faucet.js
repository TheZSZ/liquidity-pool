// deploy the faucet contract
const fs = require('fs');
const path = require('path');

// Emitting warnings of experimental features 
const originalEmitWarning = process.emitWarning;
process.emitWarning = (warning, type, ...args) => {
    if (type === 'ExperimentalWarning' || (typeof warning === 'string' && warning.includes('Node.js'))) {
        return;
    }
    originalEmitWarning.call(process, warning, type, ...args);
};

// Deploy only the faucet contract
const hre = require("hardhat");
const { withSpinner } = require("./ascii-spinner");

// delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Read deployed addresses from the file
const readAddresses = () => {
    const filePath = path.join(__dirname, 'deployed-addresses.json');
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        return JSON.parse(data);
    }
    return {};
};

// Save deployed addresses to a file
const saveAddresses = (addresses) => {
    const filePath = path.join(__dirname, 'deployed-addresses.json');
    fs.writeFileSync(filePath, JSON.stringify(addresses, null, 2));
};

async function testDeploy() {
    const addresses = readAddresses();
    if (!addresses.mangoToken || !addresses.peachToken) {
        throw new Error("Mango and Peach token contracts must be deployed first");
    }
    await delay(5000);
    const target = `0xDEADBEEF`;
    const address = `https://cardona-zkevm.polygonscan.com/address/${target}`;
    saveAddresses({ ...addresses, faucet: target });
    return `${address}`;
}

async function deployFaucet() {
    const addresses = readAddresses();
    const Faucet = await hre.ethers.getContractFactory("Faucet");
    const faucet = await Faucet.deploy(addresses.mangoToken, addresses.peachToken);
    await faucet.waitForDeployment();
    const address = `https://cardona-zkevm.polygonscan.com/address/${faucet.target}`;
    addresses.faucet = faucet.target;
    saveAddresses(addresses);
    return `${address}`;
}

async function main() {
    const faucetDeployed = await withSpinner(testDeploy, "Deploying Faucet Contract...");
    process.stdout.write(`    — ${faucetDeployed}\n`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
