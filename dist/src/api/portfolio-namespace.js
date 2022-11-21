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
exports.PortfolioNamespace = void 0;
const utils_1 = require("../util/utils");
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
     * @param uri - tokenURI for new asset
     * @public
     */
    createAsset(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = yield this.config.getProvider();
            const signer = provider.getSigner();
            const factory = (0, utils_1.connectToFactoryContract)(signer);
            return yield factory.createAsset(uri);
        });
    }
}
exports.PortfolioNamespace = PortfolioNamespace;
