# Security Models

## Overview

This document discusses the security assumptions and risk patterns that arise from the architectural models of Ethereum, Solana, and EOSIO.

It builds on the previous documents:

* [Distributed Ledger Abstractions](distributed-ledger-abstractions.md)
* [Blockchain Architectures](blockchain-architectures.md)
* [Consensus and Validation](consensus-and-validation.md)
* [Storage Models](storage-models.md)

The goal is not to provide a complete smart contract audit or a formal security proof. Instead, this document identifies security-relevant assumptions that developers must consider when building decentralized applications on different blockchain platforms.

Security in blockchain applications depends on several layers:

* protocol-level validation;
* consensus and finality assumptions;
* smart contract or program logic;
* account and permission models;
* transaction ordering;
* storage choices;
* wallet and user behavior;
* off-chain infrastructure.

---

## 1. Security as a Layered Model

A decentralized application is not secured by the blockchain alone.

The underlying blockchain provides mechanisms for transaction validation, state replication, and auditability. However, application security also depends on how smart contracts are designed, how accounts are controlled, how permissions are checked, and how external storage is managed.

For this study, security is viewed across four layers:

| Layer             | Security Question                                                                            |
| ----------------- | -------------------------------------------------------------------------------------------- |
| Protocol layer    | How does the platform validate transactions and maintain ledger consistency?                 |
| Execution layer   | How are smart contracts, programs, or actions executed safely?                               |
| Application layer | Does the application enforce correct authorization and state transitions?                    |
| Storage layer     | Are on-chain and off-chain data handled with correct integrity and availability assumptions? |

This layered view is useful because different platforms expose different risks to developers.

---

## 2. Ethereum Security Model

Ethereum’s security model is closely related to its account-based architecture, EVM execution, gas model, and contract composability.

### 2.1 Account and Authorization Assumptions

Ethereum uses externally owned accounts controlled by private keys and contract accounts controlled by contract code.

A transaction initiated by an externally owned account is authenticated through a digital signature. Once a transaction reaches a contract, the contract must enforce its own authorization logic.

This creates an important distinction:

* the protocol verifies that the transaction sender is valid;
* the contract must verify whether that sender is allowed to perform a specific action.

Incorrect authorization logic can therefore lead to access-control vulnerabilities.

### 2.2 Contract Composability Risks

Ethereum supports interaction between contracts through external calls.

This composability is one of Ethereum’s strengths, but it also introduces risks. A contract may call another contract whose behavior is not fully controlled by the caller. This can create unexpected execution flows.

Common risks include:

* reentrancy;
* incorrect handling of external calls;
* unsafe assumptions about called contracts;
* dependency on transaction ordering;
* access-control mistakes.

These risks are especially relevant in applications involving payments, reservations, or ownership changes, where state must be updated consistently.

### 2.3 Gas and Execution Constraints

Ethereum execution is limited by gas.

Gas prevents unbounded computation, but it also affects application design. Developers must account for the cost of computation and storage. A function that is logically correct may still be impractical if it consumes too much gas.

Gas-related assumptions can affect:

* contract usability;
* denial-of-service risks;
* storage design;
* loop and iteration patterns;
* transaction failure behavior.

---

## 3. Solana Security Model

Solana’s security model is closely tied to explicit account handling, program ownership, signer checks, and account constraints.

### 3.1 Account Ownership and Validation

In Solana, programs operate on accounts passed explicitly to instructions.

A program must verify that the provided accounts are the expected ones. It must also check ownership, signer status, mutability, and program-specific constraints.

Common risks include:

* accepting an incorrect account;
* failing to verify account ownership;
* missing signer checks;
* allowing unintended writable accounts;
* incorrect PDA derivation or validation;
* account substitution attacks.

This makes account validation a central security concern in Solana development.

### 3.2 Explicit State Access

Solana’s performance model depends on explicit account access.

This makes dependencies visible to the runtime and enables parallel execution when accounts do not conflict. However, it also means developers must reason carefully about which accounts are read, written, signed, and controlled by the program.

A program can become vulnerable if it assumes that an account is valid without checking:

* its owner;
* its address;
* its signer status;
* its data format;
* its relationship to other accounts.

### 3.3 Developer Frameworks

Frameworks such as Anchor help reduce some account-validation boilerplate by allowing developers to express constraints declaratively.

However, a framework does not remove the need to understand the underlying account model. Incorrect constraints or missing validation logic can still produce vulnerabilities.

For this reason, Solana security requires both framework-level knowledge and a clear understanding of the runtime’s account model.

---

## 4. EOSIO Security Model

EOSIO’s security model is based on named accounts, configurable permissions, actions, resource management, and table-based state.

### 4.1 Permission-Based Authorization

EOSIO accounts can define permission levels such as `owner` and `active`, and can support more complex authorization structures.

This makes access control more explicit than in platforms where accounts are primarily controlled by a single key. However, it also introduces configuration complexity.

Security risks may arise from:

* overly broad permissions;
* incorrect action authorization;
* weak permission hierarchy design;
* misuse of delegated authority;
* failure to enforce authorization inside contract actions.

### 4.2 Actions and Contract Logic

EOSIO smart contracts execute actions.

Each action must enforce the expected authorization checks and state updates. A contract may be structurally correct but still insecure if actions allow unauthorized accounts to modify state.

This is relevant for applications involving reservations, payments, or ownership records, where state changes must be tied to properly authorized users.

### 4.3 Resource Assumptions

EOSIO separates resources such as CPU, NET, and RAM.

This gives developers more explicit control over resource planning, but it also creates security and operational assumptions. Applications must account for whether users or contracts have enough resources to execute required actions and store necessary state.

Resource exhaustion or mismanagement can affect application availability and usability.

---

## 5. Storage-Related Security Assumptions

Storage design introduces security risks across all platforms.

On-chain storage provides stronger integration with validation and auditability, but it is public, expensive, and difficult to modify or delete. Off-chain storage reduces cost and improves flexibility, but it introduces availability and infrastructure assumptions.

When using IPFS or similar content-addressed storage, a content identifier can help verify integrity. However, it does not guarantee that the content will remain available.

Common storage-related risks include:

* storing sensitive information on-chain;
* assuming off-chain data is always available;
* failing to verify off-chain references;
* relying on centralized gateways without acknowledging the dependency;
* allowing inconsistency between on-chain records and off-chain metadata;
* treating content integrity as equivalent to content availability.

A secure design must distinguish between data that must be enforced by the blockchain and data that only needs to be referenced by the blockchain.

---

## 6. Transaction Ordering and Finality Risks

Transaction ordering and finality assumptions affect application security.

A developer should not assume that transaction ordering is neutral or irrelevant. In smart contract systems, the order of transactions can influence state transitions and economic outcomes.

Risks may include:

* front-running;
* transaction-ordering dependence;
* inconsistent state updates;
* premature reliance on unfinalized transactions;
* incorrect assumptions about confirmation depth;
* application logic that depends on ordering guarantees not provided by the platform.

For applications involving reservations and payments, this is especially important. A payment transaction, a reservation update, and an ownership change must be handled under clear validation and finality assumptions.

---

## 7. Comparative Security Summary

| Dimension             | Ethereum                                                     | Solana                                                                     | EOSIO                                                    |
| --------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------- | -------------------------------------------------------- |
| Main security focus   | Contract logic, composability, gas, ordering                 | Account validation, signer checks, ownership, PDAs                         | Permissions, actions, resources, table scopes            |
| Common developer risk | Reentrancy, access-control errors, external call assumptions | Account substitution, missing signer checks, invalid ownership assumptions | Permission misconfiguration, action authorization errors |
| Storage risk          | Public and costly contract storage                           | Incorrect account sizing or ownership assumptions                          | RAM and table-scope management issues                    |
| Ordering risk         | Sequential ordering and MEV-related assumptions              | Account contention and scheduling assumptions                              | Block producer ordering assumptions                      |
| Authorization model   | Signatures plus contract-level checks                        | Signatures plus account/program constraints                                | Configurable account permissions                         |

---

## 8. Relevance to the Original Application

The original decentralized tourism application involved payments, reservations, product publication, and off-chain data references.

These features require several security assumptions:

* only authorized users should create or modify reservations;
* payment-related state should be updated consistently;
* contract or program logic should prevent unauthorized changes;
* off-chain references should match the intended content;
* users should understand when a transaction can be considered accepted;
* sensitive data should not be stored publicly on-chain.

The same application-level requirements lead to different security concerns depending on the platform:

* in Ethereum, contract logic, external calls, gas, and ordering assumptions are central;
* in Solana, account validation, signer checks, and ownership constraints are central;
* in EOSIO, permissions, actions, resources, and table scopes are central.

This confirms that blockchain security is not only about cryptography. It also depends on architecture, execution model, storage design, and developer assumptions.

---

## Scope

This document provides an architecture-level discussion of security models.

It does not provide:

* a complete smart contract audit;
* a formal verification of any implementation;
* a full taxonomy of all blockchain vulnerabilities;
* a production security assessment;
* a proof of protocol-level security.

These topics require deeper platform-specific analysis and are outside the scope of this repository.

---

## References Used

This document is supported by the references listed in [Literature Review and References](../academic-notes/literature-review.md), including:

* Atzei, Bartoletti, and Cimoli, *A Survey of Attacks on Ethereum Smart Contracts*
* Luu et al., *Making Smart Contracts Smarter*
* ConsenSys Smart Contract Best Practices
* Ethereum Documentation
* Solana Documentation
* Anchor Documentation
* EOSIO / Antelope Documentation

---

## Navigation

* [Back to README](../README.md)
* Previous: [Storage Models](storage-models.md)
* Next: [Methodology](../academic-notes/methodology.md)
