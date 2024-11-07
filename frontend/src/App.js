import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

// Replace with your deployed contract's ABI and address
const contractAddress = '0x36E80E341f9eEcD832FFa039DCAC0467F5b5C108'; // Deployed contract address
const contractABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "merkleRoot",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_merkleRoot",
        "type": "bytes32"
      }
    ],
    "name": "setMerkleRoot",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "transactionHash",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32[]",
        "name": "proof",
        "type": "bytes32[]"
      }
    ],
    "name": "verifyTransactionInclusion",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const App = () => {
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [value, setValue] = useState(null);
  const [newMerkleRoot, setNewMerkleRoot] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [proof, setProof] = useState([]);
  const [verificationResult, setVerificationResult] = useState(null); // State to hold verification result

  useEffect(() => {
    // Check if the browser has Ethereum enabled (MetaMask)
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      // Get the user's account address
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(accounts => {
          setAccount(accounts[0]);
        });

      // Set the contract instance
      const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
      setContract(contractInstance);
    } else {
      alert("Ethereum provider not found. Please install MetaMask.");
    }
  }, []);

  // Function to fetch the Merkle Root from the contract
  const fetchMerkleRootFromContract = async () => {
    if (contract) {
      try {
        const result = await contract.methods.merkleRoot().call();
        setValue(result);
      } catch (error) {
        console.error("Error fetching Merkle Root from contract:", error);
      }
    }
  };

  // Function to set the Merkle Root in the contract
  const setMerkleRootInContract = async () => {
    if (contract && account && newMerkleRoot) {
      try {
        const result = await contract.methods.setMerkleRoot(newMerkleRoot).send({ from: account });
        console.log('Merkle Root set successfully:', result);
        alert('Merkle Root set successfully');
      } catch (error) {
        console.error("Error setting Merkle Root in contract:", error);
      }
    } else {
      alert('Please provide a valid Merkle Root');
    }
  };

  // Function to verify transaction inclusion
  const verifyTransactionInclusion = async () => {
    if (contract && transactionHash && proof.length > 0) {
      try {
        const result = await contract.methods.verifyTransactionInclusion(transactionHash, proof).call();
        setVerificationResult(result); // Set the verification result in state
      } catch (error) {
        console.error("Error verifying transaction inclusion:", error);
        setVerificationResult(false); // In case of an error, assume it's false
      }
    } else {
      alert('Please provide a valid transaction hash and proof');
    }
  };

  return (
    <div>
      <h1>MerkleProofVerifier Contract Interaction</h1>

      {account ? (
        <div>
          <p>Connected Account: {account}</p>

          {/* Fetch Merkle Root */}
          <button onClick={fetchMerkleRootFromContract}>Fetch Merkle Root from Contract</button>
          {value && <p>Merkle Root from Contract: {value}</p>}

          {/* Set Merkle Root */}
          <div>
            <input
              type="text"
              placeholder="New Merkle Root"
              value={newMerkleRoot}
              onChange={(e) => setNewMerkleRoot(e.target.value)}
            />
            <button onClick={setMerkleRootInContract}>Set Merkle Root</button>
          </div>

          {/* Verify Transaction Inclusion */}
          <div>
            <input
              type="text"
              placeholder="Transaction Hash"
              value={transactionHash}
              onChange={(e) => setTransactionHash(e.target.value)}
            />
            <input
              type="text"
              placeholder="Proof (comma separated)"
              value={proof.join(', ')}
              onChange={(e) => setProof(e.target.value.split(',').map(item => item.trim()))}
            />
            <button onClick={verifyTransactionInclusion}>Verify Transaction Inclusion</button>
          </div>

          {/* Display verification result */}
          {verificationResult !== null && (
            <p>
              Transaction inclusion verified: {verificationResult ? 'true' : 'false'}
            </p>
          )}

        </div>
      ) : (
        <p>Please connect your MetaMask wallet</p>
      )}
    </div>
  );
};

export default App;
