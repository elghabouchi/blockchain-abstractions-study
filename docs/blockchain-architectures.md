# Blockchain Architectures

## Overview

This document compares the architectural models of Ethereum and Solana.

It builds on the conceptual foundation introduced in [Distributed Ledger Abstractions](distributed-ledger-abstractions.md) and addresses three research directions from [Research Questions](research-questions.md):

* state and account representations;
* transaction execution and concurrency;
* smart contract abstractions and developer experience.

The goal is not to provide a complete technical specification of each platform. Instead, this document identifies the architectural choices that are most relevant for comparing how Ethereum and Solana implement distributed ledger functionality.

Consensus and finality are discussed separately in [Consensus and Validation](consensus-and-validation.md). Storage trade-offs are discussed in [Storage Models](storage-models.md).

---

## 1. Ethereum: Account-Based Smart Contract Architecture

### 1.1 State and Account Model

Ethereum uses an account-based global state model.

The state of the system is represented through accounts. Two main account types exist:

* **Externally Owned Accounts (EOAs)**: accounts controlled by private keys and used to initiate transactions.
* **Contract Accounts**: accounts associated with deployed smart contract code and persistent contract storage.

This model gives Ethereum a uniform structure: both users and contracts are represented as accounts within the same global state. Smart contract storage is maintained under the contract account and can only be modified through contract execution.

From an architectural perspective, Ethereum closely combines application logic and persistent state. A smart contract defines both the rules of execution and the storage layout used by the application.

### 1.2 Execution Model

Ethereum smart contracts execute on the Ethereum Virtual Machine (EVM), a deterministic stack-based virtual machine.

Transactions can transfer value, deploy contracts, or call functions on existing contracts. Execution is metered using gas, which assigns a cost to computation, storage, and other operations. This prevents unbounded execution and makes resource consumption explicit.

The EVM provides a general execution environment for decentralized applications. However, every operation must fit within the gas model and the execution constraints of the protocol.

### 1.3 Transaction Ordering and Concurrency

Ethereum transactions are predominantly executed sequentially within a block.

This model makes execution easier to reason about because transactions are processed in a defined order. However, sequential execution also limits parallelism at the base execution level.

The advantage of this model is a relatively uniform execution abstraction and strong composability. Contracts can call other contracts, and developers can build protocols that interact with existing deployed contracts. The drawback is that high demand can lead to congestion, higher fees, and scalability limitations.

### 1.4 Developer Abstractions

Ethereum developers commonly use Solidity to write smart contracts.

The contract oriented programming model is familiar to many developers: contracts expose functions, maintain internal state, and interact with other contracts through calls. This model supports a large ecosystem of composable decentralized applications.

However, composability also introduces security risks. Reentrancy, incorrect access control, unexpected external call behavior, and transaction-ordering assumptions are important considerations when designing Ethereum smart contracts.

---

## 2. Solana: Account Centric Parallel Execution Architecture

### 2.1 State and Account Model

Solana separates program logic from application state more explicitly than Ethereum.

In Solana, programs contain executable logic, while state is stored in separate accounts. These accounts are passed explicitly to transactions and instructions. A program can only modify accounts that it owns, which makes account ownership a central part of Solana’s security and execution model.

Program Derived Addresses (PDAs) are commonly used to create deterministic program controlled accounts. They allow programs to manage state without relying on private keys for those accounts.

From an architectural perspective, Solana requires developers to design state layout and account access patterns explicitly. This differs from Ethereum, where a contract usually manages its own persistent storage internally.

### 2.2 Execution Model

Solana programs are commonly written in Rust and executed by the Solana runtime. Frameworks such as Anchor provide higher level abstractions for account validation, serialization, instruction handling, and error management.

A key architectural feature of Solana is that transactions must declare the accounts they will read or write. This explicit account declaration allows the runtime to identify which transactions may safely execute in parallel.

This design differs from Ethereum, where contract storage is accessed through contract execution itself and where transaction execution is predominantly sequential.

### 2.3 Transaction Ordering and Concurrency

Solana’s execution model supports parallel processing when transactions operate on non-conflicting accounts.

Transactions that attempt to write to the same account must still be ordered relative to each other. However, transactions touching independent state can be scheduled concurrently.

Parallelism in Solana is workload-dependent. It depends on whether transactions declare account access patterns that do not conflict. This can provide higher potential throughput under suitable workload conditions, but it also shifts part of the complexity to developers.

Developers must reason carefully about account ownership, account constraints, writable accounts, signer requirements, and possible contention between transactions.

### 2.4 Developer Abstractions

Solana development is more explicit than Ethereum development.

Instead of writing a contract that internally owns and manages its state, a Solana developer writes programs that receive accounts as inputs and validate whether those accounts satisfy the expected constraints.

This model can improve performance and make account access visible. However, it also increases the risk of implementation mistakes if account validation is incomplete or incorrect.

Common risks include accepting the wrong account, failing to verify ownership, omitting signer checks, or allowing unintended writable accounts.

---


## 4. Comparative Summary
| Dimension             | Ethereum                                           | Solana                                                   |
| --------------------- | -------------------------------------------------- | -------------------------------------------------------- |
| Account identity      | Cryptographic addresses                            | Public-key addresses and PDAs                            |
| State model           | Global account-based state                         | Explicit account-based state                             |
| Execution environment | EVM                                                | Solana runtime / Sealevel                                |
| Execution style       | Predominantly sequential block execution           | Parallel execution when account access does not conflict |
| Resource model        | Gas                                                | Compute units and account storage costs                  |
| Authorization model   | Private-key-controlled accounts and contract logic | Account ownership, signatures, and PDAs                  |
| Common language       | Solidity                                           | Rust                                                     |
| Developer complexity  | Contract logic, gas costs, and composability risks | Account constraints and explicit state access            |

## 5. Architectural Trade-offs

The three platforms represent different architectural priorities.

**Ethereum** prioritizes a uniform smart contract model and strong composability. This makes it easier to build interoperable applications, but the predominantly sequential execution model and gas market can create scalability and cost constraints.

**Solana** prioritizes performance through explicit account access and parallel execution. This can provide higher potential throughput, but it requires developers to reason carefully about accounts, ownership, constraints, and transaction conflicts.

These differences show that blockchain platforms do not implement distributed ledger properties in a single universal way. Each architecture makes trade-offs between simplicity, performance, security assumptions, resource management, and developer abstraction.

---

## 6. Relevance to the Original Application

The original decentralized tourism application used Ethereum, Solana, and EOSIO as implementation platforms.

This made it possible to observe how the same application-level ideas, such as reservations, payments, product publication, and user interaction, require different architectural designs depending on the platform.

For example:

* Ethereum expresses application logic through contract-owned storage and function calls.
* Solana requires explicit account design and account validation.


In this repository, these implementation differences are used as reference points for a broader comparison of blockchain architectures and distributed ledger abstractions.

The objective is not to claim that the original application provides a complete benchmark of these platforms. Rather, it provides practical implementation experience that helps structure a comparative architectural analysis.

---

## Scope

This document focuses on architecture-level comparison.

It does not provide:

* a full formal model of each platform;
* a detailed consensus analysis;
* a complete security audit;
* a benchmark of performance or cost;
* a full implementation tutorial.

These topics are addressed separately in the relevant documents of this repository.

---

## References Used

This document is supported by the following references listed in [Literature Review and References](../academic-notes/literature-review.md):

- Buterin, *Ethereum: A Next-Generation Smart Contract and Decentralized Application Platform*
- Ethereum Documentation
- Solidity Documentation
- Yakovenko, *Solana: A New Architecture for a High Performance Blockchain*
- Solana Documentation
- Xu et al., *A Taxonomy of Blockchain-Based Systems for Architecture Design*

## Navigation

* [Back to README](../README.md)
* Previous: [Distributed Ledger Abstractions](distributed-ledger-abstractions.md)
* Next: [Consensus and Validation](consensus-and-validation.md)
