using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebShop.Contracts
{
    public class ProductDto
    {

        public int Id { get; set; }
        public string Name { get; set; }

        public List<CategoryDto> Categories { get; set; }

    }
}
