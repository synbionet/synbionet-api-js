import { SynBioNetConfig } from './synbionet-config';
import { connectToBioTokenContract, connectToFactoryContract } from '../util/utils';
import { ethers } from 'ethers';
import { INDEXER_URL, DID_PREFIX } from '../util/const';
import axios from 'axios';

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
   * @public
   */
  async createAsset(
    name: string,
    desc: string,
    license: string,
    serviceEndpoint: string
  ): Promise<any> {
    const provider = await this.config.getProvider();
    const signer = provider.getSigner();
    const factory = connectToFactoryContract(signer);
    const gasEstimate = await factory.estimateGas.createAsset('arbitrary_value');
    const inflatedGasEstimate = gasEstimate.add(gasEstimate.div(5)); // inflatedGasEstimate is 120% of gas estimate
    const signerBalance = await provider.getBalance(await signer.getAddress());

    // check if wallet has at least 120% of gas estimate to deploy contract before saving metadata to arweave
    // TODO: proper error handling
    if (signerBalance.lt(inflatedGasEstimate))
      return console.error('Not enough funds in wallet to pay for gas. Asset not created.');

    const bioAssetAddress = await factory.callStatic.createAsset('arbitrary_value');
    const meta = createMetaData(
      name,
      desc,
      license,
      bioAssetAddress,
      serviceEndpoint,
      await signer.getChainId()
    );
    const resp = await axios.post(`${INDEXER_URL}/asset`, meta);

    if (resp.status !== 200)
      return console.error(
        'Error publishing metadata to decentralized storage. Asset not created.'
      );

    const tokenURI = `${INDEXER_URL}/${meta.did}`;
    const tx = await factory.createAsset(tokenURI);
    await tx.wait();
    return bioAssetAddress;
  }
}

// ****** Helpers ******

/**
 * Interim format for Asset Metadata. This format is used for the indexer
 * cache and for storage in Arweave
 */
export interface AssetMetaData {
  // decentralized identifier based on keccak256(nftAddress+chainid)
  did: string;
  // name of asset
  name: string;
  // short description
  description: string;
  // license INDEXER_URL
  license: string;
  // ethereum address of the nft
  nftAddress: string;
  // optional, erc-20 address
  tokenAddress?: string;
  // url to the endpoint providing the service
  serviceEndpoint: string;
}

/**
 * Create an Asset
 * @param name
 * @param desc
 * @param license
 * @param nftAddress
 * @param chainid
 * @returns {AssetMetaData}
 */
function createMetaData(
  name: string,
  desc: string,
  license: string,
  nftAddress: string,
  serviceEndpoint: string,
  chainid: number
): AssetMetaData {
  return {
    did: generateDid(nftAddress, chainid),
    name: name,
    description: desc,
    license: license,
    nftAddress: nftAddress,
    tokenAddress: '0xExampleAddress',
    serviceEndpoint: serviceEndpoint,
  };
}

/**
 * Generate a decentralized identifier from the contract
 * address and chain id.
 *
 * @param {String} address the address of the contract
 * @param {Number} chainId the chain id for the ethereum network
 * @returns {String} the DID
 */
function generateDid(nftAddress: string, chainId: number): string {
  const did_value = ethers.utils.id(nftAddress + chainId);
  return `${DID_PREFIX}:${did_value}`;
}

// async function post(path: string, data: any): Promise<request.Response> {
//   const resp = await request(INDEXER_URL).post(path).set('Accept', 'application/json').send(data);
//   return resp;
// }
