using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using ProductPortalAPI.Data;
using ProductPortalAPI.Models;

namespace ProductPortalAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        // ADMIN: GET all users
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users.ToListAsync();
            return Ok(users);
        }

        // ADMIN: GET user by id
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        // ADMIN: DELETE user
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ADMIN: UPDATE user
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateUser(int id, User updateUser)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            user.Username = updateUser.Username;
            user.Email = updateUser.Email;
            user.Role = updateUser.Role;

            await _context.SaveChangesAsync();
            return Ok(user);
        }

        // CUSTOMER/ADMIN: GET own profile
        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetOwnProfile()
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();    
            return Ok(user);
        }

        // CUSTOMER/ADMIN UPDATE own profile
        [HttpPut("me")]
        [Authorize]
        public async Task<IActionResult> UpdateOwnProfile(User updatedUser)
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value!);
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();    

            user.Username = updatedUser.Username;
            user.Email = updatedUser.Email; 

            await _context.SaveChangesAsync();
            return Ok(user);
        }

    }
}
