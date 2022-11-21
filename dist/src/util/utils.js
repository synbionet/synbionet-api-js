"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToBioAssetContract = exports.connectToBioTokenContract = exports.connectToMarketContract = exports.connectToFactoryContract = void 0;
const ethers_1 = require("ethers");
const const_1 = require("./const");
function connectToFactoryContract(signerOrProvider) {
    return new ethers_1.ethers.Contract(const_1.FACTORY_CONTRACT.address, const_1.FACTORY_CONTRACT.abi, signerOrProvider);
}
exports.connectToFactoryContract = connectToFactoryContract;
function connectToMarketContract(signerOrProvider) {
    return new ethers_1.ethers.Contract(const_1.MARKET_CONTRACT.address, const_1.MARKET_CONTRACT.abi, signerOrProvider);
}
exports.connectToMarketContract = connectToMarketContract;
function connectToBioTokenContract(signerOrProvider) {
    return new ethers_1.ethers.Contract(const_1.BIOTOKEN_CONTRACT.address, const_1.BIOTOKEN_CONTRACT.abi, signerOrProvider);
}
exports.connectToBioTokenContract = connectToBioTokenContract;
function connectToBioAssetContract(contractAddress, signerOrProvider) {
    return new ethers_1.ethers.Contract(contractAddress, const_1.BIOASSET_CONTRACT.abi, signerOrProvider);
}
exports.connectToBioAssetContract = connectToBioAssetContract;
