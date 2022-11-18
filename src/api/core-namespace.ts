import { SynBioNetConfig } from './synbionet-config';

/**
 * The core namespace contains all commonly-used ethers provider methods.
 *
 * Do not call this constructor directly. Instead, instantiate an SynBioNet object
 * with `const synbionet = new SynBioNet(config)` and then access the core namespace
 * via `synbionet.core`.
 */

export class CoreNamespace {
  /** @internal */
  constructor(private readonly config: SynBioNetConfig) {}

  /**
   * Returns the block number of the most recently mined block.
   *
   * @public
   */
  async getBlockNumber(): Promise<number> {
    const provider = await this.config.getProvider();
    return provider.getBlockNumber();
  }

  /**
   * Returns the number of transactions ever sent from the provided address, as
   * of the provided block tag. This value is used as the nonce for the next
   * transaction from the address sent to the network.
   *
   * @param addressOrName The address or name of the account to get the nonce for.
   * @param blockTag The optional block number or hash to get the nonce for.
   * @public
   */
  async getTransactionCount(
    addressOrName: string | Promise<string>,
    blockTag?: string | number | Promise<string | number>
  ): Promise<number> {
    const provider = await this.config.getProvider();
    return provider.getTransactionCount(addressOrName, blockTag);
  }
}
