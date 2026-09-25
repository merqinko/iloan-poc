namespace ILoan.Api.Models;

public enum LoanStatus
{
    Pending,
    Approved,
    Rejected
}

public class LoanApplication
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string ApplicantName { get; set; } = string.Empty;
    public decimal LoanAmount { get; set; }
    public int TenureMonths { get; set; }
    public decimal InterestRate { get; set; } = 6.5m;
    public decimal MonthlyPayment { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public LoanStatus Status { get; set; } = LoanStatus.Pending;
}