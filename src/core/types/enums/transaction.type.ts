// =============================================================================
// SECTION 3: FINANCIAL ENUMS - Wallet & Transaction Management
// =============================================================================

/**
 * Transaction type enumeration for comprehensive financial operations
 * Supports all modern payment and transaction scenarios
 */
export enum TransactionType {
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
  BillPayment = 17,
  // Enterprise additions
  Payroll = 18,
  VendorPayment = 19,
  Treasury = 20,
  FxConversion = 21,
  InterCompany = 22,
  BulkDisbursement = 23,
  VirtualAccount = 24,
  LetterOfCredit = 25,
  BankGuarantee = 26,
  TradeFinance = 27,
  SupplyChainFinance = 28,
  Factoring = 29,
  Forfaiting = 30,
  ReceivableDiscount = 31,
}

/**
 * Human-readable labels for TransactionType
 */
export const TransactionTypeLabels: Record<TransactionType, string> = {
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
  [TransactionType.BillPayment]: 'Bill Payment',
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
 * Transaction status enumeration for complete transaction lifecycle
 */
export enum TransactionStatus {
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
export const TransactionStatusLabel: Record<TransactionStatus, string> = {
  [TransactionStatus.Pending]: 'Pending',
  [TransactionStatus.Processing]: 'Processing',
  [TransactionStatus.Completed]: 'Completed',
  [TransactionStatus.Failed]: 'Failed',
  [TransactionStatus.Cancelled]: 'Cancelled',
  [TransactionStatus.Refunded]: 'Refunded',
  [TransactionStatus.Disputed]: 'Disputed',
  [TransactionStatus.ChargedBack]: 'ChargedBack',
  [TransactionStatus.OnHold]: 'OnHold',
  [TransactionStatus.Reversed]: 'Reversed',
  [TransactionStatus.Expired]: 'Expired',
  [TransactionStatus.Scheduled]: 'Scheduled',
  // Enterprise additions
  [TransactionStatus.AwaitingApproval]: 'AwaitingApproval',
  [TransactionStatus.Approved]: 'Approved',
  [TransactionStatus.Rejected]: 'Rejected',
  [TransactionStatus.UnderReview]: 'UnderReview',
  [TransactionStatus.ComplianceHold]: 'ComplianceHold',
  [TransactionStatus.SettlementPending]: 'SettlementPending',
  [TransactionStatus.Settled]: 'Settled',
  [TransactionStatus.Clearing]: 'Clearing',
  [TransactionStatus.Cleared]: 'Cleared',
  [TransactionStatus.Reconciled]: 'Reconciled',
  [TransactionStatus.AuditPending]: 'AuditPending',
  [TransactionStatus.Audited]: 'Audited',
  [TransactionStatus.Discrepancy]: 'Discrepancy',
};

/**
 * Advanced helper utilities for TransactionType and TransactionStatus
 */
export const TransactionHelpers = {
  isCredit(type: TransactionType): boolean {
    return [
      TransactionType.Credit,
      TransactionType.Refund,
      TransactionType.Interest,
      TransactionType.StakingReward,
      TransactionType.Payroll,
      TransactionType.ReceivableDiscount,
    ].includes(type);
  },

  isDebit(type: TransactionType): boolean {
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
  },

  isFinal(status: TransactionStatus): boolean {
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
  },

  isReversible(status: TransactionStatus): boolean {
    return [
      TransactionStatus.Completed,
      TransactionStatus.Refunded,
      TransactionStatus.Disputed,
      TransactionStatus.Settled,
      TransactionStatus.Cleared,
    ].includes(status);
  },

  requiresApproval(type: TransactionType): boolean {
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
  },

  isTradeFinance(type: TransactionType): boolean {
    return [
      TransactionType.LetterOfCredit,
      TransactionType.BankGuarantee,
      TransactionType.TradeFinance,
      TransactionType.SupplyChainFinance,
      TransactionType.Factoring,
      TransactionType.Forfaiting,
    ].includes(type);
  },

  isTreasury(type: TransactionType): boolean {
    return [
      TransactionType.Treasury,
      TransactionType.FxConversion,
      TransactionType.InterCompany,
    ].includes(type);
  },
};
