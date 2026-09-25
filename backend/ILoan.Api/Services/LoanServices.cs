using ILoan.Api.Data;
using ILoan.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ILoan.Api.Services;

public interface ILoanService
{
    Task<IEnumerable<LoanResponse>> GetLoansAsync(LoanStatus? status = null);
    Task<LoanResponse?> GetLoanByIdAsync(Guid id);
    Task<LoanResponse> CreateLoanAsync(CreateLoanRequest request);
}

public class LoanService : ILoanService
{
    private readonly AppDbContext _context;

    public LoanService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<LoanResponse>> GetLoansAsync(LoanStatus? status = null)
    {
        var query = _context.LoanApplications.AsQueryable();

        if (status.HasValue)
        {
            query = query.Where(l => l.Status == status.Value);
        }

        var loans = await query.OrderByDescending(l => l.CreatedAt).ToListAsync();

        return loans.Select(MapToResponse);
    }

    public async Task<LoanResponse?> GetLoanByIdAsync(Guid id)
    {
        var loan = await _context.LoanApplications.FindAsync(id);
        return loan == null ? null : MapToResponse(loan);
    }

    public async Task<LoanResponse> CreateLoanAsync(CreateLoanRequest request)
    {
        var monthlyPayment = CalculateMonthlyPayment(request.LoanAmount, request.TenureMonths, request.InterestRate);

        var loan = new LoanApplication
        {
            ApplicantName = request.ApplicantName,
            LoanAmount = request.LoanAmount,
            TenureMonths = request.TenureMonths,
            InterestRate = request.InterestRate,
            MonthlyPayment = monthlyPayment,
            Status = LoanStatus.Pending
        };

        _context.LoanApplications.Add(loan);
        await _context.SaveChangesAsync();

        return MapToResponse(loan);
    }

    // Standard Annuity Formula: PMT = [P * r * (1+r)^n] / [(1+r)^n - 1]
    private static decimal CalculateMonthlyPayment(decimal principal, int tenureMonths, decimal annualRate)
    {
        if (tenureMonths <= 0 || principal <= 0) return 0;

        double r = (double)(annualRate / 100 / 12);
        double p = (double)principal;
        int n = tenureMonths;

        if (r == 0) return principal / tenureMonths;

        double monthlyPayment = (p * r * Math.Pow(1 + r, n)) / (Math.Pow(1 + r, n) - 1);
        return Math.Round((decimal)monthlyPayment, 2);
    }

    private static LoanResponse MapToResponse(LoanApplication loan) =>
        new(
            loan.Id,
            loan.ApplicantName,
            loan.LoanAmount,
            loan.TenureMonths,
            loan.InterestRate,
            loan.MonthlyPayment,
            loan.Status.ToString(),
            loan.CreatedAt
        );
}