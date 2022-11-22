"use strict";
/** This is the main entry point for the library and exports user-facing API. */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketNamespace = exports.PortfolioNamespace = exports.CoreNamespace = exports.SynBioNet = void 0;
__exportStar(require("./types/types"), exports);
var synbionet_1 = require("./api/synbionet");
Object.defineProperty(exports, "SynBioNet", { enumerable: true, get: function () { return synbionet_1.SynBioNet; } });
var core_1 = require("./api/core");
Object.defineProperty(exports, "CoreNamespace", { enumerable: true, get: function () { return core_1.CoreNamespace; } });
var portfolio_1 = require("./api/portfolio");
Object.defineProperty(exports, "PortfolioNamespace", { enumerable: true, get: function () { return portfolio_1.PortfolioNamespace; } });
var market_1 = require("./api/market");
Object.defineProperty(exports, "MarketNamespace", { enumerable: true, get: function () { return market_1.MarketNamespace; } });
