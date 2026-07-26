# Blockchain & Web3: Introduction to All Topics

This document is a guided tour of the 6 sections in the Blockchain & Web3 knowledge base — a production-focused reference for engineers building, auditing, and operating on-chain systems. The content targets staff-level engineers and covers everything from the cryptographic primitives that underpin every chain, through the Bitcoin and Ethereum protocols, to DeFi smart contracts and the full-stack Web3 developer toolchain.

**Suggested learning path:** Blockchain Fundamentals → Applied Cryptography → Bitcoin Protocol → Ethereum & EVM → DeFi Protocols → Web3 Development

---

## 01. Blockchain Fundamentals

A blockchain is a distributed, append-only ledger secured by cryptographic links between blocks and a consensus protocol that coordinates mutually distrusting peers. This section builds the foundation: the data structures that make the ledger tamper-evident, the algorithms that keep it consistent, and the network that keeps it decentralized.

**What's covered:**
- **Distributed Ledgers & the Trilemma** — centralized vs distributed vs decentralized systems; Byzantine Fault Tolerance; CAP applied to chains (sacrifice consistency for availability, converge eventually); permissioned (Hyperledger, trusted consortium ≈ distributed DB) vs permissionless (trustless, censorship-resistant); the security / decentralization / scalability trilemma; immutability is *economic* (cost to rewrite ≥ 50% hash power), not mathematically absolute.
- **Hash Functions & Merkle Trees** — SHA-256 (Bitcoin) and Keccak-256 (Ethereum), 256-bit digests; preimage, second-preimage, and collision resistance (birthday bound ≈2^(n/2), so 128-bit collision security for a 256-bit digest); the avalanche effect (one input bit flips ≈½ the output bits); Merkle root of height ⌈log₂ N⌉ commits N txs in 32 bytes; a Merkle proof verifies membership with O(log N) sibling hashes (basis of SPV light clients); Ethereum's Merkle-Patricia trie commits mutable world state in `stateRoot`.
- **Consensus Mechanisms** — Nakamoto PoW: brute-force H(header ‖ nonce) < target T, difficulty retargets every 2016 blocks (20160-min epoch, clamped to [¼, 4]), longest-cumulative-work chain wins; PoS: 32 ETH stake-weighted proposer selection with slashing to solve nothing-at-stake; BFT (PBFT, Tendermint, HotStuff) gives deterministic finality with f < N/3 but halts under partition; Nakamoto reversal odds fall as ≈(q/p)ᵏ in confirmations k (why exchanges wait 6).
- **Network Architecture & P2P** — gossip block propagation, Kademlia DHT, peer discovery via DNS seeds and bootstrap nodes, propagation latency, eclipse attacks, network partitioning.
- **Cryptographic Primitives** — elliptic-curve groups (secp256k1, ed25519), scalar multiplication as the one-way trapdoor, ECDH key exchange, hierarchical-deterministic wallets (BIP-32/39/44), mnemonic seed phrases.

**Key mental models:** Immutability is enforced by the economic cost of rewriting, not by impossibility — confirmations buy probabilistic finality. Consensus exists to defeat Sybil attacks by binding voting power to a scarce resource (hash power, stake, or a known validator set). A Merkle proof shows inclusion in a *block*, not that the block is on the *canonical chain* — full validation still walks the header chain to genesis.

---

## 02. Applied Cryptography

Blockchain security rests entirely on cryptographic hardness assumptions. This section covers the schemes every chain relies on: signatures that authorize transactions, zero-knowledge proofs that scale and privatize them, and the commitment, MPC, and post-quantum machinery around them.

**What's covered:**
- **ECDSA & Digital Signatures** — secp256k1 (y² = x³ + 7 mod p, p = 2²⁵⁶ − 2³² − 977); public key K = d·G, security from the EC discrete-log problem; signing (r, s) with s = k⁻¹(z + r·d) mod n; the nonce catastrophe — reuse k and d = (s₁k − z₁)·r⁻¹ falls out (PS3 hack), defended by RFC 6979 deterministic k = HMAC-SHA256(d, z); malleability ((r, s) and (r, n − s) both valid) fixed by the low-S rule (BIP 62); Schnorr (BIP 340) with linear s = k + e·d enabling MuSig2 aggregation into a single 64-byte signature.
- **Zero-Knowledge Proofs** — completeness / soundness / zero-knowledge; the sigma-protocol commit–challenge–response skeleton (soundness from witness extraction, ZK from transcript simulation); Fiat-Shamir c = H(t ‖ statement) makes proofs non-interactive; R1CS constraints (a·w)(b·w) = (c·w) compiled to a QAP divisibility check A(x)B(x) − C(x) = H(x)Z(x); Groth16 (~200-byte proof, per-circuit trusted setup / toxic waste) vs PLONK (universal setup) vs STARK (transparent, FRI low-degree test, post-quantum, larger proofs); prove O(N log N) / verify O(1) SNARK or O(log² N) STARK; zkEVMs (zkSync, Scroll, Polygon).
- **Commitment Schemes** — hiding vs binding; Pedersen (perfectly hiding, computationally binding on DL); KZG polynomial commitments; vector and hash-based commitments (perfectly binding); commit-reveal for MEV protection and sealed-bid auctions.
- **Multi-Party Computation** — Shamir (t, n) secret sharing, threshold signatures (TSS), distributed key generation (DKG); threshold ECDSA (GG18, CGGMP21) signs *without ever reconstructing* d — the correct basis for MPC wallets; garbled circuits, oblivious transfer.
- **Post-Quantum Cryptography** — Shor's algorithm breaks ECC/RSA; lattice-based CRYSTALS-Kyber (KEM) and Dilithium (signatures); hash-based XMSS and SPHINCS+; NIST PQC standards; harvest-now/decrypt-later drives early migration of long-lived keys.

**Key mental models:** Never reuse an ECDSA nonce — one collision leaks the private key; always use RFC 6979. SNARKs give tiny proofs and O(1) verification but need a trusted setup and aren't quantum-safe; STARKs are transparent and post-quantum at the cost of proof size. Threshold signing keeps the key sharded through every signature — never reconstruct d on one node.

---

## 03. Bitcoin Protocol

Bitcoin is the reference permissionless, censorship-resistant monetary network. Its design choices — UTXO accounting, a limited Script language, PoW, and layered soft forks — are deliberate tradeoffs. This section dissects every layer.

**What's covered:**
- **UTXO Model** — no accounts; a balance is the sum of spendable UTXOs, each an indivisible coin named `txid:vout` with a value in sat and a locking scriptPubKey; value conservation Σ v_in = Σ v_out + f (the fee is the unassigned remainder — forget the change output and you donate it to the miner); dust threshold 546 sat for P2PKH (≈294 for P2WPKH); coin selection is a knapsack — Bitcoin Core's branch-and-bound hunts for *changeless* txs; privacy leaks via address reuse and the common-input-ownership heuristic, mitigated by coin control.
- **Bitcoin Script** — stack-based execution; OP_DUP / OP_HASH160 / OP_CHECKSIG; the script-type ladder P2PK → P2PKH → P2SH → P2WPKH → P2WSH → P2TR; m-of-n multisig; script limits and malleability fixes.
- **Mining & Difficulty** — SHA-256d puzzle, target vs compact "bits" encoding; retarget every 2016 blocks to hold 10-minute blocks; selfish mining; pool mining with vardiff and shares; ASIC hardware evolution.
- **Lightning Network** — 2-of-2 funding → many off-chain commitment updates → cooperative/unilateral settlement; old states made safe by *revocation* (publish a revoked commitment and the counterparty sweeps the whole balance); HTLCs (H = SHA256(R)) make multi-hop payments atomic; timelocks must decrease along the route (T_i − T_{i+1} ≥ Δ_i, the `cltv_expiry_delta`); Dijkstra routing over the fee/CLTV channel graph; Sphinx onion routing; watchtowers; channel jamming; inbound-liquidity, submarine swaps, splicing.
- **Taproot & SegWit** — SegWit splits base and witness data, permanently fixing malleability; weight = 4×base + witness, vbytes = ⌈weight/4⌉, block limit 4,000,000 WU (≈1 MB base + 3 MB witness), witness bytes get a ¼ discount; Taproot (BIP 340/341/342) commits a tweaked key Q = P + t·G (t = H(P ‖ merkleRoot)) offering a private key-path spend or a selective script-path spend; MuSig2 makes an n-of-n spend look like one signature; MAST reveals only the used leaf plus a log-n Merkle proof; addresses `bc1q` (bech32, SegWit v0) vs `bc1p` (bech32m, Taproot).

**Key mental models:** Money in Bitcoin is a set of coins, not a number in a table — this single fact explains coin selection, change, dust, and privacy. Zero-conf is unsafe; wait for confirmations (1 low-value, 6 high-value). Prefer Taproot key-path spends so multisig, escrow, and timelocked contracts settle looking like ordinary payments.

---

## 04. Ethereum & EVM

Ethereum extends the ledger with a quasi-Turing-complete virtual machine, enabling arbitrary on-chain computation. This section covers the EVM's execution model, Solidity patterns, gas economics, the ABI, and the proxy patterns behind upgradeable systems.

**What's covered:**
- **EVM Architecture** — stack-based, no registers, 1024-slot stack of 256-bit words; four data regions — volatile per-call **stack** and **memory**, persistent per-contract **storage**, read-only **calldata**; memory priced C_mem(a) = 3a + ⌊a²/512⌋ (linear then quadratic); storage is the expensive resource (cold SLOAD 2100, fresh SSTORE 20000 vs 3 gas for arithmetic); `REVERT` refunds remaining gas, an exceptional halt (out-of-gas, bad jump) consumes it all; execution context exposes `msg.sender` vs `tx.origin`.
- **Solidity Programming** — value vs reference types; storage / memory / calldata data locations; visibility (public/external/internal/private); modifiers, events & logs, custom errors; C3-linearized inheritance; abstract contracts vs interfaces; Solidity ≥0.8 built-in overflow checks.
- **Gas & Optimization** — EIP-1559 splits fees into a *burned* base fee (targets 50%-full blocks, adjusts ≤12.5%/block) and a validator priority tip, paying min(maxFee, baseFee + maxPriorityFee) per gas; flat 21000 intrinsic gas + 16/4 per non-zero/zero calldata byte; warm/cold access (EIP-2930 access lists pre-warm slots); the high-leverage patterns are storage packing, caching SLOAD out of loops, `calldata` over `memory` params, and `unchecked` arithmetic; Yul for audited hot paths.
- **ABI & Contract Interaction** — function selector = keccak256(sig)[0:4]; call vs staticcall vs delegatecall; multicall batching; CREATE vs CREATE2 with addr = keccak256(0xff ‖ deployer ‖ salt ‖ initcodeHash) for counterfactual deployment.
- **Upgradeable Contracts** — transparent proxy (EIP-1967 unstructured storage slots, admin selector clash), UUPS (upgrade logic in the implementation), Beacon proxy (one beacon, many proxies); storage-layout collision hazards; initializer vs constructor; the OpenZeppelin upgrades plugin.

**Key mental models:** Gas optimization is overwhelmingly about touching storage *less* — a single fresh SSTORE costs ≈6600 arithmetic ops. Authenticate with `msg.sender`, never `tx.origin` (spoofable via an intermediary contract). Follow checks-effects-interactions (or a ReentrancyGuard) to avoid the DAO re-entrancy pattern; `delegatecall` runs callee code in the caller's storage, so proxy layouts must match exactly.

---

## 05. DeFi Protocols

Decentralized finance replaces intermediaries with transparent on-chain contracts. This section covers the core primitives — AMMs, lending, derivatives, the MEV supply chain, and oracles — with the mathematics and code that make each work.

**What's covered:**
- **AMMs & Liquidity Pools** — constant product x·y = k; output Δy = γΔx·y/(x + γΔx) with γ = 0.997 (0.3% fee); price impact (curve convexity) vs user-set slippage tolerance; impermanent loss IL = 2√p/(1+p) − 1 (≈5.7% at a 2× move, ≈20% at 4×, permanent on withdrawal); Uniswap v3 concentrated liquidity over ticks P(i) = 1.0001ⁱ with virtual reserves L = √(x_virt·y_virt); Curve StableSwap blends constant-sum and constant-product via amplification A; JIT liquidity as an MEV tactic.
- **Lending & Borrowing** — over-collateralized and permissionless; the health factor H = Σ(col_i·LT_i)/debt (solvent at H ≥ 1); liquidation up to a close factor (≈50%) with a 5–10% bonus, and bad debt to the reserve when crashes make it unprofitable; piecewise-linear kink interest model (gentle below U_opt, steep slope2 above to protect withdrawability); flash loans (EIP-3156, ≈0.09% Aave fee) lend uncollateralized within one atomic tx — atomicity *is* the collateral.
- **Derivatives & Perpetuals** — perpetual funding rate (mean-reverting premium) tethering mark to index price; virtual AMM (vAMM); options protocols (Lyra, Dopex); structured products (principal-protected notes, covered calls) and synthetic assets.
- **MEV & Arbitrage** — taxonomy of benign MEV (arbitrage, backrunning, liquidations) vs extractive (frontrunning, sandwiching, sniping); priority gas auctions replaced by Proposer-Builder Separation via Flashbots MEV-Boost (searchers → builders → relays → proposers); sandwich attacks profit from price-impact stacking; SUAVE and MEV smoothing target builder/proposer centralization.
- **Oracles & Data Feeds** — the oracle problem; Chainlink's decentralized network aggregates staked nodes to a **median**, updating on a deviation threshold δ OR a heartbeat H (always check `updatedAt` for staleness); TWAP = (a_tn − a_t0)/(tn − t0) dilutes a one-block spike to ≈1/W of its size; Uniswap v3 geometric-mean accumulator; Pyth pull-based feeds with a confidence interval and EMA; the flash-loan-plus-spot-oracle exploit (bZx, Harvest, Mango) and circuit breakers (minAnswer/maxAnswer).

**Key mental models:** Fees must out-earn impermanent loss for LPing to profit — rarely true for volatile pairs. Never price collateral or debt off a single-block spot a flash loan can move; use an aggregated median or a multi-block TWAP, and target a health factor of 1.5–2, not 1.05. MEV is emergent in any transparent ordered ledger; PBS moves the ordering auction off-chain and shares income with all validators.

---

## 06. Web3 Development

Production Web3 apps require a distinct toolchain: typed contract libraries, local test environments, decentralized indexing and storage, and cross-chain messaging. This section covers the stack from local deployment to a multi-chain dApp.

**What's covered:**
- **ethers.js & viem** — provider/signer model; wallet connection (MetaMask, WalletConnect); typechain-generated contract types; event filters and `eth_getLogs` pagination; the transaction lifecycle (nonce management, gas estimation, receipt waiting); viem public/wallet clients; EIP-712 typed-data signing; re-initialize on `accountsChanged` / `chainChanged`.
- **Hardhat & Foundry** — Hardhat network (`hardhat_impersonateAccount`, mainnet forking, snapshot/revert), hardhat-deploy and hardhat-gas-reporter; Foundry `forge test` with fuzz and invariant testing, the `cast` CLI, `forge script` broadcast + verify; always pin the fork `blockNumber` for deterministic tests.
- **The Graph Protocol** — a subgraph is three files: manifest (`subgraph.yaml`: contracts, events, `startBlock`), schema (GraphQL `@entity` types, `@derivedFrom` virtual reverse lookups, `immutable` for append-only), and AssemblyScript/WASM mappings; entity id = txHash ‖ logIndex (reuse silently overwrites); load-or-create handlers; time-travel queries at a past block; cursor pagination (`id_gt`, not `skip`); hosted service vs decentralized network (staked Indexers, GRT query fees); Ponder as a self-hosted alternative.
- **IPFS & Filecoin** — content-addressed storage (CID = multihash of content); IPLD data model; Kademlia DHT routing; pinning services (Pinata, NFT.Storage, web3.storage); Filecoin storage deals and retrieval; IPNS mutable names; CAR files.
- **Cross-Chain Bridges** — three patterns: lock-and-mint (vault + wrapper), burn-and-mint (native multi-chain, no vault), and liquidity pools (swap in/out); the collateralization invariant Σ wrapped = locked underlies every exploit; message passing via Wormhole (19 Guardians co-sign a VAA), LayerZero (configurable DVNs), Axelar (PoS routing chain); optimistic bridges (≈7-day fraud-proof window) vs ZK bridges (validity proofs, near-instant finality); IBC light clients keep relayers untrusted; the Ronin (~$625M), Wormhole (~$325M), and Nomad (~$190M) hacks.

**Key mental models:** Paginate `eth_getLogs` and use The Graph for historical data; derive entity IDs from txHash + logIndex. Always pin the fork block number so tests are reproducible. Bridges are the single biggest attack surface in Web3 — prefer canonical/native routes, minimize the trusted signer set, and treat a bridged token as carrying the *bridge's* risk, not the origin chain's.

---

## Cross-Cutting Mental Models

These principles thread through every section and are the recurring themes in both design reviews and interviews:

1. **Trust is priced, not assumed** — every layer defeats Sybil attacks and forgery by binding power to a costly resource: hash power (PoW), stake (PoS), a bounded signer set (BFT and bridges), or discrete-log hardness (keys, signatures). Whenever you evaluate a system, ask what it would cost an adversary to subvert that resource.

2. **Finality is economic and probabilistic** — nothing is absolutely final. Nakamoto reversal odds fall as ≈(q/p)ᵏ with confirmations, a Merkle proof shows block-inclusion not canonical-chain membership, and immutability is just the cost of rewriting. Only BFT and validity proofs give deterministic finality, and they buy it with a fixed validator set or proving cost.

3. **Atomicity is a first-class primitive** — the all-or-nothing transaction underpins flash loans (repay-or-revert), HTLC multi-hop Lightning payments, MEV searcher bundles, and cross-DEX arbitrage. If any leg fails, the entire sequence unwinds as if it never happened — a feature to build on and a weapon to defend against.

4. **Never trust a value a single actor or block can move** — nonce reuse leaks keys, `tx.origin` auth is spoofable, and a single-block spot price is flash-loan-manipulable. The defenses rhyme: deterministic nonces (RFC 6979), `msg.sender`, decentralized medians and multi-block TWAPs, and cross-checked feeds with circuit breakers.

5. **On-chain space and computation are the scarce, expensive resource** — SSTORE/SLOAD dominate gas, a Merkle root compresses N items to 32 bytes, the SegWit witness discount and ZK proofs push data and computation off-chain, and rollups verify one succinct proof on L1 for thousands of transactions. Optimize by touching chain state as rarely as possible.
