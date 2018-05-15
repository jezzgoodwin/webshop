using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using WebShop.Models;
using WebShop.Contracts;

namespace WebShop.Controllers
{
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {

        private readonly DatabaseContext _context;

        public ProductsController(DatabaseContext context)
        {
            _context = context;
        }

        [HttpGet()]
        public async Task<IEnumerable<ProductDto>> GetAll(CancellationToken cancellationToken)
        {
            var products = await _context.Products
                .Include(product => product.ProductCategoryJunctions)
                    .ThenInclude(junction => junction.Category)
                .ToListAsync(cancellationToken);
            cancellationToken.ThrowIfCancellationRequested();

            return products
                .Select(product => new ProductDto()
                {
                    Id = product.Id,
                    Name = product.Name,
                    Categories = product.ProductCategoryJunctions.Select(junction => new CategoryDto()
                    {
                        Id = junction.Category.Id,
                        Name = junction.Category.Name
                    })
                    .ToList()
                })
                .ToList();

        }

        [HttpGet("categories")]
        [Authorize]
        public async Task<IEnumerable<CategoryDto>> GetAllCategories(CancellationToken cancellationToken)
        {
            return await _context.Categories.Select(category => new CategoryDto()
            {
                Id = category.Id,
                Name = category.Name
            })
            .ToListAsync(cancellationToken);

        }

        [HttpGet("passthrough")]
        public IActionResult Passthrough(string Json)
        {
            try
            {
                var input = Newtonsoft.Json.JsonConvert.DeserializeObject<CategoryDto>(Json);
                return Ok(input);
            } catch (Exception e)
            {
                return BadRequest(e);
            }
        }

    }
}
