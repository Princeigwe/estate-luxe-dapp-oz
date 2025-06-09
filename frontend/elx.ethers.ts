import dotenv from "dotenv";
dotenv.config({override: true});

import { ethers } from "ethers";
import { elxContractABI } from "./elx.contract.abi";


const contractAddress = process.env.CONTRACT_ADDRESS?.trim();
const providerUrl = process.env.PROVIDER_URL?.trim();

// this is just to identify the wallet I'm working
const desiredWalletAddress = process.env.WORKING_WALLET_ADDRESS?.trim();
let desiredWalletPrivateKey = process.env.WORKING_WALLET_PRIVATE_KEY?.trim();


const recipientAddress = process.env.RECIPIENT_ADDRESS?.trim();
let recipientPrivateKey = process.env.RECIPIENT_PRIVATE_KEY?.trim();


// VARIABLE CHECK FOR WALLET A 

if (!contractAddress || !providerUrl || !desiredWalletPrivateKey) {
  throw new Error("Missing required environment variables");
}

// ensuring private key is correctly prefixed with '0x'
if (!desiredWalletPrivateKey.startsWith("0x")) {
  desiredWalletPrivateKey = `0x${desiredWalletPrivateKey}`;
}

// validate private key format
if (!/^0x[0-9a-fA-F]{64}$/.test(desiredWalletPrivateKey)) {
  throw new Error("Invalid private key format");
}

//VARIABLE CHECK FOR WALLET B

if (!contractAddress || !providerUrl || !recipientPrivateKey) {
  throw new Error("Missing required environment variables");
}

// ensuring private key is correctly prefixed with '0x'
if (!recipientPrivateKey.startsWith("0x")) {
  recipientPrivateKey = `0x${recipientPrivateKey}`;
}

// validate private key format
if (!/^0x[0-9a-fA-F]{64}$/.test(recipientPrivateKey)) {
  throw new Error("Invalid private key format");
}

// initializing provider and wallet (creator)
const provider = new ethers.JsonRpcProvider(providerUrl);
const wallet = new ethers.Wallet(desiredWalletPrivateKey, provider);


// initializing provider and wallet (buyer)
const recipientProvider = new ethers.JsonRpcProvider(providerUrl);
const recipientWallet = new ethers.Wallet(recipientPrivateKey, recipientProvider);

// connecting  WALLET A to contract
const walletAElxContract = new ethers.Contract(contractAddress, elxContractABI, wallet);

// connecting  WALLET B to contract
const walletBElxContract = new ethers.Contract(contractAddress, elxContractABI, recipientWallet);

class ElxInteractions {
  async getNftNameAndSymbol() {
    try {
      const tokenName = await walletAElxContract.name();
      const tokenSymbol = await walletAElxContract.symbol();
      console.log(`Token name: ${tokenName}, Symbol: ${tokenSymbol}`);
    } catch (error) {
      console.error("Failed to fetch token name/symbol:", error);
    }
  }

  async walletACreateListing(location: string, description: string, price: number, image: string) {
    try {
      const createListing = await walletAElxContract.createListing(location, description, price, image)
      console.log("Listing minted:", createListing)
    } catch (error) {
      console.error("Failed to create realty listing:", error)
    }
  }

  async walletBCreateListing(location: string, description: string, price: number, image: string, tokenCid: string) {
    try {
      const createListing = await walletBElxContract.createListing(location, description, price, image, tokenCid)
      console.log("Listing minted:", createListing)
    } catch (error) {
      console.error("Failed to create realty listing:", error)
    }
  }


  async walletBBuyListing(tokenId: number, ethPrice: number) {
    try {
    
      // sending eth value to payable function
      const options = {value: ethers.parseEther(ethPrice.toString())}
      await walletBElxContract.buyRealty(tokenId, options)
      console.log("Realty bought successfully")
    } catch (error) {
      console.error("Failed to buy realty:", error)
    }
  }


  async walletAGetMyRealties() {
    try {
      const myRealties = await walletAElxContract.getMyRealties()
      console.log("Realties tokens:", myRealties)
    } catch (error) {
      console.error("Error fetching realties token:", error)
    }
  }

  async walletBGetMyRealties() {
    try {
      const myRealties = await walletBElxContract.getMyRealties()
      console.log("Realties tokens:", myRealties)
    } catch (error) {
      console.error("Error fetching realties token:", error)
    }
  }

  async walletAGetTokenUri(tokenId: number) {
    try {
      const tokenUri = await walletAElxContract.getTokenUri(tokenId)
      console.log("Token metadata URI:", tokenUri)
    } catch (error) {
      console.error("Error fetching uri:", error)
    }
  }

  async walletBGetTokenUri(tokenId: number) {
    try {
      const tokenUri = await walletBElxContract.getTokenUri(tokenId)
      console.log("Token metadata URI:", tokenUri)
    } catch (error) {
      console.error("Error fetching uri:", error)
    }
  }


  async walletAGetRealtyTxns(tokenId: number) {
    try {
      const response = await walletAElxContract.getRealtyTxns(tokenId)
      console.log("Token transactions:", response)
    } catch (error) {
      console.error("Error fetching transactions:", error)
    }
  }


  async walletBGetTokenOwner(tokenId: number) {
    try {
      const tokenOwner = await walletBElxContract.ownerOf(tokenId)
      console.log("Token owner:", tokenOwner)
    } catch (error) {
      console.error("Error fetching owner:", error)
    }
  }

}

const elxInteractions = new ElxInteractions();


// elxInteractions.getNftNameAndSymbol();

const location = "Califonia, US"
const description = "white and brown concrete building under blue sky during daytime"
const nftImage = "ipfs://bafybeihq27jrbhh4kmaeruqej7nld267p6ojayw7f5z5m7qrx65glxzkqq"
const tokenCid = "bafkreif67z5t3wwrtyr2b4ice7o5qzxdcaa3apgxwnfeui43qembigmdua"
const ethPrice = 3

// elxInteractions.walletACreateListing(location, description, ethPrice, nftImage)

elxInteractions.walletAGetMyRealties()
// elxInteractions.walletBGetMyRealties()

// elxInteractions.walletBBuyListing(0, 5)

// elxInteractions.walletBGetTokenUri(0)

// elxInteractions.walletAGetRealtyTxns(0)

// elxInteractions.walletBGetTokenOwner(0)