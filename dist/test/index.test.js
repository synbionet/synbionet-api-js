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
/* eslint-disable @typescript-eslint/no-var-requires */
const src_1 = require("../src");
const ethers_1 = require("ethers");
const const_1 = require("../src/util/const");
// TODO: WAAAY more testing
describe('get blocknumber', () => {
    it(`get blockNumber on network`, () => __awaiter(void 0, void 0, void 0, function* () {
        const synbionet = new src_1.SynBioNet();
        const block = yield synbionet.core.getBlockNumber();
        expect(block).toBeDefined();
    }));
});
describe('Get uri', () => {
    it(`gets ip on network`, () => __awaiter(void 0, void 0, void 0, function* () {
        const synbionet = new src_1.SynBioNet();
        const ip = yield synbionet.market.getURI(const_1.BIOASSET_CONTRACT.address);
        expect(ip).toBe('http://hello.there');
    }));
});
describe('create IP', () => {
    it(`creates ip`, () => __awaiter(void 0, void 0, void 0, function* () {
        const synbionet = new src_1.SynBioNet();
        const newAsset = yield synbionet.portfolio.createAsset('http://hello.there');
        expect(newAsset).toBeDefined();
    }));
});
describe('get product', () => {
    it(`creates ip`, () => __awaiter(void 0, void 0, void 0, function* () {
        const synbionet = new src_1.SynBioNet();
        const product = yield synbionet.market.getProduct(const_1.BIOASSET_CONTRACT.address);
        expect(product).toBeDefined();
    }));
});
describe('buy tokens', () => {
    it(`buys tokens`, () => __awaiter(void 0, void 0, void 0, function* () {
        const synbionet = new src_1.SynBioNet();
        // pre-funded wallet address created when spinning up anvil node for local testing
        const deployerAddress = ethers_1.ethers.utils.computeAddress('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80');
        const startingBalance = yield synbionet.portfolio.getBioTokenBalance(deployerAddress);
        yield synbionet.market.buyBioTokens(6);
        const endingBalance = yield synbionet.portfolio.getBioTokenBalance(deployerAddress);
        expect(endingBalance - startingBalance).toBe(6);
    }));
});
