import { SynBioNetConfig } from './synbionet-config';
import { connectToBioTokenContract, connectToFactoryContract } from '../util/utils';

/**
 * The portfolio namespace contains all the functionality related account assets
 *
 * Do not call this constructor directly. Instead, instantiate an SynBioNet object
 * with `const synbionet = new SynBioNet(config)` and then access the portfolio namespace
 * via `synbionet.portfolio`.
 */
export class PortfolioNamespace {
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
    const tx = await bioToken.buy(qty, {
      value: await bioToken.calculateCost(qty),
    });
    return tx.wait();
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
      return tx.wait();
    } catch (err) {
      return err;
    }
  }

  /**
   * Returns biotoken balance for account
   * @param address - account of interest
   * @public
   */
  async getBioTokenBalance(address: string): Promise<any> {
    const provider = await this.config.getProvider();
    const bioToken = await connectToBioTokenContract(provider);
    return await bioToken.balanceOf(address);
  }

  /**
   * Creates new bioAsset
   * @param uri - tokenURI for new asset
   * @public
   */
  async createAsset(uri: string): Promise<any> {
    const provider = await this.config.getProvider();
    const signer = provider.getSigner();
    const factory = connectToFactoryContract(signer);
    const tx = await factory.createAsset(uri);
    tx.wait();

    // method queries the event to return the address of the mewly created contract
    const eventFilter = factory.filters.BioAssetCreated();
    const blockNum = await provider.getBlockNumber();
    const events = await factory.queryFilter(eventFilter, blockNum - 1, blockNum);
    return events[0].args ? events[0].args[0] : undefined;
  }
}
