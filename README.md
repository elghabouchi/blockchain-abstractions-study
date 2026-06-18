# Blockchain Abstractions Study

An academic repository for studying blockchain and distributed ledger systems through comparative implementations across Ethereum, Solana, and EOSIO.

This project is based on my undergraduate final-year project and reorganized as a documentation-oriented study of blockchain architectures, smart contract execution models, transaction validation, and on-chain/off-chain storage strategies.

## Objective

The objective of this repository is to examine how different blockchain platforms implement core distributed ledger properties, including state management, transaction validation, auditability, immutability, and programmable execution.

Rather than presenting the work only as a decentralized application, this repository uses the original application prototypes as practical reference points for analyzing broader architectural and security trade-offs.

## Reading Path

This section provides the recommended reading order for the repository. The study starts with the research questions, then follows the technical documents that address each question progressively.

1. **[Research Questions](docs/research-questions.md)**
   Defines the main research question and the sub-questions guiding the repository.

2. **[Distributed Ledger Abstractions](docs/distributed-ledger-abstractions.md)**
   Introduces the distributed ledger concepts used throughout the study.

3. **[Blockchain Architectures](docs/blockchain-architectures.md)**
   Compares the architectural models of Ethereum, Solana, and EOSIO.

4. **[Consensus and Validation](docs/consensus-and-validation.md)**
   Discusses transaction validation, ordering, finality, and trust assumptions.

5. **[Storage Models](docs/storage-models.md)**
   Examines on-chain storage, off-chain storage, IPFS usage, and related trade-offs.

6. **[Security Models](docs/security-models.md)**
   Summarizes platform-level security assumptions, smart contract risks, and authentication models.

7. **[Methodology](academic-notes/methodology.md)**
   Explains how the comparative analysis is structured.

8. **[Comparative Analysis](academic-notes/comparative-analysis.md)**
   Provides a platform-level comparison of Ethereum, Solana, and EOSIO.

9. **[Research Observations](academic-notes/research-observations.md)**
   Summarizes the main observations extracted from the study.

10. **[Future Directions](academic-notes/future-directions.md)**
    Presents possible extensions related to distributed systems security, blockchain protocols, and smart contract security.

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

## Study Scope

This repository focuses on:

* blockchain architecture comparison;
* distributed ledger abstractions;
* smart contract execution models;
* transaction validation and consensus-related assumptions;
* on-chain/off-chain storage trade-offs;
* platform-level security assumptions.

It does not aim to propose a new blockchain protocol, introduce a new consensus mechanism, or provide formal mathematical proofs.

## Original Application Context

The original implementation was developed in the context of a decentralized tourism application involving product and service publication, reservation workflows, wallet-based payments, smart contract interaction, and IPFS-based storage.

In this repository, that application is used only as a practical context for studying distributed ledger abstractions and platform-level trade-offs.

## Research Relevance

This repository supports my current academic interests in:

* distributed systems security;
* blockchain protocols;
* applied cryptography;
* smart contract security;
* secure decentralized applications.

It also connects practical blockchain development with broader research preparation in cryptography and distributed systems security.

## Related Repositories

* [Crypto Research Lab](https://github.com/elghabouchi/crypto-research-lab)
* [Smart Contract Security Lab](https://github.com/elghabouchi/smart-contract-security-lab)

## Disclaimer

This repository is educational and academic-oriented. The implementations and notes are not intended for production use without further security review, testing, and formal analysis.

## Author

Hamza El Ghabouchi

MSc Student in Cryptography & Information Security
