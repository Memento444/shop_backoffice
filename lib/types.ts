export type TransactionType = "SALE" | "INVESTMENT";

export interface Transaction {
  id: string;
  date: string; // ISO date string "YYYY-MM-DD"
  type: TransactionType;
  amount: number;
  note?: string | null;
  shopId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Shop {
  id: string;
  name: string;
  initialCapital: number;
}

export interface FinancialSummary {
  todaySales: number;
  cumulativeSales: number;
  initialCapital: number;
  additionalInvestments: number;
  cumulativeCapital: number;
  margin: number;
  marginPercentage: number;
  transactionCount: number;
}

export interface CreateTransactionDTO {
  type: TransactionType;
  amount: number;
  date: string;
  note?: string;
}
