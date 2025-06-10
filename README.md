# Estate Luxe OZ

Exploring Web3 development with a simple decentralized application (DApp) built using Solidity, Ethers.js, and Hardhat.



## Project Structure

- `contracts/`: Directory for Solidity smart contracts. (Assumed, standard Hardhat structure)
- `scripts/`: Directory for deployment and interaction scripts. (Assumed, standard Hardhat structure)
- `test/`: Directory for test files. (Assumed, standard Hardhat structure)
- `hardhat.config.ts`: Hardhat configuration file.
- `src/artifacts`: Custom path for contract compilation artifacts.

## Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn

## Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Princeigwe/estate-luxe-dapp-oz
    cd estate-luxe-oz
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    This project uses `hardhat/config`'s `vars` to manage sensitive information like API keys and private keys.
    Run the following commands and provide your values when prompted:
    ```bash
    npx hardhat vars set INFURA_API_KEY
    npx hardhat vars set METAMASK_PRIVATE_KEY
    ```
    These variables are used for deploying to the Sepolia test network.

## Development

### Compile Contracts
```bash
npx hardhat compile
```
Compiled artifacts will be stored in the `./src/artifacts` directory.

### Deploy to Sepolia
The project is configured to deploy to the Sepolia test network.
Ensure your `METAMASK_PRIVATE_KEY` has Sepolia ETH for gas fees.

A contract has been deployed to Sepolia at the following address:
`0xDB9e357C15306f04cD2E2F6a7ed2035aCab5d103`

### Solidity Version
This project uses Solidity version `0.8.28`.