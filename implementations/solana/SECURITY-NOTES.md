# Security Notes — Solana Tourism Prototype

## Scope

This document records security observations for the Solana implementation of the tourism DApp prototype.

The objective is not to claim that the application is production-ready. The goal is to make the security assumptions, limitations, and possible improvements explicit for academic review.

## Security Status

This implementation should be considered a prototype.

It demonstrates wallet interaction, Solana account creation, transaction signing, IPFS metadata references, and basic purchase logic. However, several important checks are either incomplete or handled outside the on-chain program.

## Main Assumptions

The current implementation assumes that:

* users interact through a Solana wallet and sign transactions locally;
* the frontend prepares article and purchase metadata;
* rich metadata is stored off-chain through IPFS/Pinata;
* the Solana program stores only references and selected identifiers on-chain;
* the frontend calls the correct Solana instructions with expected values;
* the local development environment is trusted.

These assumptions are acceptable for a prototype, but they must be reduced or replaced by stronger program-level checks in a production-oriented design.

## Sensitive Material

Real API keys, wallet files, private keys, and local environment files must not be committed to the repository.

The repository should include only `.env.example`, which contains placeholder values.

Files such as the following must remain ignored:

```text
.env
.env.local
.env.*.local
id.json
*keypair*.json
*wallet*.json
*.pem
*.key
```

If real Pinata credentials were previously exposed, they should be revoked and regenerated before any further use.

## Observed Limitations

### 1. Off-chain metadata is not fully enforced on-chain

The program stores IPFS CIDs, but fields such as price, quantity, title, and description are stored off-chain.

The program can verify that a payment amount is greater than zero, but it does not independently verify that the transferred amount corresponds to an authoritative on-chain price.

Implication: a modified or malicious client could attempt to submit values that differ from the intended frontend behavior.

### 2. Stock accounting is frontend-dependent

Stock updates are represented by modifying off-chain metadata and updating the corresponding CID.

The Solana program does not currently enforce stock limits or prevent inconsistent stock updates.

Implication: inventory consistency depends on the correctness of the frontend workflow and the integrity of the off-chain metadata process.

### 3. Pinata credentials are exposed if used with `NEXT_PUBLIC_`

In Next.js, environment variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

This means that Pinata API keys placed in `NEXT_PUBLIC_PINATA_API_KEY` or `NEXT_PUBLIC_PINATA_SECRET_API_KEY` are not secret from the user.

Implication: this design is acceptable only for local testing. A safer design should route uploads through a backend API route or use a delegated upload mechanism.

### 4. Access control should be explicit

The article account is derived from the article identifier and seller public key. This helps bind an article to a seller.

However, critical ownership conditions should still be documented and enforced explicitly in the program through Anchor constraints or `require!` checks.

Relevant checks include:

* only the seller can update an article;
* only the seller can delete an article;
* the seller account used during purchase matches the seller stored in the article account;
* article identifiers cannot create unintended account collisions.

### 5. Purchase history increases on-chain cost

Creating a purchase-history account for each purchase makes the transaction more traceable, but it also increases on-chain storage cost.

On Solana, creating accounts requires lamports for rent-exemption or storage allocation.

Implication: storing every purchase history as a separate on-chain account may be expensive and should be justified. An alternative design could store only minimal purchase commitments on-chain and keep detailed history off-chain.

### 6. Error handling and consistency are incomplete

Some cleanup operations, such as unpinning IPFS metadata after a failed transaction, are handled by the frontend.

These operations are useful during development, but they should not be treated as strong consistency guarantees.

Implication: failure between off-chain upload and on-chain transaction confirmation may create unused or inconsistent metadata.

## Suggested Improvements

The following improvements would make the implementation more robust:

* move price on-chain if payment correctness must be enforced;
* move stock on-chain if inventory consistency is required;
* add explicit seller authorization checks;
* verify that the seller passed to the purchase instruction matches the article seller;
* avoid exposing Pinata credentials in the frontend;
* introduce backend/API routes for IPFS uploads;
* add tests for unauthorized update and delete attempts;
* add tests for invalid purchase amounts;
* add tests for repeated purchases and stock-related edge cases;
* document which rules are enforced on-chain and which remain frontend-dependent.

## Academic Interpretation

From an academic perspective, this implementation is useful because it shows a practical trade-off in Solana application design.

Keeping only CIDs and minimal ownership information on-chain reduces storage cost, but it weakens direct program-level enforcement of application rules such as price and stock consistency.

This trade-off should be discussed in the main study under storage models, transaction validation, and security assumptions.

## Conclusion

The Solana implementation is suitable as a documented prototype.

It demonstrates important blockchain development concepts, but it should not be described as a secure production marketplace. Its value in this repository is to support comparative analysis and to expose concrete design trade-offs between on-chain enforcement, off-chain storage, frontend responsibility, and account creation cost.
