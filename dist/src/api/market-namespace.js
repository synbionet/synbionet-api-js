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
const utils_2 = require("ethers/lib/utils");
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
     * Buy BioTokens
     * @param qty - amt to buy
     * @public
     */
    buyBioTokens(qty) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = yield this.config.getProvider();
            const signer = provider.getSigner();
            const bioToken = (0, utils_1.connectToBioTokenContract)(signer);
            // add value to transaction at rate of 0.001 eth per token
            const tx = yield bioToken.buy(qty, {
                value: (0, utils_2.parseEther)((0.001 * qty).toString()),
            });
            tx.wait();
            return true;
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
                tx.wait();
                return true;
            }
            catch (err) {
                return err;
            }
        });
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
            const product = yield market.getProduct(contractAddress);
            return {
                licensePrice: product.licensePrice.toString(),
                ipForSale: product.ipForSale,
                ipPrice: product.licensePrice.toString(),
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
}
exports.MarketNamespace = MarketNamespace;
