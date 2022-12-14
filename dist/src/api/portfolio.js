"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfolioNamespace = void 0;
const utils_1 = require("../util/utils");
const ethers_1 = require("ethers");
const const_1 = require("../util/const");
const request = __importStar(require("superagent"));
/**
 * The portfolio namespace contains all the functionality related account assets
 *
 * Do not call this constructor directly. Instead, instantiate an SynBioNet object
 * with `const synbionet = new SynBioNet(config)` and then access the portfolio namespace
 * via `synbionet.portfolio`.
 */
class PortfolioNamespace {
    /** @internal */
    constructor(config) {
        this.config = config;
    }
    /**
     * Buy BioTokens
     * @param qty - amt to buy
     * @public
     */
    buyBioTokens(qty) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = yield this.config.getProvider();
            const signer = provider.getSigner();
            const bioToken = (0, utils_1.connectToBioTokenContract)(signer);
            const tx = yield bioToken.buy(qty, {
                value: yield bioToken.calculateCost(qty),
            });
            return tx.wait();
        });
    }
    /**
     * Withdraw biotokens
     * @param qty
     * @public
     */
    withdrawBioTokens(qty) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = yield this.config.getProvider();
            const signer = provider.getSigner();
            const bioToken = (0, utils_1.connectToBioTokenContract)(signer);
            try {
                const tx = yield bioToken.withdraw(qty);
                return tx.wait();
            }
            catch (err) {
                return err;
            }
        });
    }
    /**
     * Returns biotoken balance for account
     * @param address - account of interest
     * @public
     */
    getBioTokenBalance(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = yield this.config.getProvider();
            const bioToken = yield (0, utils_1.connectToBioTokenContract)(provider);
            return yield bioToken.balanceOf(address);
        });
    }
    /**
     * Creates new bioAsset
     * @public
     */
    createAsset(name, desc, license, serviceEndpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = yield this.config.getProvider();
            const signer = provider.getSigner();
            const factory = (0, utils_1.connectToFactoryContract)(signer);
            const gasEstimate = yield factory.estimateGas.createAsset('arbitrary_value');
            const inflatedGasEstimate = gasEstimate.add(gasEstimate.div(5)); // inflatedGasEstimate is 120% of gas estimate
            const signerBalance = yield provider.getBalance(yield signer.getAddress());
            // check if wallet has at least 120% of gas estimate to deploy contract before saving metadata to arweave
            // TODO: proper error handling
            if (signerBalance.lt(inflatedGasEstimate))
                return console.error('Not enough funds in wallet to pay for gas. Asset not created.');
            const bioAssetAddress = yield factory.callStatic.createAsset('arbitrary_value');
            const meta = createMetaData(name, desc, license, bioAssetAddress, serviceEndpoint, yield signer.getChainId());
            const resp = yield request
                .post(`${const_1.INDEXER_URL}/asset`)
                .set('Accept', 'application/json')
                .send(meta);
            if (resp.status !== 200)
                return console.error('Error publishing metadata to decentralized storage. Asset not created.');
            const tokenURI = `${const_1.INDEXER_URL}/${meta.did}`;
            const tx = yield factory.createAsset(tokenURI);
            yield tx.wait();
            return bioAssetAddress;
        });
    }
}
exports.PortfolioNamespace = PortfolioNamespace;
/**
 * Create an Asset
 * @param name
 * @param desc
 * @param license
 * @param nftAddress
 * @param chainid
 * @returns {AssetMetaData}
 */
function createMetaData(name, desc, license, nftAddress, serviceEndpoint, chainid) {
    return {
        did: generateDid(nftAddress, chainid),
        name: name,
        description: desc,
        license: license,
        nftAddress: nftAddress,
        tokenAddress: '0xExampleAddress',
        serviceEndpoint: serviceEndpoint,
    };
}
/**
 * Generate a decentralized identifier from the contract
 * address and chain id.
 *
 * @param {String} address the address of the contract
 * @param {Number} chainId the chain id for the ethereum network
 * @returns {String} the DID
 */
function generateDid(nftAddress, chainId) {
    const did_value = ethers_1.ethers.utils.id(nftAddress + chainId);
    return `${const_1.DID_PREFIX}:${did_value}`;
}
