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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketNamespace = void 0;
const utils_1 = require("../util/utils");
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
            const tx = yield market.buyLicense(contractAddress, qty);
            return tx.wait();
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
}
exports.MarketNamespace = MarketNamespace;
