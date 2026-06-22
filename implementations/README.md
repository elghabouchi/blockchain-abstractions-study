# Implementations

This directory contains platform-specific implementation materials related to the original practical project and its academic restructuring.

The implementations are organized by blockchain platform and are used as practical evidence for the comparative study developed in the main documentation.

The purpose of this directory is not to present production-ready applications. Instead, it preserves and organizes implementation artifacts that support the analysis of blockchain architectures, account models, transaction validation, storage choices, and security assumptions.

## Directory Overview

```text
implementations/
├── ethereum/      # Solidity-based implementation materials
├── solana/        # Rust and Anchor-based implementation materials
└── eosio/         # EOSIO CDT-based implementation materials
```

## Platform Implementations

### Ethereum

The `ethereum/` directory is intended to contain the Solidity-based implementation materials, smart contract interaction notes, frontend integration notes, and security observations related to the Ethereum version of the tourism DApp prototype.

Status: documentation to be completed.

Reference:

* [Ethereum implementation README](./ethereum/README.md)

### Solana

The `solana/` directory contains the Rust and Anchor-based implementation of the tourism DApp prototype.

This implementation documents:

* Solana account-based execution;
* Program Derived Accounts;
* wallet-based transaction signing;
* hybrid on-chain/off-chain storage using IPFS CIDs;
* purchase-history account creation;
* implementation-level security assumptions.

The Solana implementation is currently the most structured implementation directory in this repository. Its README describes the current prototype state, while its security notes document known limitations and future improvements.

References:

* [Solana implementation README](./solana/README.md)
* [Solana security notes](./solana/SECURITY-NOTES.md)

### EOSIO

The `eosio/` directory is intended to contain the EOSIO CDT-based implementation materials, including smart contract deployment notes, account and permission configuration, transaction interaction notes, and platform-specific observations.

Status: documentation to be completed.

Reference:

* [EOSIO implementation README](./eosio/README.md)

## Role in the Main Study

These implementations support the academic study by providing concrete material for comparing:

* smart contract and program models;
* account and state representations;
* transaction construction and signing;
* execution and validation assumptions;
* on-chain and off-chain storage decisions;
* platform-specific development constraints;
* basic security limitations.

The implementation directories should be read together with the conceptual documents in `docs/` and the academic notes in `academic-notes/`.

## Documentation Status

The current repository is being developed progressively.

At this stage:

* the Solana implementation has an initial structured README and security notes;
* the Ethereum implementation still requires a dedicated README and security notes;
* the EOSIO implementation still requires a dedicated README and security notes.

This staged documentation process is intentional. The goal is to preserve the original practical project while gradually reorganizing it into a clearer academic repository.

## Notes

The implementations are not presented as audited or production-ready systems.

They should be interpreted as prototype evidence derived from a practical final-year project and reused here to support architectural comparison and security-oriented discussion.
