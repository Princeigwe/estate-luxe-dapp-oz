import { HardhatUserConfig } from "hardhat/config";
import { vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";


const infura_api_key = vars.get('INFURA_API_KEY')
const sepolia_private_key = vars.get('METAMASK_PRIVATE_KEY')

const config: HardhatUserConfig = {
  paths: {
    artifacts: "./src/artifacts",
  },
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${infura_api_key}`,
      accounts: [sepolia_private_key],
    }
  }
};

export default config;


