# Implementations

This directory contains the platform-specific implementation materials used in this repository.

The implementations come from the original practical project on blockchain applications in the tourism domain. In this repository, they are reorganized as supporting material for a comparative academic study of blockchain architectures, storage models, transaction validation, and security assumptions.

These implementations are not presented as production-ready applications. They are included as prototype evidence that helps connect the conceptual analysis with concrete development experience.

## Directory Structure

```text
implementations/
├── ethereum/      # Solidity-based implementation materials
├── solana/        # Rust and Anchor-based implementation materials
└── eosio/         # EOSIO CDT-based implementation materials
```

## Platform Overview

### Ethereum

The `ethereum/` directory is reserved for the Solidity-based implementation.

It is intended to document smart contracts, local deployment, frontend interaction, wallet-based transaction signing, and Ethereum-specific observations related to the tourism DApp prototype.

Status: documentation to be completed.

Reference:

* [Ethereum implementation README](./ethereum/README.md)

### Solana

The `solana/` directory contains the Rust and Anchor-based implementation of the tourism DApp prototype.

It currently documents:

* Solana account-based execution;
* Program Derived Accounts;
* wallet-based transaction signing;
* hybrid on-chain/off-chain storage using IPFS CIDs;
* purchase-history account creation;
* prototype-level security assumptions and limitations.

The Solana implementation currently has the most developed documentation in this directory. Its README describes the implementation state, while its security notes document known limitations and future improvement points.

References:

* [Solana implementation README](./solana/README.md)
* [Solana security notes](./solana/SECURITY-NOTES.md)

### EOSIO

The `eosio/` directory is reserved for the EOSIO CDT-based implementation.

It is intended to document contract deployment, account and permission configuration, command-line interaction, transaction execution, and EOSIO-specific development observations.

Status: documentation to be completed.

Reference:

* [EOSIO implementation README](./eosio/README.md)

## Role in the Study

The implementation directories support the broader academic study by providing concrete material for comparing:

* smart contract and program models;
* account and state representations;
* transaction construction and signing;
* validation and execution assumptions;
* on-chain and off-chain storage decisions;
* platform-specific development constraints;
* basic security limitations.

These materials should be read together with the conceptual documents in `docs/` and the academic notes in `academic-notes/`.

## Documentation Status

The repository is being documented progressively.

Current status:

* Solana has an initial structured README and security notes.
* Ethereum still requires a dedicated implementation README and security notes.
* EOSIO still requires a dedicated implementation README and security notes.

This staged process is intentional. The goal is to preserve the original practical work while gradually reorganizing it into a clearer academic repository.

## Note

The implementations are prototype materials derived from a final-year practical project.

They should be interpreted as implementation evidence for architectural comparison and security-oriented discussion, not as audited or production-ready systems.
