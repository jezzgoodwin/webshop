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
    public class ProductController
    {

        private readonly DatabaseContext DatabaseContext;

        public ProductController(DatabaseContext databaseContext)
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
                    Categories = product.ProductCategoryJunctions.Select(junction => junction.Category.Id)
                    .ToList()
                })
                .ToList();

        }

        [Api]
        public async Task<SaveDto> Save(ProductDto input, CancellationToken cancellationToken)
        {
            Product product;
            if (input.Id.HasValue)
            {
                product = await DatabaseContext.Products
                        .Include(x => x.ProductCategoryJunctions)
                        .SingleAsync(x => x.Id == input.Id, cancellationToken);
                cancellationToken.ThrowIfCancellationRequested();
            }
            else
            {
                product = new Product();
                DatabaseContext.Products.Add(product);
            }

            product.Name = input.Name;

            // categories
            var remainingCategories = input.Categories.ToHashSet();
            foreach (var junction in product.ProductCategoryJunctions)
            {
                if (remainingCategories.Contains(junction.CategoryId))
                {
                    remainingCategories.Remove(junction.CategoryId);
                }
                else
                {
                    DatabaseContext.ProductCategoryJunctions.Remove(junction);
                }
            }
            foreach (var categoryId in remainingCategories)
            {
                var junction = new ProductCategoryJunction
                {
                    Product = product,
                    CategoryId = categoryId
                };
                product.ProductCategoryJunctions.Add(junction);
            }

            await DatabaseContext.SaveChangesAsync(cancellationToken);
            cancellationToken.ThrowIfCancellationRequested();

            return new SaveDto
            {
                Id = product.Id
            };
        }

        [Api]
        public async Task<SuccessDto> Delete(IdDto input, CancellationToken cancellationToken)
        {
            var product = await DatabaseContext.Products
                        .SingleAsync(x => x.Id == input.Id, cancellationToken);
            cancellationToken.ThrowIfCancellationRequested();

            DatabaseContext.Products.Remove(product);

            await DatabaseContext.SaveChangesAsync(cancellationToken);
            cancellationToken.ThrowIfCancellationRequested();

            return new SuccessDto
            {
                Success = true
            };

        }

    }
}
