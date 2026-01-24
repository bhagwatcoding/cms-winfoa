// =============================================================================
// SECTION 3: FINANCIAL ENUMS - Wallet & Transaction Management
// =============================================================================

/**
 * Transaction type enumeration for comprehensive financial operations
 * Supports all modern payment and transaction scenarios
 */
export const enum TransactionType {
  // Core enterprise flows
  Credit = 1,
  Debit = 2,
  Transfer = 3,
  Recharge = 4,
  Withdrawal = 5,
  Refund = 6,
  Fee = 7,
  Commission = 8,
  Interest = 9,
  Adjustment = 10,
  Escrow = 11,
  CryptoExchange = 12,
  StakingReward = 13,
  Slashing = 14,
  Mint = 15,
  Burn = 16,
  // Enterprise additions
  Payroll = 17,
  VendorPayment = 18,
  Treasury = 19,
  FxConversion = 20,
  InterCompany = 21,
  BulkDisbursement = 22,
  VirtualAccount = 23,
  LetterOfCredit = 24,
  BankGuarantee = 25,
  TradeFinance = 26,
  SupplyChainFinance = 27,
  Factoring = 28,
  Forfaiting = 29,
  ReceivableDiscount = 30,
}

/**
 * Transaction status enumeration for complete transaction lifecycle
 */
export const enum TransactionStatus {
  Pending = 1,
  Processing = 2,
  Completed = 3,
  Failed = 4,
  Cancelled = 5,
  Refunded = 6,
  Disputed = 7,
  ChargedBack = 8,
  OnHold = 9,
  Reversed = 10,
  Expired = 11,
  Scheduled = 12,
  // Enterprise additions
  AwaitingApproval = 13,
  Approved = 14,
  Rejected = 15,
  UnderReview = 16,
  ComplianceHold = 17,
  SettlementPending = 18,
  Settled = 19,
  Clearing = 20,
  Cleared = 21,
  Reconciled = 22,
  AuditPending = 23,
  Audited = 24,
  Discrepancy = 25,
}

/**
 * Human-readable labels for TransactionType
 */
export const TransactionTypeLabel: Record<TransactionType, string> = {
  [TransactionType.Credit]: 'Credit',
  [TransactionType.Debit]: 'Debit',
  [TransactionType.Transfer]: 'Transfer',
  [TransactionType.Recharge]: 'Recharge',
  [TransactionType.Withdrawal]: 'Withdrawal',
  [TransactionType.Refund]: 'Refund',
  [TransactionType.Fee]: 'Fee',
  [TransactionType.Commission]: 'Commission',
  [TransactionType.Interest]: 'Interest',
  [TransactionType.Adjustment]: 'Adjustment',
  [TransactionType.Escrow]: 'Escrow',
  [TransactionType.CryptoExchange]: 'Crypto Exchange',
  [TransactionType.StakingReward]: 'Staking Reward',
  [TransactionType.Slashing]: 'Slashing',
  [TransactionType.Mint]: 'Mint',
  [TransactionType.Burn]: 'Burn',
  [TransactionType.Payroll]: 'Payroll',
  [TransactionType.VendorPayment]: 'Vendor Payment',
  [TransactionType.Treasury]: 'Treasury',
  [TransactionType.FxConversion]: 'FX Conversion',
  [TransactionType.InterCompany]: 'Inter-Company',
  [TransactionType.BulkDisbursement]: 'Bulk Disbursement',
  [TransactionType.VirtualAccount]: 'Virtual Account',
  [TransactionType.LetterOfCredit]: 'Letter of Credit',
  [TransactionType.BankGuarantee]: 'Bank Guarantee',
  [TransactionType.TradeFinance]: 'Trade Finance',
  [TransactionType.SupplyChainFinance]: 'Supply Chain Finance',
  [TransactionType.Factoring]: 'Factoring',
  [TransactionType.Forfaiting]: 'Forfaiting',
  [TransactionType.ReceivableDiscount]: 'Receivable Discount',
};

/**
 * Advanced helper utilities for TransactionType and TransactionStatus
 */
export namespace TransactionHelpers {
  export function isCredit(type: TransactionType): boolean {
    return [
      TransactionType.Credit,
      TransactionType.Refund,
      TransactionType.Interest,
      TransactionType.StakingReward,
      TransactionType.Payroll,
      TransactionType.ReceivableDiscount,
    ].includes(type);
  }

  export function isDebit(type: TransactionType): boolean {
    return [
      TransactionType.Debit,
      TransactionType.Withdrawal,
      TransactionType.Fee,
      TransactionType.Commission,
      TransactionType.Slashing,
      TransactionType.Burn,
      TransactionType.VendorPayment,
      TransactionType.Treasury,
      TransactionType.Factoring,
      TransactionType.Forfaiting,
    ].includes(type);
  }

  export function isFinal(status: TransactionStatus): boolean {
    return [
      TransactionStatus.Completed,
      TransactionStatus.Failed,
      TransactionStatus.Cancelled,
      TransactionStatus.Refunded,
      TransactionStatus.ChargedBack,
      TransactionStatus.Reversed,
      TransactionStatus.Expired,
      TransactionStatus.Rejected,
      TransactionStatus.Settled,
      TransactionStatus.Cleared,
      TransactionStatus.Reconciled,
      TransactionStatus.Audited,
      TransactionStatus.Discrepancy,
    ].includes(status);
  }

  export function isReversible(status: TransactionStatus): boolean {
    return [
      TransactionStatus.Completed,
      TransactionStatus.Refunded,
      TransactionStatus.Disputed,
      TransactionStatus.Settled,
      TransactionStatus.Cleared,
    ].includes(status);
  }

  export function requiresApproval(type: TransactionType): boolean {
    return [
      TransactionType.VendorPayment,
      TransactionType.Treasury,
      TransactionType.FxConversion,
      TransactionType.InterCompany,
      TransactionType.BulkDisbursement,
      TransactionType.LetterOfCredit,
      TransactionType.BankGuarantee,
      TransactionType.TradeFinance,
      TransactionType.SupplyChainFinance,
    ].includes(type);
  }

  export function isTradeFinance(type: TransactionType): boolean {
    return [
      TransactionType.LetterOfCredit,
      TransactionType.BankGuarantee,
      TransactionType.TradeFinance,
      TransactionType.SupplyChainFinance,
      TransactionType.Factoring,
      TransactionType.Forfaiting,
    ].includes(type);
  }

  export function isTreasury(type: TransactionType): boolean {
    return [
      TransactionType.Treasury,
      TransactionType.FxConversion,
      TransactionType.InterCompany,
    ].includes(type);
  }
}