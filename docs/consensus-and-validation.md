# Consensus and Validation

## Overview

This document discusses consensus and transaction validation in Ethereum and Solana.

It builds on the architectural comparison introduced in [Blockchain Architectures](blockchain-architectures.md) and focuses on how each platform handles transaction ordering, validation, finality, and trust assumptions.

The goal is not to provide a full formal treatment of consensus protocols. Instead, this document identifies the consensus related concepts that are relevant for comparing blockchain platforms from a distributed systems and security perspective.

Consensus and validation are closely related but distinct:

* **Validation** determines whether a transaction satisfies protocol and application-level rules.
* **Consensus** determines how network participants agree on the ordering and inclusion of valid transactions.
* **Finality** describes when a transaction or block can be considered difficult or impractical to reverse under the platform’s assumptions.

---

## 1. General Consensus and Validation Concepts

A blockchain system must coordinate multiple participants that may not fully trust each other.

At a high level, the system must answer three questions:

1. Which transactions are valid?
2. In what order should valid transactions be applied?
3. When should the resulting state be considered finalized?

These questions are central to distributed ledger systems because ledger state is not updated by a single centralized authority. Instead, updates are accepted according to protocol rules, validator behavior, and network-level assumptions.

### 1.1 Transaction Validation

Transaction validation typically includes:

* signature verification;
* account or balance checks;
* permission checks;
* fee or resource availability;
* smart contract or program execution constraints;
* consistency with the current state.

A transaction may be correctly signed but still invalid if it violates protocol rules, lacks sufficient resources, fails smart contract conditions, or attempts unauthorized state changes.

### 1.2 Ordering

Transaction ordering determines the sequence in which valid transactions are applied to ledger state.

Ordering matters because the same set of transactions may produce different outcomes depending on execution order. This is especially relevant for smart contract platforms, where state dependent logic, shared accounts, and external calls can create ordering sensitive behavior.

### 1.3 Finality

Finality refers to the point at which a transaction or block is considered accepted with a strong expectation that it will not be reversed.

Different platforms provide different finality assumptions. Some systems provide probabilistic finality, where confidence increases as more blocks are added. Others provide stronger checkpoint or quorum-based finality under specific validator assumptions.

For this repository, finality is treated as a system-level trust property rather than an absolute guarantee.

---

## 2. Ethereum: Validation, Fork Choice, and Checkpoint Finality

Ethereum validates transactions through account state, signatures, nonce rules, gas constraints, and deterministic EVM execution.

A transaction must be signed by an externally owned account, include a valid nonce, provide sufficient fees, and execute within the gas limit. If execution fails, state changes may be reverted while gas can still be consumed.

### 2.1 Transaction Validation

Ethereum transaction validation includes:

* checking the sender signature;
* verifying the account nonce;
* verifying sufficient balance for value transfer and gas;
* executing EVM bytecode deterministically;
* updating state only if execution satisfies protocol rules.

This validation model is closely tied to Ethereum’s account-based architecture. Since contracts hold persistent storage, transaction validity often depends on the current contract state.

### 2.2 Ordering

Transactions are ordered within blocks by block proposers.

This ordering affects smart contract behavior because Ethereum execution is predominantly sequential. If two transactions interact with the same contract state, their final effect depends on the order in which they are included.

This has security implications. Transaction ordering can affect front-running, sandwich attacks, liquidation behavior, and other forms of miner or validator extractable value.

### 2.3 Finality

Ethereum’s current consensus design is based on Proof of Stake.

At a high level, validators propose blocks and attest to blocks. Fork-choice rules help determine the canonical chain head, while checkpoint finality provides stronger confirmation under validator participation and network assumptions.

This means Ethereum finality should not be described as instant or absolute. It depends on validator behavior, network conditions, and the assumptions of the consensus protocol.

For application developers, this distinction matters. A transaction may appear included before it reaches a stronger level of finality. Applications that handle payments, reservations, or asset transfers should therefore reason carefully about confirmation depth and finality expectations.

---

## 3. Solana: Validation, Ordering, and High-Throughput Execution

Solana’s validation model is closely connected to its account-centric architecture.

Transactions declare the accounts they will read or write. This declaration allows the runtime to validate account access and schedule non-conflicting transactions for parallel execution.

### 3.1 Transaction Validation

Solana transaction validation includes:

* signature verification;
* account ownership checks;
* writable and read-only account constraints;
* signer requirements;
* program instruction validation;
* fee and compute budget constraints.

A transaction must provide the accounts required by the program. The program then checks whether those accounts satisfy expected constraints. In frameworks such as Anchor, part of this validation can be expressed through account constraints.

This model gives developers explicit control over which accounts are accessed by an instruction. However, it also places responsibility on developers to validate ownership, signer status, account mutability, and program-specific invariants.

### 3.2 Ordering and Parallel Execution

Solana’s architecture separates transaction ordering from parallel execution more explicitly than Ethereum.

Transactions that touch disjoint account sets can be executed in parallel, while transactions that conflict over writable accounts must be ordered relative to each other.

This design can improve throughput under suitable workload conditions. However, it requires developers to reason carefully about account access patterns, account ownership, signer checks, and possible state contention.

A poorly designed Solana program may still face bottlenecks if many transactions compete for the same writable accounts. Therefore, performance depends not only on the protocol architecture but also on application-level account design.

### 3.3 Finality Assumptions

Solana uses a consensus design built around validator voting, leader scheduling, and ordering mechanisms.

In this context, Proof of History should be understood primarily as a time ordering mechanism rather than as a complete standalone consensus protocol. Solana consensus also depends on validator voting and Tower BFT-style assumptions.

For the purposes of this repository, the important point is that Solana’s finality and confirmation model depends on validator votes, network conditions, and platform-specific consensus assumptions.

This document does not attempt to provide a complete formal description of Solana consensus. Instead, Solana is treated as an example of a high-throughput blockchain architecture where validation, account access, and execution scheduling are deeply connected.


---

## 5. Comparative Summary

| Dimension             | Ethereum                                             | Solana                                                                     |
| --------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------- |
| Main validation focus | Signatures, nonce, gas, EVM execution                | Signatures, account ownership, declared account access                     |
| Ordering model        | Block proposer ordering and sequential execution     | Leader scheduling with parallel execution for non-conflicting account sets |
| Execution dependency  | Contract state and EVM rules                         | Explicit account lists and program constraints                             |
| Resource constraint   | Gas                                                  | Fees, compute budget, account storage costs                                |
| Finality perspective  | Fork choice and checkpoint finality                  | Validator voting and confirmation assumptions                              |
| Main developer risk   | Ordering dependence, gas assumptions, external calls | Account validation errors, signer errors, account contention               |


---

## 6. Security Perspective

Consensus and validation directly affect security.

A platform’s consensus mechanism determines how participants agree on transaction ordering and ledger history. Its validation rules determine which transactions are allowed to change state. Its finality model affects how strongly users can rely on accepted transactions.

Security risks can arise when developers misunderstand these assumptions.

Examples include:

* assuming transaction ordering is neutral;
* relying on weak or incomplete authorization checks;
* failing to validate account ownership or signer status;
* misunderstanding finality and confirmation assumptions;
* designing applications that depend on off-chain assumptions not enforced by the protocol.

For this reason, consensus and validation should not be treated as purely protocol-level topics. They also influence application security, smart contract design, and user trust.

---

## 7. Relevance to the Original Application

The original decentralized tourism application involved reservations, payments, user accounts, and off-chain storage references.

These features depend on validation and ordering assumptions:

* payment transactions must be authorized by the correct user;
* reservation state must be updated consistently;
* smart contract or program logic must prevent unauthorized changes;
* off-chain references must be associated with valid on-chain records;
* users must know when a transaction can be considered accepted.

Ethereum and Solana handle these concerns through different mechanisms. This makes consensus and validation an important part of the broader architectural comparison.

In Ethereum, the application must account for gas usage, transaction ordering, and contract state dependencies.

In Solana, the application must account for account ownership, signer requirements, writable account constraints, and possible state contention.


These differences show that consensus and validation are not isolated protocol details. They shape the practical design of decentralized applications.

---

## Scope

This document provides an architecture level comparison of consensus and validation concepts.

It does not provide:

* a complete formal consensus specification;
* a full proof of safety or liveness;
* a benchmark of confirmation time;
* a detailed analysis of validator economics;
* a production level security audit.

These topics require deeper protocol specific analysis and are outside the scope of this repository.

---

## References Used

This document is supported by the following references listed in [Literature Review and References](../academic-notes/literature-review.md):

* Nakamoto, *Bitcoin: A Peer-to-Peer Electronic Cash System*
* Lamport, Shostak, and Pease, *The Byzantine Generals Problem*
* Castro and Liskov, *Practical Byzantine Fault Tolerance*
* Buterin and Griffith, *Casper the Friendly Finality Gadget*
* Yakovenko, *Solana: A New Architecture for a High Performance Blockchain*
* Ethereum Documentation
* Solana Documentation

---

## Navigation

* [Back to README](../README.md)
* Previous: [Blockchain Architectures](blockchain-architectures.md)
* Next: [Storage Models](storage-models.md)
