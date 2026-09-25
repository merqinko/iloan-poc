'use client';

import { LoanApplication, LoanStatus } from '@/types/loan';

interface LoanTableProps {
  loans: LoanApplication[];
  selectedStatus: LoanStatus | null;
  onStatusChange: (status: LoanStatus | null) => void;
}

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  Approved: 'bg-green-100 text-green-800 border-green-300',
  Rejected: 'bg-red-100 text-red-800 border-red-300',
};

export default function LoanTable({ loans, selectedStatus, onStatusChange }: LoanTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filterTabs: { label: string; value: LoanStatus | null }[] = [
    { label: 'All', value: null },
    { label: 'Pending', value: 'Pending' },
    { label: 'Approved', value: 'Approved' },
    { label: 'Rejected', value: 'Rejected' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Loans Dashboard</h2>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {filterTabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => onStatusChange(tab.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedStatus === tab.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Applicant</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">Tenure</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Monthly Payment</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">Date</th>
            </tr>
          </thead>
          <tbody>
            {loans.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No loans found
                </td>
              </tr>
            ) : (
              loans.map((loan) => (
                <tr key={loan.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">{loan.applicantName}</div>
                  </td>
                  <td className="py-4 px-4 text-right font-medium text-gray-900">
                    {formatCurrency(loan.loanAmount)}
                  </td>
                  <td className="py-4 px-4 text-center text-gray-700">
                    {loan.tenureMonths} months
                  </td>
                  <td className="py-4 px-4 text-right font-medium text-gray-900">
                    {formatCurrency(loan.monthlyPayment)}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${statusColors[loan.status]}`}
                    >
                      {loan.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center text-gray-600 text-sm">
                    {formatDate(loan.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      {loans.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{loans.length}</span> loan(s)
          </p>
        </div>
      )}
    </div>
  );
}
