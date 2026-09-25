using ILoan.Api.Models;
using ILoan.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace ILoan.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LoansController : ControllerBase
{
    private readonly ILoanService _loanService;

    public LoansController(ILoanService loanService)
    {
        _loanService = loanService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<LoanResponse>>> GetLoans([FromQuery] LoanStatus? status)
    {
        var loans = await _loanService.GetLoansAsync(status);
        return Ok(loans);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<LoanResponse>> GetLoanById(Guid id)
    {
        var loan = await _loanService.GetLoanByIdAsync(id);
        if (loan == null) return NotFound();
        return Ok(loan);
    }

    [HttpPost]
    public async Task<ActionResult<LoanResponse>> CreateLoan([FromBody] CreateLoanRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.ApplicantName) || request.LoanAmount <= 0 || request.TenureMonths <= 0)
        {
            return BadRequest("Invalid input values.");
        }

        var result = await _loanService.CreateLoanAsync(request);
        return CreatedAtAction(nameof(GetLoanById), new { id = result.Id }, result);
    }
}