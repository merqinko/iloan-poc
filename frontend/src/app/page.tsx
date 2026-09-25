'use client';

import { useState, useEffect } from 'react';
import LoanForm from '@/components/LoanForm';
import LoanTable from '@/components/LoanTable';
import { LoanApplication, LoanStatus } from '@/types/loan';
import { getLoans } from '@/lib/api';

export default function Home() {
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<LoanStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLoans = async () => {
    try {
      const statusParam = selectedStatus ? selectedStatus.toLowerCase() : undefined;
      const data = await getLoans(statusParam);
      setLoans(data);
    } catch (error) {
      console.error('Failed to fetch loans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [selectedStatus]);

  const handleStatusChange = (status: LoanStatus | null) => {
    setSelectedStatus(status);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">iLoan</h1>
              <p className="mt-2 text-lg text-gray-600">Banking Loan Origination System</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">PoC Phase 2</p>
              <p className="text-xs text-gray-400">Powered by .NET 8 & Next.js 15</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm font-medium text-gray-600">Total Loans</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{loans.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm font-medium text-gray-600">Pending</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {loans.filter((l) => l.status === 'Pending').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm font-medium text-gray-600">Approved</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {loans.filter((l) => l.status === 'Approved').length}
            </p>
          </div>
        </div>

        {/* Calculator & Form */}
        <div className="mb-8">
          <LoanForm onLoanCreated={fetchLoans} />
        </div>

        {/* Loans Table */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500">Loading loans...</p>
          </div>
        ) : (
          <LoanTable
            loans={loans}
            selectedStatus={selectedStatus}
            onStatusChange={handleStatusChange}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            © 2024 iLoan PoC. Built with Next.js 15 & .NET 8
          </p>
        </div>
      </footer>
    </div>
  );
}
