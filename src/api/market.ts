import { SynBioNetConfig } from './synbionet-config';
import {
  connectToBioAssetContract,
  connectToBioTokenContract,
  connectToMarketContract,
} from '../util/utils';
import { parseEther } from 'ethers/lib/utils';

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
   * Buy BioTokens
   * @param qty - amt to buy
   * @public
   */
  async buyBioTokens(qty: number): Promise<any> {
    const provider = await this.config.getProvider();
    const signer = provider.getSigner();
    const bioToken = connectToBioTokenContract(signer);
    // add value to transaction at rate of 0.001 eth per token
    const tx = await bioToken.buy(qty, {
      value: parseEther((0.001 * qty).toString()),
    });
    tx.wait();
    return true;
  }

  /**
   * Withdraw biotokens
   * @param qty
   * @public
   */
  async withdrawBioTokens(qty: number): Promise<any> {
    const provider = await this.config.getProvider();
    const signer = provider.getSigner();
    const bioToken = connectToBioTokenContract(signer);
    try {
      const tx = await bioToken.withdraw(qty);
      tx.wait();
      return true;
    } catch (err) {
      return err;
    }
  }

  /**
   * Return specific bioasset market details
   * @param contractAddress - address of bioasset contract
   * @public
   */
  async getProduct(contractAddress: string): Promise<any> {
    const provider = await this.config.getProvider();
    const market = connectToMarketContract(provider);
    const product = await market.getProduct(contractAddress);
    return {
      licensePrice: product.licensePrice.toString(),
      ipForSale: product.ipForSale,
      ipPrice: product.licensePrice.toString(),
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
}
