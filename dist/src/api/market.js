"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketNamespace = void 0;
const utils_1 = require("../util/utils");
const const_1 = require("../util/const");
const supertest_1 = __importDefault(require("supertest"));
const const_2 = require("../util/const");
/**
 * The market namespace contains all the functionality related to the synbionet market
 *
 * Do not call this constructor directly. Instead, instantiate an SynBioNet object
 * with `const synbionet = new SynBioNet(config)` and then access the market namespace
 * via `synbionet.market`.
 */
class MarketNamespace {
    /** @internal */
    constructor(config) {
        this.config = config;
    }
    /**
     * Return specific bioasset market details
     * @param contractAddress - address of bioasset contract
     * @public
     */
    getProduct(contractAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = yield this.config.getProvider();
            const market = (0, utils_1.connectToMarketContract)(provider);
            const bioAsset = (0, utils_1.connectToBioAssetContract)(contractAddress, provider);
            const responses = yield Promise.all([
                yield market.getProduct(contractAddress),
                yield bioAsset.availableLicenses(),
                yield bioAsset.owner(),
                yield bioAsset.uri(1),
            ]);
            const [productInfo, availableLicenses, owner, uri] = responses;
            // const product = await market.getProduct(contractAddress);
            return {
                // toString method is called because contracts return Big Numbers
                owner,
                uri,
                availableLicenses: availableLicenses.toString(),
                licensePrice: productInfo.licensePrice.toString(),
                ipForSale: productInfo.ipForSale,
                ipPrice: productInfo.ipPrice.toString(),
            };
        });
    }
    /**
     * returns uri for a specific bioasset
     * @param contractAddress - address of bioasset contract
     * @public
     */
    getURI(contractAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = yield this.config.getProvider();
            const bioAsset = (0, utils_1.connectToBioAssetContract)(contractAddress, provider);
            return yield bioAsset.uri(1);
        });
    }
    registerAssetOnMarket(bioAssetContractAddress, licenseQty, licensePrice, isIPForSale, ipPrice) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = yield this.config.getProvider();
            const signer = provider.getSigner();
            const bioAsset = (0, utils_1.connectToBioAssetContract)(bioAssetContractAddress, signer);
            const tx = yield bioAsset.registerWithMarket(licenseQty, licensePrice, isIPForSale, ipPrice);
            return tx.wait();
        });
    }
    updateAssetOnMarket(bioAssetContractAddress, licensePrice, isIPForSale, ipPrice) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = yield this.config.getProvider();
            const signer = provider.getSigner();
            const bioAsset = (0, utils_1.connectToBioAssetContract)(bioAssetContractAddress, signer);
            const tx = yield bioAsset.updateWithMarket(licensePrice, isIPForSale, ipPrice);
            return tx.wait();
        });
    }
    buyLicense(contractAddress, qty) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = yield this.config.getProvider();
            const signer = provider.getSigner();
            const market = (0, utils_1.connectToMarketContract)(signer);
            const { licensePrice } = yield market.getProduct(contractAddress);
            const bioToken = (0, utils_1.connectToBioTokenContract)(signer);
            const tx0 = yield bioToken.approve(const_1.MARKET_CONTRACT.address, licensePrice.mul(qty));
            yield tx0.wait();
            const tx1 = yield market.buyLicense(contractAddress, qty);
            return tx1.wait();
        });
    }
    balanceOfLicense(contractAddress, walletAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = yield this.config.getProvider();
            const bioAsset = (0, utils_1.connectToBioAssetContract)(contractAddress, provider);
            const balance = yield bioAsset.balanceOf(walletAddress, yield bioAsset.LICENSE());
            return balance.toString();
        });
    }
    buyAsset(contractAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = yield this.config.getProvider();
            const signer = provider.getSigner();
            const market = (0, utils_1.connectToMarketContract)(signer);
            const tx = yield market.buyAsset(contractAddress);
            return tx.wait();
        });
    }
    getAllBioAssets() {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield get('/assets');
            if (resp.status === 200)
                return resp.body;
            return undefined;
        });
    }
    getBioAssetById(did) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield get(`/asset/${did}`);
            if (resp.status === 200)
                return resp.body;
            return undefined;
        });
    }
}
exports.MarketNamespace = MarketNamespace;
function get(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const resp = yield (0, supertest_1.default)(const_2.INDEXER_URL).get(path).set('Accept', 'application/json');
        return resp;
    });
}
