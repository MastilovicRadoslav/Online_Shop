using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductPortalAPI.Data;

namespace ProductPortalAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class StatisticsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StatisticsController(AppDbContext context)
        {
            _context = context;
        }

        // Broj korisnika i proizvoda
        [HttpGet("counts")]
        public async Task<IActionResult> GetCounts()
        {
            var userCount = await _context.Users.CountAsync();
            var productCount = await _context.Products.CountAsync();

            return Ok(new
            {
                users = userCount,
                products = productCount
            });
        }

        // Raspodjela po kategorijama (bar chart)
        [HttpGet("by-category")]
        public async Task<IActionResult> GetByCategory()
        {
            var data = await _context.Products
                .GroupBy(p => p.Category)
                .Select(g => new
                {
                    category = g.Key,
                    count = g.Count()
                })
                .ToArrayAsync();

            return Ok(data);
        }

        // Raspodjela po cjenovnim opsezima (pie chart npr.)
        [HttpGet("by-price-range")]
        public async Task<IActionResult> GetByPriceRange()
        {
            var data = await _context.Products.ToListAsync();

            var result = new
            {
                low = data.Count(p => p.Price < 50),
                mid = data.Count(p => p.Price >= 50 && p.Price < 100),
                high = data.Count(p => p.Price >= 100)
            };

            return Ok(result);
        }
    }
}
