import { SynBioNetConfig } from './synbionet-config';
import {
  connectToBioAssetContract,
  connectToBioTokenContract,
  connectToMarketContract,
} from '../util/utils';
import { MARKET_CONTRACT } from '../util/const';
// import request from 'supertest';
import { INDEXER_URL } from '../util/const';
import * as request from 'superagent';

/**
 * The market namespace contains all the functionality related to the synbionet market
 *
 * Do not call this constructor directly. Instead, instantiate an SynBioNet object
 * with `const synbionet = new SynBioNet(config)` and then access the market namespace
 * via `synbionet.market`.
 */
export class MarketNamespace {
  /** @internal */
  constructor(private readonly config: SynBioNetConfig) {}

  /**
   * Return specific bioasset market details
   * @param contractAddress - address of bioasset contract
   * @public
   */
  async getProduct(contractAddress: string): Promise<any> {
    const provider = await this.config.getProvider();
    const market = connectToMarketContract(provider);
    const bioAsset = connectToBioAssetContract(contractAddress, provider);
    const responses = await Promise.all([
      await market.getProduct(contractAddress),
      await bioAsset.availableLicenses(),
      await bioAsset.owner(),
      await bioAsset.uri(1),
    ]);
    const [productInfo, availableLicenses, owner, uri] = responses;
    // const product = await market.getProduct(contractAddress);
    return {
      // toString method is called because contracts return Big Numbers
      owner,
      uri,
      availableLicenses: availableLicenses.toString(),
      licensePrice: productInfo.licensePrice.toString(),
      ipForSale: productInfo.ipForSale,
      ipPrice: productInfo.ipPrice.toString(),
    };
  }

  /**
   * returns uri for a specific bioasset
   * @param contractAddress - address of bioasset contract
   * @public
   */
  async getURI(contractAddress: string): Promise<any> {
    const provider = await this.config.getProvider();
    const bioAsset = connectToBioAssetContract(contractAddress, provider);
    return await bioAsset.uri(1);
  }

  async registerAssetOnMarket(
    bioAssetContractAddress: string,
    licenseQty: number,
    licensePrice: number,
    isIPForSale: boolean,
    ipPrice: number
  ): Promise<any> {
    const provider = await this.config.getProvider();
    const signer = provider.getSigner();
    const bioAsset = connectToBioAssetContract(bioAssetContractAddress, signer);
    const tx = await bioAsset.registerWithMarket(licenseQty, licensePrice, isIPForSale, ipPrice);
    return tx.wait();
  }

  async updateAssetOnMarket(
    bioAssetContractAddress: string,
    licensePrice: number,
    isIPForSale: boolean,
    ipPrice: number
  ): Promise<any> {
    const provider = await this.config.getProvider();
    const signer = provider.getSigner();
    const bioAsset = connectToBioAssetContract(bioAssetContractAddress, signer);
    const tx = await bioAsset.updateWithMarket(licensePrice, isIPForSale, ipPrice);
    return tx.wait();
  }

  async buyLicense(contractAddress: string, qty: number): Promise<any> {
    const provider = await this.config.getProvider();
    const signer = provider.getSigner();
    const market = connectToMarketContract(signer);
    const { licensePrice } = await market.getProduct(contractAddress);
    const bioToken = connectToBioTokenContract(signer);
    const tx0 = await bioToken.approve(MARKET_CONTRACT.address, licensePrice.mul(qty));
    await tx0.wait();
    const tx1 = await market.buyLicense(contractAddress, qty);
    return tx1.wait();
  }

  async balanceOfLicense(contractAddress: string, walletAddress: string): Promise<any> {
    const provider = await this.config.getProvider();
    const bioAsset = connectToBioAssetContract(contractAddress, provider);
    const balance = await bioAsset.balanceOf(walletAddress, await bioAsset.LICENSE());
    return balance.toString();
  }

  async buyAsset(contractAddress: string): Promise<any> {
    const provider = await this.config.getProvider();
    const signer = provider.getSigner();
    const market = connectToMarketContract(signer);
    const tx = await market.buyAsset(contractAddress);
    return tx.wait();
  }

  async getAllBioAssets(): Promise<any> {
    const resp = await get('/assets');
    if (resp.status === 200) return resp.body;
    return undefined;
  }

  async getBioAssetById(did: string): Promise<any> {
    const resp = await get(`/asset/${did}`);
    if (resp.status === 200) return resp.body;
    return undefined;
  }
}

async function get(path: string): Promise<any> {
  return await request.get(`${INDEXER_URL}${path}`).set('Accept', 'application/json');
}
