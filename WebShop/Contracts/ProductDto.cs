using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebShop.TypeReflect;

namespace WebShop.Contracts
{
    [Dto]
    public class ProductDto
    {

        public int? Id { get; set; }
        public string Name { get; set; }

        [Optional]
        public List<int> Categories { get; set; }

    }
}
