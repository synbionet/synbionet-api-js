import { SynBioNetSettings } from '../types/types';
import { SynBioNetConfig } from './synbionet-config';
import { CoreNamespace } from './core-namespace';
import { PortfolioNamespace } from './portfolio-namespace';
import { MarketNamespace } from './market-namespace';

/**
 * The SynBioNet client. This class is the main entry point into SynBioNet's
 * APIs and separates functionality into different namespaces.
 * @public
 */
export class SynBioNet {
  /**
   * The `core` namespace contains the core eth json-rpc calls
   */
  readonly core: CoreNamespace;

  /**
   * The `portfolio` namespace contains methods for user asset interaction.
   * */
  readonly portfolio: PortfolioNamespace;

  /**
   * The `market` namespace contains methods for market interaction
   */
  readonly market: MarketNamespace;

  /**
   * Holds the setting information for the instance of the SynBioNet Client
   * and allows access to the underlying providers.
   */
  readonly config: SynBioNetConfig;

  /**
   * Creats new SynBioNet instance
   * @param {string} [settings.ethereumClient] - user wallet client, required for webui
   * @param {Network} [settings.rpcUrl] - Hardcoded rpc node address, default value for testing
   * @public
   */
  constructor(settings?: SynBioNetSettings) {
    this.config = new SynBioNetConfig(settings);

    this.core = new CoreNamespace(this.config);
    this.portfolio = new PortfolioNamespace(this.config);
    this.market = new MarketNamespace(this.config);
  }

  /**
   * This requests to connect with a wallet client in the webui
   * @public
   */
  async requestAccounts(): Promise<any> {
    if (!this.config.ethereumClient) return undefined;
    const accounts = await this.config.ethereumClient.request({
      method: 'eth_requestAccounts',
    });
    if (!accounts) return undefined;
    return accounts[0];
  }
}
