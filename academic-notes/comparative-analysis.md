# Comparative Analysis

## Overview

This document presents the comparative analysis of Ethereum and Solana based on the methodology defined in [Methodology](./methodology.md).

The objective is not to determine which platform is universally superior. Instead, the analysis examines how different architectural choices influence state representation, transaction execution, concurrency, storage, authorization, security assumptions, and developer-facing abstractions.

The comparison follows the analytical dimensions defined in the methodology:

1. state and account representation;
2. transaction execution;
3. concurrency and scheduling;
4. storage and data availability;
5. authorization and security;
6. developer abstractions.

The analysis distinguishes between **platform-level architectural observations** and **implementation-specific observations** derived from the decentralized application prototypes included in this repository.

Implementation evidence is used to illustrate architectural concepts, not to generalize the behavior of an entire platform from a single application.

---

## 1. State and Account Representation

### 1.1 Ethereum

Ethereum represents application state within a global account-based state model.

Smart contracts are deployed as contract accounts containing executable code and persistent storage. Application state is therefore commonly associated directly with the contract responsible for managing it.

From the developer perspective, a Solidity contract combines:

* application logic;
* persistent variables;
* mappings;
* structs;
* authorization rules;
* functions that modify state.

This creates a relatively direct relationship between the application component and the state it controls.

For example, a marketplace contract can maintain a mapping from product identifiers to product structures and modify those structures during purchases.

The contract itself defines both the data representation and the rules governing its modification.

### 1.2 Solana

Solana separates program logic from persistent application state more explicitly.

Programs contain executable logic, while mutable state is stored in accounts supplied to program instructions.

Programs therefore operate on external state objects rather than maintaining internal contract storage in the Ethereum sense.

Account ownership is central to this model. A program can modify accounts it owns, while transactions explicitly provide the accounts required by an instruction.

Program Derived Addresses provide a mechanism for deriving deterministic program-controlled accounts without requiring a corresponding private key.

As a result, application design requires explicit decisions regarding:

* which accounts represent application objects;
* which program owns those accounts;
* which accounts are writable;
* which accounts must sign;
* how account addresses are derived;
* how relationships between accounts are validated.

### 1.3 Comparative Observation

The primary difference is therefore not whether the platforms support persistent state; both do.

The difference lies in **how state is associated with executable logic and exposed to developers**.

Ethereum generally provides a contract-centered abstraction:

```text
contract
├── executable logic
└── persistent contract storage
```

Solana provides a more explicit separation:

```text
program
├── executable logic
└── operates on → accounts containing state
```

This architectural difference influences application decomposition.

Ethereum allows developers to reason primarily about contract-owned state and function calls.

Solana requires developers to reason more explicitly about account identity, ownership, mutability, derivation, and relationships between state objects.

The resulting trade-off can be summarized as:

> Ethereum emphasizes a unified contract-and-storage abstraction, while Solana exposes state organization and access patterns more explicitly to both the developer and the runtime.

---

## 2. Transaction Execution

### 2.1 Ethereum

Ethereum transactions may transfer value, deploy contracts, or invoke functions on deployed smart contracts.

Smart contract execution occurs within the Ethereum Virtual Machine.

Execution is deterministic and resource consumption is controlled through gas.

A transaction interacting with a contract can:

1. invoke a contract function;
2. read existing contract state;
3. execute application logic;
4. call additional contracts;
5. update persistent state;
6. emit events.

The execution environment therefore combines general programmable execution with a resource-accounting mechanism based on gas.

Application-level validity can depend on the current contract state.

For example, a purchase operation may verify that an item exists, sufficient stock remains, and the submitted payment corresponds to the required price before updating contract state.

### 2.2 Solana

Solana transactions contain instructions executed by programs.

Each instruction receives a defined set of accounts that the program may inspect or modify.

Consequently, the state dependencies required for execution are more explicit before program execution begins.

In an Anchor-based application, account structures and constraints can express requirements concerning:

* initialization;
* writable state;
* signer status;
* Program Derived Addresses;
* account allocation;
* account closure.

Program execution then applies state transitions to the supplied accounts.

### 2.3 Comparative Observation

Both platforms provide deterministic programmable state transitions, but they expose execution dependencies differently.

In Ethereum, much of the state dependency is discovered through contract execution:

```text
transaction
→ contract function
→ contract storage
→ possible external contract calls
```

In Solana, relevant state objects are explicitly supplied to instructions:

```text
transaction
→ instruction
→ declared accounts
→ program execution
```

The difference affects both execution and developer responsibilities.

Ethereum provides a comparatively implicit state-access abstraction through contract storage.

Solana makes account dependencies more explicit as part of transaction construction.

This explicitness is directly related to Solana's execution scheduling model.

---

## 3. Concurrency and Scheduling

### 3.1 Ethereum

Ethereum transaction execution is predominantly sequential at the base execution level.

Transactions modifying shared state are applied in an ordered sequence.

This provides a comparatively uniform execution model because the result of one transaction becomes part of the state observed by subsequent transactions.

However, sequential execution also means that transaction ordering can influence application behavior.

Two transactions interacting with the same contract state may produce different outcomes depending on their order.

This makes ordering particularly relevant for applications involving:

* financial operations;
* marketplaces;
* reservations;
* shared liquidity;
* ownership transitions.

### 3.2 Solana

Solana exposes account access information as part of transaction execution.

Transactions operating on independent account sets can potentially be executed concurrently.

Transactions competing for the same writable accounts must instead be ordered relative to one another.

Parallel execution is therefore dependent on the application's account-access structure.

This means that the architecture alone does not guarantee that every application receives the same degree of parallelism.

An application that concentrates many operations on a small number of shared writable accounts may introduce contention even though the underlying runtime supports parallel execution.

### 3.3 Comparative Observation

The two architectures expose a different relationship between state design and execution scheduling.

For Ethereum:

```text
shared global state
+
predominantly sequential execution
```

For Solana:

```text
explicit account access
+
parallel execution when account sets do not conflict
```

This creates an architectural trade-off.

Ethereum's execution model provides a relatively simple ordering abstraction but limits base-level parallelism.

Solana exposes more information about state dependencies to the runtime, enabling parallel scheduling where possible, but requiring developers to consider account contention as part of application design.

Therefore:

> state representation is not independent from execution performance; the way an application partitions mutable state can influence its opportunities for concurrent execution.

This relationship is particularly visible in Solana, where account design and scheduling are directly connected.

---

## 4. Transaction Validation, Ordering, and Finality

Transaction execution cannot be analyzed independently from validation and ordering.

Both platforms require valid signatures, sufficient resources, and compliance with protocol and application-level rules, but the mechanisms exposed to developers differ.

### 4.1 Ethereum

Ethereum transaction validation includes mechanisms such as:

* sender authentication;
* nonce validation;
* balance and fee requirements;
* deterministic EVM execution;
* contract-level conditions.

The protocol authenticates the transaction sender, but individual contracts remain responsible for deciding whether that sender is authorized to perform a specific application operation.

Transactions are ordered within blocks, and contract execution follows that ordering.

Consequently, application behavior can be sensitive to transaction position when several transactions interact with shared state.

Ethereum also distinguishes transaction inclusion from stronger consensus finality.

Applications should therefore avoid treating initial inclusion as an absolute and immediate finality guarantee.

### 4.2 Solana

Solana transaction validation includes:

* signatures;
* account requirements;
* account ownership;
* writable and read-only access;
* program-specific constraints;
* compute and fee requirements.

Program instructions additionally validate whether supplied accounts satisfy application-specific assumptions.

Ordering interacts with the account access model.

Transactions that require conflicting writable accounts cannot simply execute independently, whereas transactions involving disjoint account sets can be scheduled concurrently.

As with Ethereum, application developers must also distinguish transaction processing from the stronger finality assumptions provided by the consensus system.

### 4.3 Comparative Observation

The core distributed ledger requirement is similar:

```text
authenticate
→ validate
→ order
→ execute
→ update replicated state
```

However, the architectures expose different parts of this process to application developers.

Ethereum application validation is strongly centered around contract logic and current contract state.

Solana application validation additionally makes account identity, ownership, signer status, and account relationships central developer-visible concerns.

The result is not a difference between "validated" and "unvalidated" systems, but a difference in **where validation responsibilities appear in the programming model**.

---

## 5. Storage and Data Availability

### 5.1 On-Chain Storage

Both platforms support persistent on-chain application state.

On-chain state provides strong integration with blockchain execution because smart contracts or programs can directly enforce rules over data represented in ledger state.

However, replicated blockchain storage is a constrained resource.

The platforms expose these constraints through different mechanisms.

Ethereum developers must consider gas and the cost associated with contract storage.

Solana developers must consider account allocation, account size, ownership, and the resources required to maintain state accounts.

Therefore, storing all application information directly on-chain may be undesirable for large or descriptive data.

### 5.2 Off-Chain Storage

Both application architectures can use external storage for data that does not require direct enforcement by blockchain execution.

Content-addressed systems such as IPFS allow an application to store a reference to external content on-chain while keeping larger content outside blockchain state.

A content identifier can provide an integrity relationship between the on-chain reference and the expected external data.

However:

> integrity does not imply availability.

The existence of a valid CID does not guarantee that the associated content will remain accessible.

External storage therefore introduces additional operational assumptions involving:

* pinning;
* gateways;
* replication;
* external infrastructure;
* long-term availability.

### 5.3 Comparative Observation

The fundamental storage trade-off applies to both platforms:

```text
more data on-chain
→ stronger direct enforcement
→ greater blockchain resource consumption

more data off-chain
→ lower on-chain storage requirements
→ greater dependence on external systems
```

The platform-specific difference lies primarily in the representation of the on-chain component.

Ethereum commonly stores application state directly inside contract storage.

Solana commonly distributes persistent application state across program-owned accounts.

In both cases, developers must identify which information must be directly available to blockchain execution and which information can safely remain external.

---

## 6. Implementation-Based Storage Observation

The tourism marketplace implementations provide a concrete example of how storage placement affects application enforcement.

This observation is **implementation-specific** and should not be interpreted as an inherent limitation of either blockchain platform.

### 6.1 Ethereum Marketplace Prototype

In the Ethereum marketplace implementation, the `Produit` structure contains fields including:

```text
id
name
image
price
quantity
description
creator
```

The product mapping therefore maintains the price and quantity directly in contract state.

During a purchase, the contract can use this state to enforce application rules.

Conceptually, the purchase operation follows:

```text
retrieve product
→ verify available quantity
→ calculate price × quantity
→ verify submitted ETH
→ decrease stock
→ record purchase
→ transfer payment
```

Because price and quantity are represented in contract state, they can participate directly in on-chain validation.

### 6.2 Solana Marketplace Prototype

The Solana implementation uses an `Article` account containing:

```text
seller
article_id
cid
```

Additional product information such as:

* price;
* quantity;
* title;
* description;
* image information

is maintained in off-chain metadata referenced through the CID.

The `buy_article` instruction receives a `total_price` value and verifies that it is greater than zero before performing the transfer.

The program does not currently compare this value against an authoritative price stored in the `Article` account because such a price is not present in that account.

Similarly, stock consistency is not fully enforced by the current on-chain program.

### 6.3 Derived Observation

The implementations demonstrate the following relationship:

```text
data placement
→ available validation information
→ application enforcement boundary
```

In the Ethereum prototype:

```text
price + stock on-chain
→ contract can validate price + stock
→ stronger on-chain enforcement of purchase rules
```

In the current Solana prototype:

```text
price + stock off-chain
→ program lacks authoritative on-chain values
→ part of correctness depends on frontend/off-chain workflow
```

This is a significant implementation-level security observation.

However, it is important to distinguish the result from a platform-level conclusion.

Solana does not inherently require prices or quantities to remain off-chain. The program could store these values inside the `Article` account and validate them during `buy_article`.

Therefore, the evidence supports the narrower conclusion:

> the security properties of a decentralized application depend not only on the underlying blockchain architecture, but also on how application designers distribute authoritative state between on-chain and off-chain components.

This example illustrates why storage decisions are directly connected to validation and security.

---

## 7. Authorization and Security

### 7.1 Ethereum

Ethereum authenticates transactions initiated by externally owned accounts through digital signatures.

Once execution reaches a smart contract, however, the application must enforce its own authorization requirements.

Common developer-facing concerns include:

* incorrect access-control logic;
* unintended external calls;
* reentrancy;
* transaction-ordering assumptions;
* gas-related denial-of-service conditions;
* incorrect state-transition logic.

Contract composability increases application flexibility but also means that a contract may interact with code outside its direct control.

Security reasoning must therefore consider execution across contract boundaries.

### 7.2 Solana

Solana exposes a different set of developer-facing security responsibilities.

Because programs receive accounts explicitly, application correctness depends heavily on validating those accounts.

Relevant checks include:

* signer requirements;
* account ownership;
* expected account addresses;
* writable permissions;
* PDA derivation;
* relationships between supplied accounts;
* program-specific invariants.

Frameworks such as Anchor can express many of these constraints declaratively.

However, using a framework does not eliminate the underlying requirement to understand the account model.

Missing or incorrect constraints can still produce invalid authorization assumptions.

### 7.3 Comparative Observation

The architectures shift security complexity toward different abstractions.

Ethereum emphasizes:

```text
contract logic
+ external interaction
+ access control
+ ordering
+ gas
```

Solana emphasizes:

```text
account identity
+ ownership
+ signer validation
+ PDA constraints
+ explicit state access
```

This suggests an important general observation:

> blockchain security cannot be separated from the platform's programming and state abstractions.

The platforms do not merely expose different APIs for implementing equivalent logic.

Their architectural models influence which assumptions developers must make explicit and which classes of implementation errors require particular attention.

---

## 8. Developer Abstractions

### 8.1 Ethereum

Ethereum provides a contract-oriented programming abstraction.

A developer typically defines a contract containing:

* state variables;
* functions;
* modifiers;
* events;
* mappings;
* interactions with other contracts.

This abstraction provides a direct mental model:

```text
call contract
→ execute function
→ read/write contract state
```

The model supports strong composability because deployed contracts can call other contracts.

However, developers must understand the security consequences of these interactions and the gas costs associated with computation and storage.

### 8.2 Solana

Solana development separates program logic, accounts, and transaction construction more explicitly.

A developer must reason about:

* program instructions;
* account structures;
* account ownership;
* signer accounts;
* writable accounts;
* PDAs;
* account allocation;
* cross-program interactions.

In Anchor, some of this complexity is represented through Rust types and account constraints.

The resulting mental model is closer to:

```text
construct instruction
+ provide required accounts
+ satisfy account constraints
→ execute program logic
→ update selected accounts
```

### 8.3 Comparative Observation

Ethereum hides part of state-access management behind the contract abstraction.

Solana exposes more of this structure to developers and to the runtime.

This creates different forms of complexity.

Ethereum developers must reason carefully about contract state, composability, external calls, and gas.

Solana developers must reason carefully about account graphs, ownership, constraints, state allocation, and contention.

Neither model removes complexity; instead, the architectures place complexity at different layers.

---

## 9. Cross-Dimensional Comparison

The previous sections show that the comparative dimensions are strongly interconnected.

| Dimension                        | Ethereum                                                           | Solana                                                    | Main Trade-off                                                        |
| -------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------- | --------------------------------------------------------------------- |
| State representation             | Contract-associated persistent storage within global account state | State stored in explicitly supplied accounts              | Unified contract state vs explicit state decomposition                |
| State ownership                  | Contract-controlled storage                                        | Program-owned accounts                                    | Implicit contract boundary vs explicit account ownership              |
| Execution                        | EVM contract execution                                             | Program execution over supplied accounts                  | Contract-centered vs account-centered execution                       |
| Scheduling                       | Predominantly sequential                                           | Parallel when account access does not conflict            | Simpler ordering model vs explicit concurrency opportunities          |
| Resource model                   | Gas                                                                | Compute and account-related resource constraints          | Different mechanisms for exposing execution/storage cost              |
| Authorization                    | Sender authentication plus contract-level checks                   | Signatures plus account ownership and program constraints | Contract authorization vs explicit account validation                 |
| Storage                          | Contract storage plus optional external storage                    | Program-owned accounts plus optional external storage     | Different on-chain representations, similar hybrid-storage trade-offs |
| Main developer security concerns | Contract logic, access control, external calls, ordering           | Account validation, ownership, signer checks, PDAs        | Security risks follow platform abstractions                           |
| Developer model                  | Contract-oriented                                                  | Program-and-account-oriented                              | More implicit state access vs more explicit dependencies              |

The table should not be interpreted as a ranking.

Instead, it shows how multiple architectural properties reinforce one another.

For example, Solana's account model is simultaneously related to:

* state representation;
* authorization;
* parallel execution;
* resource allocation;
* developer complexity.

Similarly, Ethereum's contract abstraction is simultaneously related to:

* persistent storage;
* composability;
* authorization logic;
* sequential state transitions;
* gas consumption.

Architectural properties should therefore not be evaluated independently.

---

## 10. Main Comparative Findings

Several findings emerge from the analysis.

### Finding 1 — Core distributed ledger properties can be implemented through substantially different abstractions

Both Ethereum and Solana provide persistent state, transaction validation, programmable execution, authorization mechanisms, replicated ledger updates, and auditable transaction histories.

However, these properties are exposed through different architectural structures.

Distributed ledger functionality therefore does not imply a single universal implementation model.

### Finding 2 — State representation influences execution architecture

Ethereum associates application state closely with smart contracts.

Solana separates executable programs from state accounts and requires account access to be declared more explicitly.

This difference contributes directly to their different execution and scheduling models.

The relationship can be summarized as:

```text
state model
→ state access visibility
→ scheduling possibilities
```

### Finding 3 — Parallel execution transfers part of the complexity to state design

Solana's ability to execute non-conflicting transactions concurrently depends on account-access patterns.

Consequently, application developers influence potential contention through the way they partition state.

Parallelism is therefore not only a protocol characteristic; its practical usefulness also depends on application architecture.

### Finding 4 — Security risks follow architectural abstractions

Ethereum's contract-oriented model makes contract logic, composability, access control, external calls, and transaction ordering important security concerns.

Solana's account-centric model makes account validation, ownership, signer constraints, PDA derivation, and explicit state access particularly important.

The architecture shapes the security assumptions exposed to developers.

### Finding 5 — Off-chain storage changes the application trust boundary

Moving information outside blockchain state can reduce on-chain resource requirements, but it also removes some information from direct protocol or program enforcement.

Content-addressed references can support integrity, but they do not independently guarantee availability.

Furthermore, application-critical data stored only off-chain cannot automatically participate in on-chain validation unless it is supplied through an additional trusted or verifiable mechanism.

### Finding 6 — Implementation decisions must not be confused with protocol limitations

The tourism prototypes illustrate particular design choices, not the only possible application architectures on Ethereum or Solana.

For example, the stronger on-chain price and stock enforcement found in the Ethereum marketplace prototype results from storing those fields in contract state.

The current Solana prototype could implement similar enforcement by moving authoritative price and stock information into program-controlled accounts.

Implementation evidence therefore helps explain architectural consequences, but platform-level conclusions require broader technical evidence.

---

## 11. Relation to the Research Questions

### RQ1 — State and Account Representations

Ethereum and Solana differ primarily in how executable logic relates to persistent state.

Ethereum commonly associates state directly with contract storage, while Solana separates programs from program-owned state accounts.

This influences ownership, access patterns, authorization, and application decomposition.

### RQ2 — Transaction Execution and Concurrency

Ethereum provides predominantly sequential transaction execution through the EVM.

Solana exposes account dependencies explicitly and can execute transactions concurrently when account access does not conflict.

The trade-off is between a comparatively uniform execution abstraction and a model in which account design becomes more closely connected to scheduling and contention.

No quantitative performance ranking is derived from this study.

### RQ3 — Storage and Data Availability

Both platforms support hybrid application architectures combining on-chain state with external data storage.

Moving information off-chain can reduce blockchain resource consumption but introduces integrity, availability, and infrastructure assumptions.

The implementation analysis further demonstrates that moving authoritative application data off-chain can reduce the set of rules that can be enforced directly by program execution.

### RQ4 — Trust and Security Assumptions

Ethereum emphasizes contract-level authorization, external-call behavior, gas, shared-state transitions, and transaction ordering.

Solana emphasizes account identity, ownership, signer checks, writable access, PDA constraints, and account relationships.

Security assumptions therefore reflect the underlying architectural and programming models.

### RQ5 — Platform Trade-offs

The study does not identify one universally superior platform.

Instead, it identifies different architectural priorities.

Ethereum provides a highly integrated contract abstraction and strong composability, while its execution and gas model impose their own constraints.

Solana exposes state dependencies more explicitly and enables parallel execution for suitable workloads, while requiring developers to manage account structures and constraints carefully.

These differences involve trade-offs between abstraction, execution flexibility, state organization, resource management, and developer-visible complexity.

### RQ6 — Smart Contract Abstractions and Developer Experience

Ethereum exposes a contract-centered development model in which logic and persistent contract state are closely associated.

Solana exposes a program-and-account model in which state objects, account access, ownership, and constraints are more explicit.

As a result, developers solve similar application problems through different programming abstractions and must reason about different categories of implementation risk.

---

## 12. Scope of the Findings

The conclusions presented here should be interpreted within the scope defined in the methodology.

The study:

* compares only Ethereum and Solana;
* is primarily qualitative;
* does not provide controlled performance benchmarks;
* does not establish formal security proofs;
* uses specific decentralized application prototypes as implementation evidence;
* does not assume that every implementation choice observed in the prototypes is imposed by the underlying platform.

The comparative findings therefore describe architectural relationships and implementation consequences supported by the examined evidence.

They should not be interpreted as universal claims about all blockchain systems or all applications deployed on Ethereum and Solana.

---

## Conclusion

Ethereum and Solana support many of the same high-level distributed ledger properties, but they realize those properties through substantially different architectural abstractions.

Ethereum organizes decentralized application development around smart contracts executing within the EVM and maintaining persistent contract-associated state.

Solana separates program logic from account-based state and exposes account access patterns explicitly to the runtime and developer.

These differences propagate across multiple dimensions:

```text
architecture
↓
state representation
↓
execution model
↓
resource management
↓
developer abstractions
↓
security assumptions
```

The analysis therefore suggests that blockchain architecture should not be evaluated only in terms of individual features such as transaction execution or storage.

Architectural decisions interact with one another and determine how developers represent state, enforce application rules, reason about concurrency, distribute data, and manage security assumptions.

The implementation examples reinforce this conclusion.

In particular, the comparison of on-chain and off-chain application state demonstrates that design decisions can change the boundary between what the blockchain can enforce directly and what must be trusted or validated elsewhere.

The main observation of this study can therefore be expressed as:

> Different blockchain architectures can support similar distributed ledger properties while exposing fundamentally different state, execution, resource, and security abstractions to application developers.

The next stage of the study extracts broader research observations from these comparative findings while preserving the distinction between architectural evidence and implementation-specific conclusions.

---

## Navigation

* [Back to README](../README.md)
* Previous: [Methodology](./methodology.md)
* Next: [Research Observations](./research-observations.md)
