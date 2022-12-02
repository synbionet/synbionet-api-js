# SynBioNet API

An api wrapper for synbionet based on ethers.

### Test:

1. run `docker build -t anvil_node .` to build ethereum test node docker image

2. after image build completes, run test node with `docker run -d -p 8545:8545 anvil_node`

   **_allow a few seconds for contracts to deploy before testing api, otherwise contract addresses my be impacted_**

3. Launch the indexer from the synbionet-indexer repo by navigating to the project folder andusing 'make run'.

   **_will add this step to docker build in future_**

4. run `npm install && npm update` to install/update dependencies

5. run `npm run test` to test

6. run `npx tsc` to compile typescript to be used by synbionet-webui

### TODO:

- Add appropriate interfaces and return types for methods
- Much more testing
- implement remaining methods to interact with core contracts
- try/catch and tx.wait() in all methods?
- add commonly-used provider methods to core namespace
- organize methods intuitively in namespaces
