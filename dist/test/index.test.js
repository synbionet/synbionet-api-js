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
let newIPAssetAddress = '';
// pre-funded wallet address created when spinning up anvil node for local testing
// used by default with creating new instance of SynBioNet without passing a wallet client
const deployerAddress = ethers_1.ethers.utils.computeAddress('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80');
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
describe('create IP, register with market, and get product', () => {
    it(`creates ip, registers with market, market returns product data`, () => __awaiter(void 0, void 0, void 0, function* () {
        const synbionet = new src_1.SynBioNet();
        newIPAssetAddress = yield synbionet.portfolio.createAsset('http://hi.there');
        yield synbionet.market.registerAssetOnMarket(newIPAssetAddress, 10, 7, false, 25);
        const newProduct = yield synbionet.market.getProduct(newIPAssetAddress);
        expect(newProduct.owner).toBe(deployerAddress);
        expect(newProduct.ipPrice).toBe('25');
        expect(newProduct.availableLicenses).toBe('10');
        expect(newProduct.ipForSale).toBe(false);
        expect(newProduct.licensePrice).toBe('7');
        expect(newProduct.uri).toBe('http://hi.there');
    }));
});
describe('update product', () => {
    it('updates product info on market', () => __awaiter(void 0, void 0, void 0, function* () {
        const synbionet = new src_1.SynBioNet();
        yield synbionet.market.updateAssetOnMarket(newIPAssetAddress, 3, true, 2);
        const newProduct = yield synbionet.market.getProduct(newIPAssetAddress);
        expect(newProduct.owner).toBe(deployerAddress);
        expect(newProduct.licensePrice).toBe('3');
        expect(newProduct.ipForSale).toBe(true);
        expect(newProduct.ipPrice).toBe('2');
    }));
});
describe('get sublicense balance', () => {
    it('gets sublicense balance', () => __awaiter(void 0, void 0, void 0, function* () {
        const synbionet = new src_1.SynBioNet();
        const licenseBalance = yield synbionet.market.balanceOfLicense(newIPAssetAddress, deployerAddress);
        expect(licenseBalance).toBe('10');
    }));
});
describe('buy tokens', () => {
    it(`buys tokens`, () => __awaiter(void 0, void 0, void 0, function* () {
        const synbionet = new src_1.SynBioNet();
        const startingBalance = yield synbionet.portfolio.getBioTokenBalance(deployerAddress);
        yield synbionet.portfolio.buyBioTokens(6);
        const endingBalance = yield synbionet.portfolio.getBioTokenBalance(deployerAddress);
        expect(endingBalance - startingBalance).toBe(6);
    }));
});
describe('withdraw tokens', () => {
    it(`withdraws tokens`, () => __awaiter(void 0, void 0, void 0, function* () {
        const synbionet = new src_1.SynBioNet();
        const startingBalance = yield synbionet.portfolio.getBioTokenBalance(deployerAddress);
        yield synbionet.portfolio.withdrawBioTokens(6);
        const endingBalance = yield synbionet.portfolio.getBioTokenBalance(deployerAddress);
        expect(endingBalance - startingBalance).toBe(-6);
    }));
});
// TODO: buyLicense and buyAsset tests
