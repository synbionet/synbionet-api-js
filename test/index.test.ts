/* eslint-disable @typescript-eslint/no-var-requires */
import { SynBioNet } from '../src';
import { ethers } from 'ethers';
import { BIOASSET_CONTRACT } from '../src/util/const';

let newIPAssetAddress = '';

// pre-funded wallet address created when spinning up anvil node for local testing
// used by default with creating new instance of SynBioNet without passing a wallet client
const deployerAddress = ethers.utils.computeAddress(
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
);

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

describe('create IP, register with market, and get product', () => {
  it(`creates ip, registers with market, market returns product data`, async () => {
    const synbionet = new SynBioNet();

    newIPAssetAddress = await synbionet.portfolio.createAsset(
      'example name',
      'example desc',
      'http://example.license',
      'http://example.serviceEndpoint'
    );
    await synbionet.market.registerAssetOnMarket(newIPAssetAddress, 10, 7, false, 25);

    const newProduct = await synbionet.market.getProduct(newIPAssetAddress);
    expect(newProduct.owner).toBe(deployerAddress);
    expect(newProduct.ipPrice).toBe('25');
    expect(newProduct.availableLicenses).toBe('10');
    expect(newProduct.ipForSale).toBe(false);
    expect(newProduct.licensePrice).toBe('7');
    // expect(newProduct.uri).toBe('http://hi.there');
  });
});

describe('gets all assets', () => {
  it('creates an asset and returns all assets including new one', async () => {
    const synbionet = new SynBioNet();
    const originalAssets = await synbionet.market.getAllBioAssets();
    await synbionet.portfolio.createAsset(
      'example name',
      'example desc',
      'http://example.license',
      'http://example.serviceEndpoint'
    );
    const newAssets = await synbionet.market.getAllBioAssets();
    expect(newAssets.length - originalAssets.length).toBe(1);
  });
});

describe('gets specific asset', () => {
  it('returns asset details', async () => {
    const synbionet = new SynBioNet();
    const assetList = await synbionet.market.getAllBioAssets();
    const latestAsset = assetList[assetList.length - 1];
    const assetDetails = await synbionet.market.getBioAssetById(latestAsset.did);
    console.log(assetDetails);
  });
});

describe('update product', () => {
  it('updates product info on market', async () => {
    const synbionet = new SynBioNet();
    await synbionet.market.updateAssetOnMarket(newIPAssetAddress, 3, true, 2);

    const newProduct = await synbionet.market.getProduct(newIPAssetAddress);
    expect(newProduct.owner).toBe(deployerAddress);
    expect(newProduct.licensePrice).toBe('3');
    expect(newProduct.ipForSale).toBe(true);
    expect(newProduct.ipPrice).toBe('2');
  });
});

describe('get sublicense balance', () => {
  it('gets sublicense balance', async () => {
    const synbionet = new SynBioNet();
    const licenseBalance = await synbionet.market.balanceOfLicense(
      newIPAssetAddress,
      deployerAddress
    );
    expect(licenseBalance).toBe('10');
  });
});

describe('buy tokens', () => {
  it(`buys tokens`, async () => {
    const synbionet = new SynBioNet();
    const startingBalance = await synbionet.portfolio.getBioTokenBalance(deployerAddress);
    await synbionet.portfolio.buyBioTokens(6);
    const endingBalance = await synbionet.portfolio.getBioTokenBalance(deployerAddress);
    expect(endingBalance - startingBalance).toBe(6);
  });
});

describe('withdraw tokens', () => {
  it(`withdraws tokens`, async () => {
    const synbionet = new SynBioNet();

    const startingBalance = await synbionet.portfolio.getBioTokenBalance(deployerAddress);
    await synbionet.portfolio.withdrawBioTokens(6);
    const endingBalance = await synbionet.portfolio.getBioTokenBalance(deployerAddress);
    expect(endingBalance - startingBalance).toBe(-6);
  });
});

// TODO: buyLicense and buyAsset tests
