# SynBioNet API

An api wrapper for synbionet based on ethers.

### Test:

**_must have foundary installed to spin up local anvil node_**

1. run `anvil` to spin up dev ethereum node. Follow instructions in synbionet-core README to test contracts are working first.

2. From top level of synbionet-core project directory run `forge script script/Bionet.s.sol:BionetScript --fork-url http://localhost:8545 --broadcast` to deploy contracts. Confirm that the addresses output in the console correspond to the addresses in src/util/const.ts in this (API) project. If this script is run right after anvil is started, you shouldn't have to make any changes.

3. In this (API) project folder, run `npm install` to install dependencies

4. Run `npm run test` to test

5. run `npx tsc` to compile typescript to be used by synbionet-webui

### TODO:

- Add appropriate interfaces and return types for methods
- Much more testing
- implement remaining methods to interact with core contracts
- try/catch and tx.wait() in all methods?
- add commonly-used provider methods to core namespace
- organize methods intuitively in namespaces
