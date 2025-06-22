using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductPortalAPI.Data;
using ProductPortalAPI.Models;
using System.Security.Claims;

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

            if (users == null || users.Count == 0)
            {
                return NotFound("Nema korisnika u bazi.");
            }

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

            user.FirstName = updateUser.FirstName;
            user.LastName = updateUser.LastName;
            user.ContactNumber = updateUser.ContactNumber;
            user.ImageUrl = updateUser.ImageUrl;
            user.Username = updateUser.Username;


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

            user.FirstName = updatedUser.FirstName;
            user.LastName = updatedUser.LastName;
            user.ContactNumber = updatedUser.ContactNumber;
            user.ImageUrl = updatedUser.ImageUrl;


            await _context.SaveChangesAsync();
            return Ok(user);
        }

        // File: UserController.cs (dodati novu metodu za brisanje vise korisnika)

        [HttpDelete("delete-all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteAllUsers()
        {
            var users = await _context.Users
                .Where(u => u.Role != "Admin") // ako ne želiš obrisati Admina, zadrži ovu liniju
                .ToListAsync();

            if (!users.Any()) return NotFound("Nema korisnika za brisanje.");

            _context.Users.RemoveRange(users);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("me/photo")]
        [Authorize]
        public async Task<IActionResult> UpdateProfilePhoto([FromBody] string imageName)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var user = await _context.Users.FindAsync(int.Parse(userId));
            if (user == null) return NotFound();

            user.ImageUrl = imageName; // npr "Admin.jpg"
            await _context.SaveChangesAsync();

            return Ok(new { message = "Image updated successfully", imageUrl = imageName });
        }


    }
}
