using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebShop.Models;
using WebShop.Contracts;
using WebShop.TypeReflect;
using System.Threading;
using Microsoft.EntityFrameworkCore;

namespace WebShop.Controllers
{
    public class CategoryController
    {

        private readonly DatabaseContext DatabaseContext;

        public CategoryController(DatabaseContext databaseContext)
        {
            DatabaseContext = databaseContext;
        }

        [Api]
        public async Task<IEnumerable<CategoryDto>> GetAll(CancellationToken cancellationToken)
        {
            return await DatabaseContext.Categories.Select(category => new CategoryDto()
            {
                Id = category.Id,
                Name = category.Name
            })
            .ToListAsync(cancellationToken);

        }

        [Api]
        public async Task<SaveDto> Save(CategoryDto input, CancellationToken cancellationToken)
        {
            Category category;
            if (input.Id.HasValue)
            {
                category = await DatabaseContext.Categories
                        .SingleAsync(x => x.Id == input.Id, cancellationToken);
                cancellationToken.ThrowIfCancellationRequested();
            }
            else
            {
                category = new Category();
                DatabaseContext.Categories.Add(category);
            }

            category.Name = input.Name;

            await DatabaseContext.SaveChangesAsync(cancellationToken);
            cancellationToken.ThrowIfCancellationRequested();

            return new SaveDto
            {
                Id = category.Id
            };
        }

        [Api]
        public async Task<SuccessDto> Delete(IdDto input, CancellationToken cancellationToken)
        {
            var category = await DatabaseContext.Categories
                        .SingleAsync(x => x.Id == input.Id, cancellationToken);
            cancellationToken.ThrowIfCancellationRequested();

            DatabaseContext.Categories.Remove(category);

            await DatabaseContext.SaveChangesAsync(cancellationToken);
            cancellationToken.ThrowIfCancellationRequested();

            return new SuccessDto
            {
                Success = true
            };

        }

    }
}
