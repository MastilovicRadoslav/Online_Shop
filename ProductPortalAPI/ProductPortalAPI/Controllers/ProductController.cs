using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductPortalAPI.Data;
using ProductPortalAPI.Models;

namespace ProductPortalAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductController(AppDbContext context)
        {
            _context = context;
        }

        // ADMIN + CUSTOMER: Get all
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll()
        {
            var products = await _context.Products.ToListAsync();
            return Ok(products);
        }

        //ADMIN: Create
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return Ok(product);
        }

        // ADMIN: Update
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, Product updatedProduct)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            product.Name = updatedProduct.Name;
            product.Description = updatedProduct.Description;
            product.Price = updatedProduct.Price;
            product.Category = updatedProduct.Category;

            await _context.SaveChangesAsync();
            return Ok(product);
        }

        // ADMIN + CUSTOMER: Get by ID
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();
            return Ok(product);
        }
    }
}
