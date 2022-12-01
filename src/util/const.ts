import BioAsset from '@synbionet/contracts/artifacts/bioasset.json';
import BioToken from '@synbionet/contracts/artifacts/biotoken.json';
import Factory from '@synbionet/contracts/artifacts/factory.json';
import Market from '@synbionet/contracts/artifacts/nofeemarket.json';

export const MARKET_CONTRACT = {
  address: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
  abi: Market.abi,
};

export const FACTORY_CONTRACT = {
  address: '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0',
  abi: Factory.abi,
};

export const BIOTOKEN_CONTRACT = {
  address: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
  abi: BioToken.abi,
};

export const BIOASSET_CONTRACT = {
  address: '0x75537828f2ce51be7289709686a69cbfdbb714f1',
  abi: BioAsset.abi,
};

export const INDEXER_URL = 'http://127.0.0.1:8081';
export const DID_PREFIX = 'did:synbio';
