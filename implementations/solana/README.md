# Solana Implementation — Tourism DApp Prototype

## Purpose

This directory contains the Solana implementation of a tourism-oriented decentralized application prototype.

The implementation is included as practical evidence for the broader `blockchain-abstractions-study` repository. Its purpose is not to present a production-ready marketplace, but to document how a Solana/Anchor application can be structured, executed, and analyzed from an architectural and security perspective.

This prototype supports the study of:

* Solana account-based execution;
* Program Derived Accounts;
* transaction signing through wallet integration;
* hybrid on-chain/off-chain storage;
* IPFS metadata references;
* implementation-level security assumptions.

## Technical Stack

* Solana
* Rust
* Anchor framework
* Next.js
* React
* TypeScript
* Solana wallet adapter
* IPFS metadata references through Pinata

## Implemented Functionality

The prototype implements the following application-level operations:

1. Connect a Solana wallet.
2. Create a tourism article using the `create_article` instruction.
3. Store article metadata off-chain and keep the associated IPFS CID in an `Article` account.
4. Display articles by reading Solana accounts and fetching the corresponding off-chain metadata.
5. Update article metadata by replacing the stored CID through the `update_article` instruction.
6. Delete an article account through the `delete_article` instruction.
7. Purchase an article through the `buy_article` instruction.
8. Transfer SOL from the buyer to the seller during purchase.
9. Create a `PurchaseHistory` account for the purchase.
10. Emit an `ArticlePurchased` event after a successful purchase.

## Directory Structure

```text
implementations/solana/
├── anchor/                     # Anchor workspace and Solana program
│   ├── programs/               # Rust on-chain program
│   ├── tests/                  # Anchor tests
│   └── Anchor.toml
├── src/                        # Next.js frontend source code
│   ├── app/                    # Application routes
│   └── components/             # Wallet, article, purchase, and IPFS components
├── public/                     # Static frontend assets
├── diagrams/                   # Solana implementation-specific diagrams
├── SECURITY-NOTES.md           # Security assumptions and limitations
├── .env.example                # Example environment variables
├── package.json
└── package-lock.json
```

## Solana Program Model

The Solana implementation is based on an Anchor program named `tourism_marketplace`.

The program defines two main account types:

* `Article`: stores the seller public key, an article identifier, and the IPFS CID associated with the article metadata.
* `PurchaseHistory`: stores the buyer public key, seller public key, purchase identifier, and the IPFS CID associated with the purchase-history metadata.

The program exposes four main instructions:

* `create_article`: creates an `Article` account using a Program Derived Address derived from the article identifier and the seller public key.
* `update_article`: updates the IPFS CID stored in an existing `Article` account.
* `delete_article`: closes an existing `Article` account and returns its remaining lamports to the seller.
* `buy_article`: transfers SOL from the buyer to the seller, updates the article CID, creates a `PurchaseHistory` account, and emits an `ArticlePurchased` event.

### Account Derivation

The `Article` account is derived using the following seeds:

```text
article_id + seller public key
```

This binds each article account to a specific seller.

The `PurchaseHistory` account is derived using the following seeds:

```text
history_id + buyer public key
```

This creates a separate purchase-history account for each purchase identifier and buyer.

### Stored Data

The `Article` account stores:

```rust
pub struct Article {
    pub seller: Pubkey,
    pub article_id: String,
    pub cid: String,
}
```

The `PurchaseHistory` account stores:

```rust
pub struct PurchaseHistory {
    pub buyer: Pubkey,
    pub seller: Pubkey,
    pub history_id: String,
    pub cid: String,
}
```

### Event Emission

When a purchase is completed, the program emits an `ArticlePurchased` event containing:

```rust
pub struct ArticlePurchased {
    pub buyer: Pubkey,
    pub seller: Pubkey,
    pub history_id: String,
    pub cid: String,
}
```

This event can be used by off-chain services or frontend logic to observe purchase activity.

### Validation Logic

The current on-chain validation is intentionally limited.

The `buy_article` instruction checks that the submitted `total_price` is greater than zero:

```rust
require!(total_price > 0, ErrorCode::InvalidPrice);
```

The program then transfers lamports from the buyer to the seller using Solana’s system program.

This means that price correctness is not fully enforced on-chain. The program does not compare `total_price` against an authoritative price stored in the `Article` account, because the article price is kept in off-chain metadata.

This is an important limitation of the current prototype and is discussed in `SECURITY-NOTES.md`.

## On-chain and Off-chain Storage

This implementation follows a hybrid storage model.

On-chain data includes:

* account ownership;
* article identifiers;
* seller and buyer public keys;
* IPFS CIDs;
* purchase-history references.

Off-chain data includes:

* article title;
* article description;
* image URL;
* quantity;
* price;
* extended purchase metadata.

This design reduces on-chain storage costs. However, it also means that some application rules are not fully enforced by the Solana program itself.

## Implementation Limitation

The current Solana program stores only limited information on-chain.

The article price, stock quantity, title, description, and image URL are stored off-chain as metadata referenced by an IPFS CID. As a result, the on-chain program cannot fully verify whether the submitted purchase amount matches the intended article price, or whether stock values remain consistent.

This is a prototype trade-off: it reduces account size and on-chain storage cost, but it moves part of the application correctness to the frontend and off-chain metadata workflow.

For stronger enforcement, price and stock should be stored directly in the `Article` account and checked inside the `buy_article` instruction.

## Documentation Note

This README provides an initial explanation of the Solana implementation.

The implementation itself remains unchanged at this stage. The objective here is to document the current state of the prototype clearly before introducing further technical improvements.

Some parts still require future development, especially on-chain price verification, stock consistency, stronger authorization checks, test coverage, and the IPFS upload flow. These limitations are kept explicit because they are relevant to the academic analysis of storage models, validation logic, and security assumptions.

## Local Setup

### Requirements

* Node.js 18 or later
* npm
* Rust
* Solana CLI
* Anchor CLI
* A local Solana validator or a configured Solana cluster

### Install dependencies

```bash
npm install
```

### Configure environment variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with local development values.

Do not commit `.env.local` or any real API key.

Example `.env.example`:

```env
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key_here
NEXT_PUBLIC_PINATA_SECRET_API_KEY=your_pinata_secret_api_key_here
NEXT_PUBLIC_SOLANA_NETWORK=localnet
NEXT_PUBLIC_SOLANA_RPC_URL=http://127.0.0.1:8899
```

Values prefixed with `NEXT_PUBLIC_` are exposed to the browser. This is acceptable only for local testing. A production-oriented version should avoid exposing long-lived Pinata credentials on the client side.

### Build the Anchor program

```bash
npm run anchor-build
```

### Run Anchor tests

```bash
npm run anchor-test
```

### Start the frontend

```bash
npm run dev
```

The frontend should then be available through the local Next.js development server.

## Security Notes

Security assumptions and known limitations are documented separately in [SECURITY-NOTES.md](./SECURITY-NOTES.md).

This separation is intentional. The README describes the implementation, while the security notes document risks, assumptions, and possible improvements.

## Role in the Main Study

Within `blockchain-abstractions-study`, this implementation supports the following research dimensions:

* Solana account model and Program Derived Accounts;
* transaction signing through wallet integration;
* hybrid storage using IPFS CIDs;
* comparison with Ethereum and EOSIO implementations;
* basic security analysis of smart contract and frontend assumptions.

## Status

This implementation is a prototype derived from an undergraduate final-year project and reorganized for academic documentation.

It is accepted in its current form as an initial implementation baseline. It should be read as implementation evidence, not as a production deployment.

The current documentation describes the existing implementation and identifies points that may be improved later.
