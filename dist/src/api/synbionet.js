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
exports.SynBioNet = void 0;
const synbionet_config_1 = require("./synbionet-config");
const core_1 = require("./core");
const portfolio_1 = require("./portfolio");
const market_1 = require("./market");
/**
 * The SynBioNet client. This class is the main entry point into SynBioNet's
 * APIs and separates functionality into different namespaces.
 * @public
 */
class SynBioNet {
    /**
     * Creats new SynBioNet instance
     * @param {string} [settings.ethereumClient] - user wallet client, required for webui
     * @param {Network} [settings.rpcUrl] - Hardcoded rpc node address, default value for testing
     * @public
     */
    constructor(settings) {
        this.config = new synbionet_config_1.SynBioNetConfig(settings);
        this.core = new core_1.CoreNamespace(this.config);
        this.portfolio = new portfolio_1.PortfolioNamespace(this.config);
        this.market = new market_1.MarketNamespace(this.config);
    }
    /**
     * This requests to connect with a wallet client in the webui
     * @public
     */
    requestAccounts() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.config.ethereumClient)
                return undefined;
            const accounts = yield this.config.ethereumClient.request({
                method: 'eth_requestAccounts',
            });
            if (!accounts)
                return undefined;
            return accounts[0];
        });
    }
}
exports.SynBioNet = SynBioNet;
