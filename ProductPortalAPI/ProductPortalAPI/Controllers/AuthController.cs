using Microsoft.AspNetCore.Mvc;
using ProductPortalAPI.Data;
using ProductPortalAPI.DTOs;
using ProductPortalAPI.Models;
using ProductPortalAPI.Services;

namespace ProductPortalAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly AuthService _authService;

        public AuthController(AppDbContext context, AuthService authService)
        {
            _context = context;
            _authService = authService;
        }

        [HttpPost("register")]
        public IActionResult Register(UserRegisterDto request)
        {
            if (_context.Users.Any(u => u.Username == request.Username))
                return BadRequest("Korisničko ime već postoji.");

            var user = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                ContactNumber = request.ContactNumber,
                ImageUrl = request.ImageUrl,
                Username = request.Username,
                Email = request.Email,
                PasswordHash = _authService.HashPassword(request.Password),
                Role = "Customer"
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok("Registracija uspješna");

        }

        [HttpPost("login")]
        public IActionResult Login(UserLoginDto request)
        {
            var user = _context.Users.FirstOrDefault(u => u.Username == request.Username);
            if (user == null)
                return BadRequest("Korisnik ne postoji.");
            if (!_authService.VerifyPassword(request.Password, user.PasswordHash))
                return BadRequest("Pogrešna lozinka.");

            var token = _authService.CreateToken(user);
            return Ok(new { token });
        }
    }
}
