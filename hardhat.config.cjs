require('@nomiclabs/hardhat-ethers');
require('dotenv').config();

module.exports = {
  solidity: "0.8.27",  // Match this with the Solidity version in your contract
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,  // Replace with your Infura project ID
      accounts: [`0x${process.env.PRIVATE_KEY}`]  // Make sure to set your wallet private key in a .env file
    }
  }
};
