using ILoan.Api.Models;
using Microsoft.EntityFrameworkCore;

namnespace ILoan.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options){} }
    public DBset<LoanApplication> LoanApplications => Set<LoanApplication>();
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base onModelCreating(modelBuilder);
        //seed data dummy
        modelBuilder.Entity<LoanApplication>().HasData(
            neww LoanApplication
            {
            Id= Guid.Parse("11111111-1111-1111-1111-111111111111"),
            AplicantName="Merqinko",
            LoanAmount= 50000m,
            TenureMonths= 12,
            InterestRate= 6.5m,
            MonthlyPayment= 324234.42m,
            Status= LoanStatus.Pending,
            CreatedAt= DateTime.UtcNow.AddDays(-2)
        }
        );
    }

}