import { LoanApplication, CreateLoanRequest } from '@/types/loan';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5149/api/loans';

export async function getLoans(status?: string): Promise<LoanApplication[]> {
  const url = status ? `${API_BASE}?status=${encodeURIComponent(status)}` : API_BASE;
  
  console.log(`[API] GET ${url}`);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[API] GET failed: ${response.status} - ${errorText}`);
    throw new Error(`Failed to fetch loans: ${response.status}`);
  }

  const data = await response.json();
  console.log(`[API] GET success - received ${data.length} loan(s)`);
  return data;
}

export async function createLoan(payload: CreateLoanRequest): Promise<LoanApplication> {
  console.log(`[API] POST ${API_BASE}`, payload);

  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[API] POST failed: ${response.status} - ${errorText}`);
    throw new Error(`Failed to create loan: ${response.status}`);
  }

  const data = await response.json();
  console.log(`[API] POST success - created loan with id:`, data.id);
  return data;
}
