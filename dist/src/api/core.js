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
exports.CoreNamespace = void 0;
/**
 * The core namespace contains all commonly-used ethers provider methods.
 *
 * Do not call this constructor directly. Instead, instantiate an SynBioNet object
 * with `const synbionet = new SynBioNet(config)` and then access the core namespace
 * via `synbionet.core`.
 */
class CoreNamespace {
    /** @internal */
    constructor(config) {
        this.config = config;
    }
    /**
     * Returns the block number of the most recently mined block.
     *
     * @public
     */
    getBlockNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = yield this.config.getProvider();
            return provider.getBlockNumber();
        });
    }
    /**
     * Returns the number of transactions ever sent from the provided address, as
     * of the provided block tag. This value is used as the nonce for the next
     * transaction from the address sent to the network.
     *
     * @param addressOrName The address or name of the account to get the nonce for.
     * @param blockTag The optional block number or hash to get the nonce for.
     * @public
     */
    getTransactionCount(addressOrName, blockTag) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = yield this.config.getProvider();
            return provider.getTransactionCount(addressOrName, blockTag);
        });
    }
}
exports.CoreNamespace = CoreNamespace;
