import { SynBioNetSettings } from '../types/types';
import { ethers } from 'ethers';

/**
 * This class holds the config information for the SynBioNet client instance and
 * exposes the underlying providers for more advanced use cases.
 *
 * @public
 */
export class SynBioNetConfig {
  /**
   * user wallet client. metamask or brave wallet. passed in as window.ethereum
   */
  readonly ethereumClient: any;

  /**
   * The optional hardcoded URL to send requests
   */
  readonly rpcUrl?: string;

  /**
   * Dynamically imported provider instance.
   * @internal
   */
  private _baseSynBioNetProvider:
    | Promise<ethers.providers.Web3Provider>
    | Promise<ethers.providers.JsonRpcProvider>
    | undefined;

  constructor(config?: SynBioNetSettings) {
    this.ethereumClient = config?.ethereumClient || undefined;
    // 'http://127.0.0.1:8545' is default anvil node endpoint for local development and testing
    this.rpcUrl = config?.url || 'http://127.0.0.1:8545';
  }

  /**
   * Returns an ethers Provider instance.
   * @public
   */
  getProvider():
    | Promise<ethers.providers.JsonRpcProvider>
    | Promise<ethers.providers.Web3Provider> {
    if (!this._baseSynBioNetProvider) {
      this._baseSynBioNetProvider = (async (): Promise<any> => {
        if (this.ethereumClient) return new ethers.providers.Web3Provider(this.ethereumClient);
        return new ethers.providers.JsonRpcProvider(this.rpcUrl);
      })();
    }
    return this._baseSynBioNetProvider;
  }
}
