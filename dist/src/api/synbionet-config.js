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
exports.SynBioNetConfig = void 0;
const ethers_1 = require("ethers");
/**
 * This class holds the config information for the SynBioNet client instance and
 * exposes the underlying providers for more advanced use cases.
 *
 * @public
 */
class SynBioNetConfig {
    constructor(config) {
        this.ethereumClient = (config === null || config === void 0 ? void 0 : config.ethereumClient) || undefined;
        // 'http://127.0.0.1:8545' is default anvil node endpoint for local development and testing
        this.rpcUrl = (config === null || config === void 0 ? void 0 : config.url) || 'http://127.0.0.1:8545';
    }
    /**
     * Returns an ethers Provider instance.
     * @public
     */
    getProvider() {
        if (!this._baseSynBioNetProvider) {
            this._baseSynBioNetProvider = (() => __awaiter(this, void 0, void 0, function* () {
                if (this.ethereumClient)
                    return new ethers_1.ethers.providers.Web3Provider(this.ethereumClient);
                return new ethers_1.ethers.providers.JsonRpcProvider(this.rpcUrl);
            }))();
        }
        return this._baseSynBioNetProvider;
    }
}
exports.SynBioNetConfig = SynBioNetConfig;
