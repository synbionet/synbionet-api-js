FROM ubuntu:latest
RUN apt update
RUN apt install -y git curl

ENV PATH /usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/root/.foundry/bin

WORKDIR /root/

# if behind a proxy, may need to install appropriate certs here

RUN curl -L https://foundry.paradigm.xyz | bash
RUN ~/.foundry/bin/foundryup

RUN git clone https://github.com/synbionet/synbionet-core.git

WORKDIR /root/synbionet-core
ADD docker_artifacts/solc-0.8.16-linux .

RUN printf "\nsolc = \"/root/synbionet-core/solc-0.8.16-linux\"" >> foundry.toml

RUN forge install

# Runs `forge script` against the anvil chain to set up contracts
ENV INIT_SCRIPTS='forge script script/Bionet.s.sol:BionetScript --fork-url http://0.0.0.0:8545 --broadcast'
 
# Command to start the anvil service
ENV ANVIL_START='anvil --host 0.0.0.0'

# Execute the scripts after the anvil service is started
CMD (sleep 3 && $INIT_SCRIPTS) & $ANVIL_START
