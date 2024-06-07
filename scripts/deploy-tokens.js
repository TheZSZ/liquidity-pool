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
const { resolvePath } = require("react-router-dom");

const delay = (ms) => () => new Promise(resolve => setTimeout(resolve, ms));

async function deployMangoToken() {
  const MangoToken = await hre.ethers.getContractFactory("Mango");
  const mangoToken = await MangoToken.deploy();
  await mangoToken.waitForDeployment();
  console.log(
    ` Contract deployed to https://cardona-zkevm.polygonscan.com/address/${mangoToken.target}`
  );
}

async function deployPeachToken() {
  const PeachToken = await hre.ethers.getContractFactory("Peach");
  const peachToken = await PeachToken.deploy();
  await peachToken.waitForDeployment();
  console.log(
    ` Contract deployed to https://cardona-zkevm.polygonscan.com/address/${peachToken.target}`
  );
}

async function main() {
//   await withSpinner(deployMangoToken, "Deploying Mango Token...");
//   await withSpinner(deployPeachToken, "Deploying Peach Token...");

  await withSpinner(delay(5000), "Deploying Mango Token...");
  console.log(
    ` Contract deployed to https://cardona-zkevm.polygonscan.com/address/`
  );
  await withSpinner(delay(5000), "Deploying Peach Token...");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
