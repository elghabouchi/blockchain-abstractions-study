# Storage Models

## Overview

This document discusses storage models in blockchain-based applications, with a focus on the distinction between on-chain storage and off-chain content-addressed storage.

It builds on the concepts introduced in [Distributed Ledger Abstractions](distributed-ledger-abstractions.md) and the platform comparison presented in [Blockchain Architectures](blockchain-architectures.md).

The goal is to examine how Ethereum, Solana, and EOSIO handle application state, and how external storage systems such as IPFS can be used to reduce on-chain storage requirements while preserving verifiable references to off-chain data.

This document does not provide a complete storage benchmark. Instead, it identifies the main architectural trade-offs relevant to decentralized application design.

---

## 1. On-chain Storage

On-chain storage refers to data stored directly in the blockchain state.

This data is maintained by the network and updated through valid transactions. It may include balances, contract variables, account data, permissions, ownership records, reservation status, payment information, or references to external resources.

On-chain storage provides strong integration with the execution environment. Smart contracts and programs can directly read and update on-chain state according to protocol-level and application-level rules.

However, on-chain storage is usually expensive and limited. Since blockchain data must be replicated and verified by network participants, storing large amounts of data directly on-chain can create scalability and cost problems.

### 1.1 Advantages of On-chain Storage

On-chain storage provides:

* direct availability to smart contracts or programs;
* strong auditability through transaction history;
* integration with validation and execution rules;
* transparent state updates;
* reduced dependence on external systems for critical state.

### 1.2 Limitations of On-chain Storage

On-chain storage also introduces limitations:

* high storage cost;
* limited scalability;
* increased transaction fees or resource consumption;
* permanent exposure of public data;
* difficulty modifying or deleting stored information;
* larger burden on network replication.

For this reason, decentralized applications often store only essential state on-chain and move larger or less critical data off-chain.

---

## 2. Off-chain Storage

Off-chain storage refers to data stored outside the blockchain state.

This can include files, images, metadata, documents, product descriptions, or other large application data. The blockchain may store only a reference to the off-chain data, such as a content hash, content identifier, or URI.

Off-chain storage reduces on-chain cost and improves scalability, but it changes the security and availability assumptions of the application.

The blockchain can verify that a stored reference corresponds to a particular piece of data. However, it does not automatically guarantee that the external data will remain available forever.

Therefore, an on-chain reference to off-chain content should be understood primarily as an integrity reference, not as an availability guarantee.

---

## 3. IPFS and Content-addressed Storage

IPFS is a content-addressed peer-to-peer storage system.

Instead of identifying data by location, IPFS identifies data by its content. A file is associated with a content identifier, commonly referred to as a CID. If the content changes, the identifier changes as well.

This property is useful for blockchain applications because a smart contract or on-chain record can store a reference to a specific version of off-chain data.

For example, an application may store a product image, service document, or metadata file on IPFS, then store the corresponding CID on-chain.

This creates a separation between:

* on-chain state, which records ownership, permissions, payments, and references;
* off-chain content, which stores larger files or descriptive data.

However, IPFS should not be treated as a complete availability solution by itself. Practical availability often depends on pinning services, gateways, user-hosted nodes, or other infrastructure. A CID allows the application to verify what the content should be, but it does not guarantee that the content is always retrievable.

---

## 4. Integrity, Availability, and Cost

Storage design involves trade-offs between integrity, availability, and cost.

### 4.1 Integrity

Content-addressed storage helps preserve integrity.

If the data retrieved from IPFS does not match the expected content identifier, the mismatch can be detected. This makes IPFS useful for verifying that off-chain data has not been silently modified.

However, integrity does not imply availability. A valid content identifier only proves what the content should be, not that the content is currently accessible.

### 4.2 Availability

Availability refers to whether data can actually be accessed when needed.

If off-chain data is not pinned, hosted, or replicated, it may become unavailable even if the on-chain reference remains valid. This creates an important design requirement: decentralized applications using IPFS must consider how content is preserved and served.

In practice, availability may depend on:

* pinning services;
* user-hosted IPFS nodes;
* public or private gateways;
* storage providers;
* backup infrastructure.

This means that off-chain storage introduces operational assumptions that are not present when data is stored directly on-chain.

### 4.3 Cost

Off-chain storage reduces on-chain cost because large data is not written directly into blockchain state.

However, this does not remove cost entirely. Applications may still need to pay for pinning, hosting, gateway access, or storage infrastructure. The trade-off is therefore not “free storage”, but a shift from blockchain storage cost to external storage and availability management.

---

## 5. Platform Storage Comparison

Ethereum, Solana, and EOSIO expose different storage models to developers.

| Dimension             | Ethereum                                | Solana                                                                        | EOSIO                                               |
| --------------------- | --------------------------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------- |
| Main storage unit     | Contract storage                        | Accounts                                                                      | Multi-index tables                                  |
| State ownership       | Contract-owned storage                  | Program-owned accounts                                                        | Contract/account-scoped tables                      |
| Storage cost model    | Gas and storage-related costs           | Account allocation, rent-exemption requirements, and account size constraints | RAM-based resource model                            |
| Typical off-chain use | Metadata, files, images, documents      | Metadata, files, account-linked content                                       | Metadata, files, structured external content        |
| Developer concern     | Gas cost and public state               | Account size, ownership, and allocation design                                | RAM usage and table scope                           |
| Security concern      | Incorrect storage logic or exposed data | Incorrect account ownership, size, or authority assumptions                   | Permission, scope, and resource-management mistakes |

This comparison shows that storage is not only a technical implementation detail. It affects cost, scalability, data integrity, application architecture, and security assumptions.

---

## 6. Security Perspective

Storage decisions introduce security assumptions.

When data is stored on-chain, the application benefits from stronger integration with the ledger, but it must handle cost, privacy, and immutability constraints.

When data is stored off-chain, the application reduces cost and improves flexibility, but it must handle integrity, availability, and external infrastructure risks.

Common risks include:

* storing sensitive data publicly on-chain;
* relying on off-chain data that may disappear;
* failing to verify content identifiers;
* treating IPFS availability as guaranteed;
* allowing inconsistent links between on-chain records and off-chain content;
* designing smart contracts that trust external metadata without validation;
* depending on centralized gateways or pinning services without acknowledging that dependency.

For this reason, storage models are directly connected to smart contract security and distributed systems design.

A careful storage model should distinguish between:

* data that must be validated by the blockchain;
* data that only needs to be referenced by the blockchain;
* data that must remain private;
* data that must remain available over time;
* data that can be reconstructed or replaced if needed.

---

## 7. Relevance to the Original Application

The original decentralized tourism application required storing different types of data:

* product and service information;
* reservation records;
* payment-related state;
* user interaction data;
* images or descriptive files;
* references to external content.

Storing all of this data directly on-chain would not be practical.

Instead, the application design followed a hybrid approach:

* critical state and transaction-related information remained on-chain;
* larger descriptive data and files could be stored off-chain;
* IPFS-based references could be linked to on-chain records.

This approach reflects a common decentralized application pattern: the blockchain is used for validation, ownership, payments, and state transitions, while external storage is used for larger or less frequently updated content.

In the context of the tourism application, this distinction is important. Reservation status, payment information, ownership records, and authorization logic are suitable candidates for on-chain state. Images, descriptions, documents, and larger metadata are better handled through off-chain storage, provided that their references are managed carefully.

---

## Scope

This document provides an architecture-level discussion of storage models.

It does not provide:

* a full benchmark of storage costs;
* a complete IPFS implementation guide;
* a privacy analysis of all stored data;
* a formal availability model;
* a production-level storage security audit.

These topics require deeper platform-specific and application-specific analysis.

---

## References Used

This document is supported by the references listed in [Literature Review and References](../academic-notes/literature-review.md), including:

* Benet, *IPFS — Content Addressed, Versioned, P2P File System*
* IPFS Documentation
* Ethereum Documentation
* Solana Documentation
* EOSIO / Antelope Documentation

---

## Navigation

* [Back to README](../README.md)
* Previous: [Consensus and Validation](consensus-and-validation.md)
* Next: [Security Models](security-models.md)
