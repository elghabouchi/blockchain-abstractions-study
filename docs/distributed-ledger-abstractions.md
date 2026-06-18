# Distributed Ledger Abstractions

## Overview

This document introduces the core distributed ledger abstractions used throughout this repository.

A distributed ledger can be understood as a shared system for recording state transitions across multiple participants, where validation and control are distributed according to protocol rules rather than being managed solely by a centralized authority.

Blockchain platforms implement this idea through different architectural models, but they often share common conceptual properties such as replicated state, transaction validation, auditability, immutability, and programmable execution.

The goal of this document is not to provide a complete theoretical treatment of distributed ledger systems. Instead, it identifies the principal abstractions that will be used to compare Ethereum, Solana, and EOSIO throughout this study.

The abstractions presented here are informed by a practical undergraduate project in which decentralized application prototypes were implemented on Ethereum, Solana, and EOSIO. In this repository, that implementation experience is reorganized as a comparative study of blockchain architectures, storage models, validation mechanisms, and security assumptions.

---

## Core Abstractions

### 1. Shared State

A distributed ledger maintains a shared representation of system state.

This state may represent account balances, smart contract variables, ownership records, permissions, metadata, or application-specific data. Each blockchain platform defines its own method for representing and updating this state.

For example:

* Ethereum uses a global account-based state model.
* Solana uses accounts as explicit data containers accessed by programs.
* EOSIO uses account permissions and table-based storage structures.

Although the internal models differ, each platform provides mechanisms for maintaining and updating shared state in a verifiable manner.

### 2. Transactions as State Transitions

Transactions are the primary mechanism through which ledger state changes.

A transaction can transfer value, invoke a smart contract, update application data, create an account, modify permissions, or reference external storage systems.

From a systems perspective, a transaction can be viewed as a request to move the ledger from one valid state to another.

This abstraction enables comparison across platforms through a common question:

**How does the platform define, validate, execute, and record state transitions?**

### 3. Validation

Before a transaction is accepted, it must satisfy platform-specific validation rules.

These rules may include:

* signature verification;
* account ownership checks;
* permission verification;
* smart contract execution constraints;
* resource or fee availability;
* consistency with the current ledger state.

Validation is a fundamental abstraction because it connects security, correctness, and trust. A distributed ledger does not merely store transactions; it defines which transactions are considered valid and under what conditions they may alter system state.

### 4. Replication and Auditability

A distributed ledger is replicated across multiple network participants, which may include validators, full nodes, archive nodes, or other infrastructure nodes depending on the platform.

Replication allows participants, in principle, to verify accepted transactions and reconstruct ledger state, although practical access may depend on historical data availability, archive nodes, or indexing infrastructure.

This creates auditability by maintaining a visible and verifiable record of state transitions.

Auditability does not automatically imply application security. While transaction history can be inspected, application correctness still depends on smart contract logic, access control mechanisms, and platform-specific assumptions.

### 5. Immutability

Immutability refers to the difficulty of modifying previously accepted records.

In blockchain systems, immutability is supported by cryptographic linking, consensus mechanisms, economic incentives, and distributed replication.

Once transactions are accepted and finalized, modifying historical records becomes difficult under normal operating assumptions.

For this study, immutability is treated as a system-level property rather than an absolute guarantee. Its strength depends on the platform architecture, consensus model, validator set, and finality assumptions.

### 6. Trust Assumptions

Distributed ledger systems operate under explicit trust assumptions regarding validator behavior, network communication, and protocol security.

Rather than assuming fully trusted participants, blockchain systems define conditions under which agreement can still be achieved in the presence of faults or adversarial behavior.

Different consensus mechanisms introduce different trust models, which influence decentralization, fault tolerance, finality, and resistance to attacks.

For the purposes of this study, trust assumptions are examined through the behavior expected from validators, users, wallets, smart contracts, and supporting infrastructure.

### 7. Programmable Execution

Smart contracts and on-chain programs enable distributed ledgers to support programmable execution.

Application rules can be encoded directly into transaction-processing logic and executed as part of the ledger's state transition process.

Programmable execution enables decentralized applications, token systems, marketplaces, reservation workflows, access-control mechanisms, and other application-specific services.

However, programmable execution also introduces risks. Software defects, incorrect assumptions, weak authorization controls, or unsafe state transitions may result in security vulnerabilities.

---

## Abstractions Used in This Study

This repository uses the following abstractions to compare Ethereum, Solana, and EOSIO.

| Abstraction       | Main Question                                                              |
| ----------------- | -------------------------------------------------------------------------- |
| State model       | How is application state represented and updated?                          |
| Transaction model | How are operations submitted, validated, and executed?                     |
| Execution model   | How are smart contracts or programs executed?                              |
| Validation model  | What makes a transaction valid?                                            |
| Storage model     | What data is stored on-chain or off-chain , and why ?                                 |
| Trust assumptions | What assumptions are made about validators, users, wallets, and contracts? |
| Security model    | What risks arise from platform architecture and application logic?         |

---

## Security Perspective

Distributed ledger abstractions are closely related to security.

A platform's state model influences ownership representation, authorization mechanisms, and data access patterns. Its execution model affects determinism, concurrency, and vulnerability patterns. Its validation model determines which operations are accepted and under what conditions.

Similarly, storage decisions influence integrity, availability, and operational costs, while trust assumptions shape the system's resilience against adversarial behavior.

For this reason, the study of distributed ledger abstractions is not only architectural. It also provides a foundation for understanding smart contract security, transaction safety, and platform-level trust assumptions.

---

## Role in the Repository

This document provides the conceptual foundation for the remaining documents in this repository.

Ethereum, Solana, and EOSIO are examined because they were used in the original implementation project and because they represent different architectural approaches to programmable distributed ledgers. EOSIO is included as a historically relevant platform that provides useful contrasts in governance, resource management, and permission design.

The following documents use these abstractions to analyze:

* blockchain architecture models;
* consensus and validation mechanisms;
* on-chain and off-chain storage trade-offs;
* security assumptions;
* platform-level comparisons between Ethereum, Solana, and EOSIO.

---

## Navigation

* [Back to README](../README.md)
* Previous: [Research Questions](research-questions.md)
* Next: [Blockchain Architectures](blockchain-architectures.md)
