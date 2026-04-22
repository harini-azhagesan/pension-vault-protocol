import "@nomicfoundation/hardhat-ethers";

/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: "0.8.28",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
