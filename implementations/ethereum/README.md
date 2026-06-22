# Ethereum Implementation

This directory contains the Ethereum implementation materials associated with the original tourism DApp project.

The Ethereum part has been reorganized from an earlier Brownie-based setup into a Hardhat-based structure. This change is intended to make the implementation easier to compile, deploy locally, test, and document within the broader `blockchain-abstractions-study` repository.

## Purpose

This implementation is not intended to represent a production-ready decentralized application.

Its purpose is to preserve and organize practical implementation evidence from the original project while supporting a comparative study of blockchain platforms. In this repository, the Ethereum implementation is used to examine how an account-based smart contract platform handles application state, payments, contract deployment, and wallet-based user interaction.

The Ethereum section supports the study of:

* Solidity smart contract development;
* the EVM account-based execution model;
* local blockchain deployment with Hardhat;
* contract deployment and ownership transfer;
* payment and reservation logic;
* product marketplace logic;
* wallet-based transaction signing;
* future frontend-to-smart-contract interaction.

## Directory Structure

```text
ethereum/

├── contracts/
│   ├── MarcheProduits.sol
│   ├── TourReservations.sol
│   └── TokenTours.sol
├── scripts/
│   └── deploy.js
├── frontend/
│   └── .gitkeep
├── hardhat.config.js
├── package.json
└── README.md
```

## Main Components

### Smart Contracts

The `contracts/` directory contains the Solidity contracts used in the Ethereum implementation.

* `TokenTours.sol`: defines the token logic used by the reservation system.
* `TourReservations.sol`: manages tourism tour creation, reservation, and related payment logic.
* `MarcheProduits.sol`: manages tourism product creation, listing, purchase, and stock updates.

These contracts are kept as implementation evidence for the comparative analysis. They may require further testing and refinement before being considered suitable for production use.

### Deployment Script

The `scripts/deploy.js` file deploys the Ethereum contracts to a local Hardhat network.

The deployment process includes:

1. deploying the token contract;
2. deploying the tour reservation contract;
3. deploying the product marketplace contract;
4. transferring token ownership when required by the contract logic.

### Frontend Directory

The `frontend/` directory is intentionally empty at this stage.

It is reserved for a future React or Vite-based interface that will interact with the deployed contracts through MetaMask and ethers.js. The `.gitkeep` file is included only to preserve the empty directory in Git.

## Local Development

Install the project dependencies:

```bash
npm install
```

Compile the Solidity contracts:

```bash
npm run compile
```

Start a local Hardhat blockchain network:

```bash
npm run node
```

In a second terminal, deploy the contracts to the local network:

```bash
npm run deploy:local
```

The local Hardhat network usually exposes a JSON-RPC endpoint at:

```text
http://127.0.0.1:8545
```

The default local chain ID is usually:

```text
31337
```

## MetaMask Local Network

To interact with the local deployment through a wallet, MetaMask can be configured with the following local network settings:

```text
Network name: Hardhat Local
RPC URL: http://127.0.0.1:8545
Chain ID: 31337
Currency symbol: ETH
```

The private keys displayed by `npm run node` are development-only keys. They must never be used on public networks.

## Academic Context

This implementation belongs to the broader `blockchain-abstractions-study` repository, which studies blockchain abstractions across Ethereum, Solana, and EOSIO.

Within this comparative study, the Ethereum implementation is mainly used to illustrate:

* account-based state management;
* smart contract deployment on an EVM-compatible environment;
* explicit transaction signing through wallets;
* Solidity-based application logic;
* the relationship between on-chain state and off-chain user interfaces.

## Limitations

This implementation should be read as a structured academic and technical artifact, not as a complete commercial application.

Current limitations include:

* no completed frontend interface yet;
* limited automated testing;
* no production security audit;
* no formal verification;
* local deployment only at this stage;
* application logic inherited from the original practical project and subject to further review.

These limitations are intentional to state the scope of the implementation honestly and to separate practical evidence from production readiness.
