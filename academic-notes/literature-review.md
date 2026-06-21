# Literature Review and References

## Overview

This document lists the academic and technical references used throughout this repository.

The purpose of this file is not to provide a complete survey of the blockchain literature. Instead, it documents the references that directly support the concepts, architectural comparisons, consensus-related assumptions, storage models, and security considerations discussed in the repository.

References are added progressively as the repository develops. Each reference is included only when it supports a specific document, claim, or comparison.

---

## 1. Foundational Distributed Ledger and Consensus Concepts

Used in:

* [Distributed Ledger Abstractions](../docs/distributed-ledger-abstractions.md)
* [Consensus and Validation](../docs/consensus-and-validation.md)

### Nakamoto, S. (2008). *Bitcoin: A Peer-to-Peer Electronic Cash System.*

**Used for:**
Understanding the basic structure of blockchain-based record keeping, hash-linked transaction history, decentralized validation, transaction ordering, and distributed ledger immutability.

**Why included:**
This reference provides historical and conceptual background for blockchain systems. It supports the discussion of replicated ledgers, transaction ordering, auditability, immutability, and append-only records in the distributed ledger abstractions and consensus documents.

### Lamport, L., Shostak, R., and Pease, M. (1982). *The Byzantine Generals Problem.*

**Used for:**
Understanding the problem of agreement in distributed systems under faulty or adversarial conditions.

**Why included:**
This paper provides foundational background for the trust and fault-tolerance assumptions discussed in distributed ledger systems. It is used as conceptual support for the discussion of consensus, validation, and adversarial behavior.

### Castro, M., and Liskov, B. (1999). *Practical Byzantine Fault Tolerance.*

**Used for:**
Understanding quorum-based agreement and deterministic finality concepts.

**Why included:**
PBFT is used as background for understanding Byzantine fault tolerance and finality. The platforms studied in this repository do not necessarily implement PBFT directly, but the paper helps frame consensus-related concepts.

---

## 2. Ethereum Architecture

Used in:

* [Blockchain Architectures](../docs/blockchain-architectures.md)
* [Consensus and Validation](../docs/consensus-and-validation.md)
* [Storage Models](../docs/storage-models.md)

### Buterin, V. (2014). *Ethereum: A Next-Generation Smart Contract and Decentralized Application Platform.*

**Used for:**
Understanding Ethereum’s account-based model, smart contract architecture, and general-purpose execution layer.

**Why included:**
This reference supports the description of Ethereum as a programmable blockchain platform where accounts, contract logic, and persistent state are central architectural components.

### Ethereum Documentation

**Used for:**
Understanding Ethereum accounts, transactions, gas, smart contracts, contract storage, the EVM, transaction execution, validation rules, and storage-related costs.

**Why included:**
The official Ethereum documentation provides practical and technical support for the Ethereum-related descriptions in the architecture, consensus, storage, and security sections.

### Solidity Documentation

**Used for:**
Understanding Solidity contract structure, functions, contract storage, external calls, modifiers, ABI-based interaction, and common smart contract programming patterns.

**Why included:**
This reference supports the discussion of Ethereum developer abstractions, contract-owned storage, composability, and security-relevant programming risks.

### Buterin, V., and Griffith, V. (2017). *Casper the Friendly Finality Gadget.*

**Used for:**
Understanding Ethereum’s finality model and the role of checkpoint finality in Ethereum’s consensus design.

**Why included:**
This reference is used in the consensus discussion to explain Ethereum finality at a high level, without attempting a full formal treatment.

---

## 3. Solana Architecture

Used in:

* [Blockchain Architectures](../docs/blockchain-architectures.md)
* [Consensus and Validation](../docs/consensus-and-validation.md)
* [Storage Models](../docs/storage-models.md)

### Yakovenko, A. (2017). *Solana: A New Architecture for a High Performance Blockchain.*

**Used for:**
Understanding Solana’s architectural design, including Proof of History, high-throughput design goals, validator voting, and the relationship between ordering and execution.

**Why included:**
This reference supports the discussion of Solana as a blockchain architecture designed around performance, explicit account access, and transaction scheduling.

### Solana Documentation

**Used for:**
Understanding Solana accounts, programs, transactions, account ownership, fees, compute budgets, runtime behavior, account allocation, storage constraints, and transaction processing.

**Why included:**
The official Solana documentation supports the explanation of Solana’s account-centric architecture, explicit account validation model, storage assumptions, and transaction validation rules.

### Anchor Documentation

**Used for:**
Understanding Solana smart contract development patterns, account validation, serialization, constraints, signer checks, and program structure.

**Why included:**
This reference supports the discussion of Solana developer abstractions and the role of frameworks in reducing account-validation complexity.

---

## 4. EOSIO / Antelope Architecture

Used in:

* [Blockchain Architectures](../docs/blockchain-architectures.md)
* [Consensus and Validation](../docs/consensus-and-validation.md)
* [Storage Models](../docs/storage-models.md)

### Larimer, D. (2017). *EOS.IO Technical White Paper.*

**Used for:**
Understanding EOSIO’s account model, permission structure, Delegated Proof of Stake design, block producer scheduling, and resource model.

**Why included:**
This reference supports the description of EOSIO as a permissioned account and resource-oriented blockchain architecture.

### EOSIO Developer Documentation

**Used for:**
Understanding accounts, actions, permissions, multi-index tables, CPU/NET/RAM resources, table scopes, and smart contract development patterns.

**Why included:**
This documentation supports the practical explanation of EOSIO’s developer model, table-oriented state management, validation assumptions, and resource-based storage model.

### Antelope Documentation

**Used for:**
Understanding EOSIO-derived architecture, tooling, permissions, accounts, resource models, and ecosystem evolution.

**Why included:**
EOSIO has evolved historically, and Antelope provides a more current reference point for EOSIO-derived systems and concepts.

---

## 5. Storage Models

Used in:

* [Distributed Ledger Abstractions](../docs/distributed-ledger-abstractions.md)
* [Storage Models](../docs/storage-models.md)

### Benet, J. (2014). *IPFS — Content Addressed, Versioned, P2P File System.*

**Used for:**
Understanding content-addressed storage, off-chain data references, content identifiers, decentralized file storage, and the distinction between integrity and availability.

**Why included:**
This reference supports the discussion of on-chain/off-chain storage trade-offs, especially the distinction between storing data directly on-chain and storing content-addressed references to off-chain data.

### IPFS Documentation

**Used for:**
Understanding practical IPFS concepts such as content identifiers, content addressing, data retrieval, gateways, pinning, and availability assumptions.

**Why included:**
The documentation supports the practical storage discussion related to IPFS-based decentralized storage and its operational assumptions.

---

## 6. Smart Contract Security

Used in:

* [Blockchain Architectures](../docs/blockchain-architectures.md)
* [Consensus and Validation](../docs/consensus-and-validation.md)
* [Storage Models](../docs/storage-models.md)

### Atzei, N., Bartoletti, M., and Cimoli, T. (2017). *A Survey of Attacks on Ethereum Smart Contracts.*

**Used for:**
Understanding common smart contract vulnerability categories such as reentrancy, unchecked calls, transaction-ordering dependence, and other Ethereum-specific risks.

**Why included:**
This paper provides a widely used systematization of Ethereum smart contract attack patterns and supports the security discussion in this repository.

### Luu, L., Chu, D.H., Olickel, H., Saxena, P., and Hobor, A. (2016). *Making Smart Contracts Smarter.*

**Used for:**
Understanding automated analysis of smart contracts and symbolic execution approaches for detecting vulnerabilities.

**Why included:**
This reference supports the discussion of smart contract vulnerability detection and security-oriented analysis.

### ConsenSys Smart Contract Best Practices

**Used for:**
Understanding practical smart contract security risks, including reentrancy, access control, external calls, transaction-ordering assumptions, and secure development practices.

**Why included:**
This reference provides practitioner-oriented support for the security considerations discussed in the repository.

---

## 7. Comparative Blockchain Architecture

Used in:

* [Blockchain Architectures](../docs/blockchain-architectures.md)
* [Comparative Analysis](comparative-analysis.md)

### Xu, X., Weber, I., Staples, M., Zhu, L., Bosch, J., Bass, L., Pautasso, C., and Rimba, P. (2017). *A Taxonomy of Blockchain-Based Systems for Architecture Design.*

**Used for:**
Structuring comparisons between blockchain platforms using consistent architectural dimensions.

**Why included:**
This reference supports the methodology of comparing Ethereum, Solana, and EOSIO through dimensions such as state model, execution model, consensus assumptions, resource model, storage model, and developer abstraction.

---

## Scope

This file is not intended to be an exhaustive literature review.

It includes only references that directly support specific claims, concepts, or comparisons made in this repository. New references should be added only when they are connected to a specific document or section.

The goal is to maintain a clear mapping between repository content and the sources used to support it.

---

## Navigation

* [Back to README](../README.md)
* Next: [Methodology](methodology.md)
