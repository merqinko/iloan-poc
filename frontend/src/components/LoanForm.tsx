'use client';

import { useState } from 'react';
import { CreateLoanRequest, LoanStatus } from '@/types/loan';
import { createLoan } from '@/lib/api';

interface LoanFormProps {
  onLoanCreated: () => void;
}

export default function LoanForm({ onLoanCreated }: LoanFormProps) {
  const [applicantName, setApplicantName] = useState('');
  const [loanAmount, setLoanAmount] = useState(10000000);
  const [tenureMonths, setTenureMonths] = useState(12);
  const [interestRate, setInterestRate] = useState(6.5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Standard Annuity Formula: PMT = [P * r * (1+r)^n] / [(1+r)^n - 1]
  const calculateMonthlyPayment = (principal: number, months: number, annualRate: number): number => {
    if (months <= 0 || principal <= 0) return 0;

    const r = annualRate / 100 / 12; // Monthly interest rate
    const p = principal;
    const n = months;

    if (r === 0) return principal / months;

    const monthlyPayment = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Math.round(monthlyPayment * 100) / 100; // Round to 2 decimal places
  };

  const monthlyPayment = calculateMonthlyPayment(loanAmount, tenureMonths, interestRate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const payload: CreateLoanRequest = {
        applicantName,
        loanAmount,
        tenureMonths,
        interestRate,
      };

      await createLoan(payload);
      
      // Reset form
      setApplicantName('');
      setLoanAmount(10000000);
      setTenureMonths(12);
      setInterestRate(6.5);
      
      // Trigger refresh
      onLoanCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create loan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Loan Calculator</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Applicant Name */}
        <div>
          <label htmlFor="applicantName" className="block text-sm font-medium text-gray-700 mb-2">
            Applicant Name
          </label>
          <input
            type="text"
            id="applicantName"
            value={applicantName}
            onChange={(e) => setApplicantName(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter applicant name"
          />
        </div>

        {/* Loan Amount */}
        <div>
          <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700 mb-2">
            Loan Amount: {formatCurrency(loanAmount)}
          </label>
          <input
            type="range"
            id="loanAmount"
            min={1000000}
            max={500000000}
            step={1000000}
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1M IDR</span>
            <span>500M IDR</span>
          </div>
        </div>

        {/* Tenure */}
        <div>
          <label htmlFor="tenureMonths" className="block text-sm font-medium text-gray-700 mb-2">
            Tenure: {tenureMonths} months
          </label>
          <select
            id="tenureMonths"
            value={tenureMonths}
            onChange={(e) => setTenureMonths(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Array.from({ length: 55 }, (_, i) => i + 6).map((month) => (
              <option key={month} value={month}>
                {month} months
              </option>
            ))}
          </select>
        </div>

        {/* Interest Rate */}
        <div>
          <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-2">
            Interest Rate: {interestRate}%
          </label>
          <input
            type="range"
            id="interestRate"
            min={0}
            max={20}
            step={0.1}
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>20%</span>
          </div>
        </div>

        {/* Monthly Payment Preview */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Estimated Monthly Payment</p>
          <p className="text-3xl font-bold text-blue-600">{formatCurrency(monthlyPayment)}</p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Processing...' : 'Apply for Loan'}
        </button>
      </form>
    </div>
  );
}
