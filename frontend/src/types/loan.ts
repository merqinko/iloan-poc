export interface LoanApplication {
  id: string;
  applicantName: string;
  loanAmount: number;
  tenureMonths: number;
  interestRate: number;
  monthlyPayment: number;
  status: LoanStatus;
  createdAt: string;
}

export interface CreateLoanRequest {
  applicantName: string;
  loanAmount: number;
  tenureMonths: number;
  interestRate?: number;
}

export type LoanStatus = 'Pending' | 'Approved' | 'Rejected';
