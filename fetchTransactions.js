import Web3 from 'web3';  // Use 'import' for ES module syntax

const INFURA_PROJECT_ID = 'f7c980a90fb1445981132972de3c41cc';  // Replace with your Infura Project ID
const web3 = new Web3(new Web3.providers.HttpProvider(`https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`));

async function fetchTransactions(blockNumber) {
  try {
    // Fetch the block with the transactions
    const block = await web3.eth.getBlock(blockNumber, true);  // `true` includes transactions
    if (block && block.transactions) {
      console.log(`Transactions in block #${blockNumber}:`);
      block.transactions.forEach(tx => {
        console.log(`Transaction hash: ${tx.hash}`);
      });
    } else {
      console.log(`No transactions found in block #${blockNumber}`);
    }
  } catch (error) {
    console.error('Error fetching block transactions:', error);
  }
}

// Fetch the latest block number
web3.eth.getBlockNumber().then(latestBlock => {
  console.log(`Fetching transactions for the latest block #${latestBlock}...`);
  fetchTransactions(latestBlock);  // Fetch transactions from the latest block
});
