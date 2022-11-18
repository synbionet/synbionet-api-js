import { ethers } from 'ethers';
import { FACTORY_CONTRACT, BIOASSET_CONTRACT, BIOTOKEN_CONTRACT, MARKET_CONTRACT } from './const';

export function connectToFactoryContract(signerOrProvider: any): ethers.Contract {
  return new ethers.Contract(FACTORY_CONTRACT.address, FACTORY_CONTRACT.abi, signerOrProvider);
}

export function connectToMarketContract(signerOrProvider: any): ethers.Contract {
  return new ethers.Contract(MARKET_CONTRACT.address, MARKET_CONTRACT.abi, signerOrProvider);
}

export function connectToBioTokenContract(signerOrProvider: any): ethers.Contract {
  return new ethers.Contract(BIOTOKEN_CONTRACT.address, BIOTOKEN_CONTRACT.abi, signerOrProvider);
}

export function connectToBioAssetContract(
  contractAddress: string,
  signerOrProvider: any
): ethers.Contract {
  return new ethers.Contract(contractAddress, BIOASSET_CONTRACT.abi, signerOrProvider);
}
