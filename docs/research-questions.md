# Research Questions

## Overview

This document defines the research questions that guide the comparative study presented in this repository.

The objective is to examine how different blockchain platforms implement distributed ledger functionality through distinct architectural, execution, and storage models. The analysis focuses on Ethereum, Solana, and EOSIO, using implementation experience from practical decentralized application prototypes as a foundation for broader architectural observations.


## Main Research Question

How do fundamentally different blockchain architectural models implement and support core distributed ledger properties such as state management, transaction validation, auditability, and programmable execution?


## Sub-Questions

### 1. State and Account Representations

How do Ethereum’s account-based global state model, Solana’s account-centric execution model, and EOSIO’s permissioned account and table-based state model differ in their approaches to data ownership, access control, and resource management?


### 2. Transaction Execution and Concurrency

What are the architectural trade-offs between Ethereum’s predominantly sequential transaction execution model, Solana’s parallel execution approach through Sealevel, and EOSIO’s execution framework with respect to performance, determinism, and system complexity?


### 3. Storage and Data Availability

What architectural trade-offs emerge when application data is partitioned between on-chain state and off-chain storage systems, particularly regarding integrity, availability, scalability, and cost?


### 4. Trust and Security Assumptions

How do platform-specific execution, authentication, and authorization models influence the types of security risks that developers must consider when designing smart contracts and decentralized applications?

Examples include access-control weaknesses, transaction-ordering assumptions, state-management errors, and platform-specific implementation vulnerabilities.


### 5. Platform Trade-offs

How do Ethereum, Solana, and EOSIO compare in terms of execution model complexity, transaction cost predictability, storage flexibility, scalability characteristics, and security assumptions?


### 6. Smart Contract Abstractions and Developer Experience

How do differences in programming models, account abstractions, execution environments, and development frameworks influence smart contract design and implementation across Ethereum, Solana, and EOSIO?


## Scope

This repository does not aim to propose a new blockchain protocol, introduce a consensus mechanism, or provide formal mathematical proofs.

Instead, it uses smart contract implementations and decentralized application prototypes originally developed in a practical project context as implementation-based reference points for examining broader blockchain architecture, distributed systems design, and security considerations.

The resulting analysis is documentation-oriented and intended to demonstrate understanding of distributed ledger architectures, smart contract execution models, storage abstractions, and platform-level trade-offs relevant to blockchain and distributed systems research.

## Navigation

- [Back to README](../README.md)
- Next: [Distributed Ledger Abstractions](distributed-ledger-abstractions.md)