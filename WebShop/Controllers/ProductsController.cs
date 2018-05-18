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
using WebShop.TypeReflect;

namespace WebShop.Controllers
{
    public class ProductsController
    {

        private readonly DatabaseContext DatabaseContext;

        public ProductsController(DatabaseContext databaseContext)
        {
            DatabaseContext = databaseContext;
        }

        [Api]
        public async Task<IEnumerable<ProductDto>> GetAll(CancellationToken cancellationToken)
        {
            var products = await DatabaseContext.Products
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

        [Api]
        public async Task<IEnumerable<CategoryDto>> GetAllCategories(CancellationToken cancellationToken)
        {
            return await DatabaseContext.Categories.Select(category => new CategoryDto()
            {
                Id = category.Id,
                Name = category.Name
            })
            .ToListAsync(cancellationToken);

        }

    }
}
