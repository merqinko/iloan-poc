namespace ILoan.Api.Models;

public enum LoanStatus
{
    Pending,
    Approved,
    Rejected
}

public class LoanApplication
{
    public int GuId { get; set; }= Guid.NewGuid();
    public string ApplicantName { get; set; }= string.Empty;
    public string LoanAmount { get; set; }
    public string TenureMonths { get; set; }
    public string InterestRate { get; set; }=6.5m;
    public string MonthlyPayment { get; set; }
    
    public LoanStatus Status { get; set; }= LoanStatus.Pending;
    
    public  DateTime CreatedAt { get; set; }= DateTime.UtcNow;
}