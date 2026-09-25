using System.ComponentModel.DataAnnotations;

namespace ILoan.Api.Models;

public record CreateLoanRequest(
    [Required] string ApplicantName,
    [Range(1000, 1000000, ErrorMessage = "Jumlah pinjaman antara 1,000 - 1,000,000")] decimal LoanAmount,
    [Range(6, 120, ErrorMessage = "Tenor antara 6 - 120 bulan")] int TenureMonths,
    decimal InterestRate = 6.5m
);

public record LoanResponse(
    Guid Id,
    string ApplicantName,
    decimal LoanAmount,
    int TenureMonths,
    decimal InterestRate,
    decimal MonthlyPayment,
    string Status,
    DateTime CreatedAt
);