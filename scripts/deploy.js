async function main() {
    // Get the ContractFactory and Signer
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
  
    // Get the contract to deploy
    const MerkleProofVerifier = await ethers.getContractFactory("MerkleProofVerifier");
    const merkleProofVerifier = await MerkleProofVerifier.deploy();
  
    console.log("MerkleProofVerifier contract deployed to:", merkleProofVerifier.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  