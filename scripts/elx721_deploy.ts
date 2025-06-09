import { ethers } from "hardhat";

async function main() { 
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const EstateLuxeOZepp = await ethers.getContractFactory("EstateLuxeOZepp");
  const contract = await EstateLuxeOZepp.deploy(); // deploy the contract

  // get the address of the deployed contract
  console.log("EstateLuxeOZepp deployed to:", await contract.getAddress())
}

main()
  .then(() => process.exit(0))
  .catch(error => {
	console.error(error);
	process.exit(1);
  });