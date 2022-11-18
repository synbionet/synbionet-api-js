/* eslint-disable @typescript-eslint/no-var-requires */
import { SynBioNet } from '../src';
import { ethers } from 'ethers';
import { BIOASSET_CONTRACT } from '../src/util/const';

// TODO: WAAAY more testing

describe('get blocknumber', () => {
  it(`get blockNumber on network`, async () => {
    const synbionet = new SynBioNet();
    const block = await synbionet.core.getBlockNumber();
    expect(block).toBeDefined();
  });
});

describe('Get uri', () => {
  it(`gets ip on network`, async () => {
    const synbionet = new SynBioNet();
    const ip = await synbionet.market.getURI(BIOASSET_CONTRACT.address);
    expect(ip).toBe('http://hello.there');
  });
});

describe('create IP', () => {
  it(`creates ip`, async () => {
    const synbionet = new SynBioNet();
    const newAsset = await synbionet.portfolio.createAsset('http://hello.there');
    expect(newAsset).toBeDefined();
  });
});

describe('get product', () => {
  it(`creates ip`, async () => {
    const synbionet = new SynBioNet();
    const product = await synbionet.market.getProduct(BIOASSET_CONTRACT.address);
    expect(product).toBeDefined();
  });
});

describe('buy tokens', () => {
  it(`buys tokens`, async () => {
    const synbionet = new SynBioNet();
    // pre-funded wallet address created when spinning up anvil node for local testing
    const deployerAddress = ethers.utils.computeAddress(
      '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
    );
    const startingBalance = await synbionet.portfolio.getBioTokenBalance(deployerAddress);
    await synbionet.market.buyBioTokens(6);
    const endingBalance = await synbionet.portfolio.getBioTokenBalance(deployerAddress);
    expect(endingBalance - startingBalance).toBe(6);
  });
});
