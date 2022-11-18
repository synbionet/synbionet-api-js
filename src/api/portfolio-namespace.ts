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
    return await factory.createAsset(uri);
  }
}
