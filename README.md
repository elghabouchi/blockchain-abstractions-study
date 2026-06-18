# Blockchain Abstractions Study

An academic repository focused on the study of blockchain and distributed ledger abstractions through comparative implementations across Solana, Ethereum, and EOSIO.

This repository is based on my undergraduate final-year project and reorganized as a research-oriented study of distributed ledger systems, blockchain architectures, smart contract execution models, and on-chain/off-chain storage strategies.

## Objective

The objective of this repository is to understand how blockchain systems provide core distributed ledger properties such as decentralized trust, transaction validation, auditability, immutability, and programmable execution.

The project does not focus only on building decentralized applications. Instead, it studies how different blockchain platforms implement similar system-level concepts through different architectural choices.

The main goals are to:

* Compare distributed ledger architectures across multiple blockchain platforms
* Study smart contract execution models
* Analyze consensus-based transaction validation
* Explore on-chain and off-chain storage strategies
* Understand blockchain platform trade-offs
* Document technical observations in a research-oriented format

## Areas of Study

### Distributed Ledger Abstractions

* Decentralized trust
* Immutable records
* Auditable transaction history
* Distributed validation
* Ledger-based state management

### Blockchain Architectures

* Solana account model
* Ethereum smart contract model
* EOSIO account and permission model
* Public blockchain infrastructure
* Transaction lifecycle and validation flow

### Smart Contract Systems

* Smart contract deployment
* Transaction signing
* Wallet-based authentication
* State updates
* Payment and reservation workflows
* User interaction with on-chain programs

### Storage Models

* On-chain storage
* Off-chain storage
* IPFS-based decentralized file storage
* Metadata storage strategies
* Cost and scalability trade-offs

### Platform Trade-offs

* Solana: performance, low transaction fees, account model, PDA-based design
* Ethereum: ecosystem maturity, smart contract flexibility, gas cost constraints
* EOSIO: account permissions, DPoS model, performance-oriented architecture

## Repository Structure

```text
blockchain-abstractions-study/

├── README.md

├── docs/
│   ├── research-questions.md
│   ├── distributed-ledger-abstractions.md
│   ├── blockchain-architectures.md
│   ├── consensus-and-validation.md
│   ├── storage-models.md
│   └── security-models.md

├── academic-notes/
│   ├── literature-review.md
│   ├── methodology.md
│   ├── comparative-analysis.md
│   ├── research-observations.md
│   └── future-directions.md

├── implementations/
│   ├── ethereum/
│   ├── solana/
│   └── eosio/

└── diagrams/
    ├── architecture-overview.png
    ├── ethereum-state-model.png
    ├── solana-account-model.png
    └── transaction-flow.png
```

## Original Application Context

The original implementation was developed in the context of a decentralized tourism application.

The application context included:

* Product and service publication
* Reservation workflows
* Wallet-based payments
* Smart contract interaction
* Decentralized file storage using IPFS

In this repository, the project is presented from a broader academic perspective: the tourism use case is treated as an application scenario for studying distributed ledger abstractions and blockchain architecture trade-offs.

## Current Roadmap

### Phase 1 — Documentation and Reorganization

* Reorganize the original project materials
* Add architecture documentation
* Document the Solana, Ethereum, and EOSIO implementations
* Extract reusable blockchain concepts from the application

### Phase 2 — Comparative Analysis

* Compare transaction validation models
* Compare storage strategies
* Analyze platform-level trade-offs
* Document the role of smart contracts in each ecosystem

### Phase 3 — Security-Oriented Extension

* Add threat modeling notes
* Identify smart contract security assumptions
* Analyze wallet and transaction signing flows
* Connect the project with smart contract security research

## Research Relevance

This project supports my current interest in:

* Distributed systems security
* Blockchain protocols
* Applied cryptography
* Smart contract security
* Secure decentralized applications

It also serves as a bridge between my work in cryptography and my interest in blockchain-based distributed systems.

## Related Repositories

* [Crypto Research Lab](https://github.com/elghabouchi/crypto-research-lab)
* [Smart Contract Security Lab](https://github.com/elghabouchi/smart-contract-security-lab)

## Disclaimer

This repository is educational and research-oriented. The implementations and notes are not intended for production use without further security review, testing, and formal analysis.

## Author

Hamza El Ghabouchi

MSc Student in Cryptography & Information Security
