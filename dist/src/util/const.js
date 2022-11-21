"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BIOASSET_CONTRACT = exports.BIOTOKEN_CONTRACT = exports.FACTORY_CONTRACT = exports.MARKET_CONTRACT = void 0;
const bioasset_json_1 = __importDefault(require("@synbionet/contracts/artifacts/bioasset.json"));
const biotoken_json_1 = __importDefault(require("@synbionet/contracts/artifacts/biotoken.json"));
const factory_json_1 = __importDefault(require("@synbionet/contracts/artifacts/factory.json"));
const nofeemarket_json_1 = __importDefault(require("@synbionet/contracts/artifacts/nofeemarket.json"));
exports.MARKET_CONTRACT = {
    address: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
    abi: nofeemarket_json_1.default.abi,
};
exports.FACTORY_CONTRACT = {
    address: '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0',
    abi: factory_json_1.default.abi,
};
exports.BIOTOKEN_CONTRACT = {
    address: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
    abi: biotoken_json_1.default.abi,
};
exports.BIOASSET_CONTRACT = {
    address: '0x75537828f2ce51be7289709686a69cbfdbb714f1',
    abi: bioasset_json_1.default.abi,
};
