# Citadel Protocol: BTC-Backed CDP Protocol with Dynamic Risk Management
## Babylon Labs Hackathon Submission

**Team/Developer**: Bilgin Kocak  
**Submission Date**: 2025-11-22  
**Contact**: bilgin.kocak@proton.me

---

## Executive Summary

Citadel Protocol is a novel CDP (Collateralized Debt Position) protocol that leverages Babylon's Bitcoin Trustless Vault to enable BTC holders to mint btcUSD stablecoins without relinquishing custody of their Bitcoin. Unlike traditional wrapped BTC solutions, VaultForge introduces dynamic risk management through volatility-adjusted collateralization ratios and a unique "Flash Protection" mechanism that provides temporary collateral boosts during market turbulence.

**Key Innovation**: First CDP protocol to maintain true BTC custody while enabling full DeFi composability through adaptive risk parameters that respond to market conditions in real-time.

**Target Market**: $1.9T BTC market cap with less than 1% currently participating in DeFi due to custody concerns.

---

## Technical Architecture

### System Overview

Citadel Protocol operates across two layers - Bitcoin (via Babylon Vault) and Ethereum (smart contracts) - connected through cryptographic proofs that verify BTC lock status without requiring custody transfer.

```
┌─────────────────────────────────────────────────────────────┐
│                     Bitcoin Network                          │
│  ┌─────────────┐                                            │
│  │ User's BTC  │──► Babylon Trustless Vault                 │
│  └─────────────┘    (Covenant-based lock with unlock path)  │
└──────────────────────┬──────────────────────────────────────┘
                       │ SPV Proof + Merkle Path
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Ethereum Layer                            │
│  ┌──────────────────────────────────────────┐               │
│  │        Citadel Protocol                   │               │
│  │  ┌────────────────────────────────────┐  │               │
│  │  │    Core Modules:                   │  │               │
│  │  │    • CDP Engine (Vault Management) │  │               │
│  │  │    • Oracle Suite (Price + Vol)    │  │               │
│  │  │    • Liquidation Engine            │  │               │
│  │  │    • btcUSD Token Contract         │  │               │
│  │  │    • Flash Protection Module       │  │               │
│  │  └────────────────────────────────────┘  │               │
│  └────────────┬────────────────┬─────────────┘               │
│               ▼                ▼                             │
│         ┌──────────┐     ┌──────────┐                       │
│         │   DEXs   │     │ Lending  │                       │
│         │ Uniswap  │     │   Aave   │                       │
│         │  Curve   │     │ Compound │                       │
│         └──────────┘     └──────────┘                       │
└─────────────────────────────────────────────────────────────┘
```

### Integration Flow with Babylon Vault

1. **BTC Locking Phase**
   ```
   User → Babylon Vault: Lock BTC with covenant conditions
   Babylon → Bitcoin Network: Create time-locked UTXO with unlock path
   Babylon → User: Return lock proof (tx hash + merkle proof)
   ```

2. **CDP Creation Phase**
   ```
   User → Citadel: Submit lock proof + desired btcUSD amount
   Citadel → Babylon Oracle: Verify lock validity and amount
   Citadel → Risk Engine: Calculate safe mint amount based on:
      - Current BTC price ($65,000 example)
      - Volatility index (15% = normal, 25% = elevated)
      - Global liquidity depth
   Citadel → User: Mint btcUSD (up to 66% of collateral value)
   ```

3. **Ongoing Management**
   ```
   Every block:
      - Update price feeds from Chainlink + Pyth
      - Recalculate vault health factors
      - Adjust global risk parameters if needed
   
   User actions available:
      - Add collateral (more BTC to Babylon)
      - Repay debt (burn btcUSD)
      - Trigger Flash Protection (emergency collateral)
   ```

### Smart Contract Architecture

**Core Contract: CDPEngine.sol**
```solidity
interface ICDPEngine {
    struct Vault {
        bytes32 babylonLockId;      // Proof of BTC in Babylon
        uint256 btcAmount;          // Sats locked
        uint256 btcUSDDebt;         // Stablecoin minted
        uint256 lastUpdateBlock;
        uint256 stabilityFeeIndex;  // Accumulated interest
        uint8 riskTier;            // 0: Safe, 1: Warning, 2: Danger
    }
    
    function openVault(
        bytes calldata babylonProof,
        uint256 btcAmount,
        uint256 btcUSDRequested
    ) external returns (bytes32 vaultId);
    
    function liquidate(bytes32 vaultId) external;
    function addCollateral(bytes32 vaultId, bytes calldata proof) external;
    function repayDebt(bytes32 vaultId, uint256 amount) external;
}
```

**Dynamic Risk Oracle: RiskOracle.sol**
```solidity
contract RiskOracle {
    // Collateralization ratios adjust based on 24h volatility
    function getRequiredCollateralRatio() public view returns (uint256) {
        uint256 volatility = calculateVolatility();
        
        if (volatility < 10) return 15000; // 150% for low vol
        if (volatility < 20) return 17500; // 175% for medium vol
        if (volatility < 30) return 20000; // 200% for high vol
        return 25000; // 250% for extreme conditions
    }
}
```

---

## Risk Model & Protocol Parameters

### Dynamic Collateralization Framework

| Market Condition | BTC 24h Volatility | Min C-Ratio | Max LTV | Stability Fee | Liquidation Threshold |
|-----------------|-------------------|-------------|---------|---------------|---------------------|
| **Stable** | < 10% | 150% | 66% | 3% APR | 130% |
| **Normal** | 10-20% | 175% | 57% | 4% APR | 140% |
| **Elevated** | 20-30% | 200% | 50% | 5% APR | 150% |
| **Critical** | > 30% | 250% | 40% | 8% APR | 175% |

### Flash Protection Mechanism

During extreme volatility events (>10% move in 1 hour), users can activate Flash Protection:

```
Trigger Conditions:
- Vault health factor < 1.5
- BTC price drop > 10% in 60 minutes
- User opts in pre-emptively

Protection Terms:
- Auto-lock additional 25% BTC from user's Babylon reserve
- 4-hour grace period with no liquidation risk
- Cost: 2% APR (prorated for actual usage time)
- Automatic unlock if conditions stabilize
```

### Liquidation Waterfall

```
Stage 1: Soft Liquidation (Health Factor 1.3 - 1.1)
├── Partial liquidation only (max 50% of position)
├── 5% penalty redistributed to stability pool
└── 24-hour grace period for user to recapitalize

Stage 2: Hard Liquidation (Health Factor < 1.1)  
├── Full position liquidation via Dutch auction
├── 13% total penalty distributed as:
│   ├── 5% to liquidator (incentive)
│   ├── 5% to insurance fund
│   └── 3% to protocol treasury
└── Remaining collateral returned to user
```

---

## Economic Model & Market Opportunity

### Revenue Projections

**Target Metrics (Year 1)**
- Total Value Locked: $500M (0.04% of BTC market cap)
- btcUSD Supply: $250M (50% utilization rate)
- Average Stability Fee: 4% APR
- Annual Protocol Revenue: $10M

**Fee Structure**
- Minting Fee: 0.1% (one-time)
- Stability Fee: 3-8% APR (dynamic)
- Flash Protection: 2% APR when activated
- Early Repayment: 0% (no penalties)

### btcUSD Stablecoin Mechanics

**Peg Stability Mechanisms**
1. **Primary**: 1 btcUSD always redeemable for $1 worth of BTC from protocol reserves
2. **Secondary**: Peg Stability Module (PSM) with 50M USDC/DAI buffer
3. **Tertiary**: Arbitrage incentives via deep DEX liquidity pools

**Initial Liquidity Plan**
- Seed $5M USDC/btcUSD pool on Curve (protocol-owned liquidity)
- Incentivize $20M TVL through liquidity mining (2% APR in rewards)
- Partner with Aave/Compound for btcUSD lending markets

---

## Competitive Advantages

### vs. Wrapped BTC (WBTC/tBTC)
- **No Custody Risk**: BTC never leaves user control via Babylon Vault
- **No Bridge Risk**: No cross-chain bridges or multisig vulnerabilities
- **Lower Fees**: No wrapping/unwrapping fees (0.2-0.5% saved)

### vs. Traditional CDP Protocols (MakerDAO)
- **Native BTC Collateral**: Direct BTC usage without intermediaries
- **Dynamic Risk Management**: Adaptive parameters based on market conditions
- **Flash Protection**: Unique emergency collateral system
- **Better Capital Efficiency**: Up to 66% LTV vs typical 50%

### Market Differentiation
- **First-mover advantage** in trustless BTC CDP market
- **Institutional-grade** risk management suitable for large holders
- **Composability-first** design for integration with all major DeFi protocols

---

## Technical Appendix

### Babylon Vault Integration Specification

**Required Babylon Components:**
```javascript
// Verify BTC lock in Babylon Vault
function verifyBabylonLock(bytes memory proof) public view returns (bool, uint256) {
    // 1. Decode SPV proof structure
    BabylonProof memory p = abi.decode(proof, (BabylonProof));
    
    // 2. Verify Bitcoin transaction inclusion
    require(BTCRelay.verifyTx(p.txHash, p.blockHeight, p.merkleProof));
    
    // 3. Verify covenant conditions match our requirements
    require(p.unlockCondition == CITADEL_PROTOCOL_COVENANT);
    
    // 4. Extract and return BTC amount
    return (true, p.btcAmount);
}
```

**Babylon Oracle Interface:**
```solidity
interface IBabylonOracle {
    function getLockStatus(bytes32 lockId) external view returns (
        bool isActive,
        uint256 btcAmount,
        address owner,
        uint256 unlockTime
    );
    
    function requestUnlock(bytes32 lockId, bytes memory signature) external;
}
```

### Security Considerations

1. **Babylon Vault Risks**
   - Mitigation: Multi-oracle verification of lock status
   - Fallback: Emergency pause if Babylon unavailable

2. **Price Oracle Risks**
   - Mitigation: 3-of-5 oracle consensus (Chainlink, Pyth, Uniswap, Binance, Coinbase)
   - Fallback: Circuit breakers on >5% deviation

3. **Smart Contract Risks**
   - Mitigation: Formal verification, multiple audits
   - Insurance: 10M protocol-owned insurance fund

### Economic Attack Vectors Analysis

**Scenario 1: Flash Loan Attack**
- Protection: All state changes require time-weighted averages
- Result: Not profitable due to 1-hour TWAP requirements

**Scenario 2: Oracle Manipulation**
- Protection: Multi-source validation with deviation limits
- Result: Would require manipulating 3+ independent oracles simultaneously

**Scenario 3: Bank Run on btcUSD**
- Protection: PSM buffer + liquidation incentives maintain peg
- Result: Protocol can handle 30% supply redemption without depeg

---

## Links & Resources

### Project Resources
- **GitHub Repository**: [github.com/bilgin-kocak/citadel-protocol](https://github.com)

### Contact Information
- **Developer**: Bilgin Kocak
- **Email**: bilgin.kocak@proton.me
- **GitHub**: [@bilginkocak](https://github.com/bilginkocak)

---

*This submission represents original work created specifically for the Babylon Labs Hackathon. All code and designs are open-source under MIT License.*