using ILoan.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ILoan.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<LoanApplication> LoanApplications { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<LoanApplication>().HasData(
            new LoanApplication
            {
                Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                ApplicantName = "John Doe",
                LoanAmount = 10000m,
                TenureMonths = 12,
                InterestRate = 6.5m,
                MonthlyPayment = 864.42m,
                CreatedAt = DateTime.UtcNow,
                Status = LoanStatus.Approved
            },
            new LoanApplication
            {
                Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                ApplicantName = "Jane Smith",
                LoanAmount = 25000m,
                TenureMonths = 24,
                InterestRate = 7.0m,
                MonthlyPayment = 1117.44m,
                CreatedAt = DateTime.UtcNow,
                Status = LoanStatus.Pending
            }
        );
    }
}