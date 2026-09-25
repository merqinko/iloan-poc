using System.ComponentModel.DataAnnotations;

namespace ILoan.Api.Models;

public record CreateLoanRequest(
    string ApplicantName,
    decimal LoanAmount,
    int TenureMonths,
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