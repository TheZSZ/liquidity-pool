require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.9"
      },
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]
  },
  paths: {
    artifacts: "./src",
  },
  networks: {
    zkEVM: {
      url: `https://rpc.cardona.zkevm-rpc.com`,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY],
    },
  },
};
