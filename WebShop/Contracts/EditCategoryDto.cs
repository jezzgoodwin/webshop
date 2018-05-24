using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebShop.TypeReflect;

namespace WebShop.Contracts
{
    [Dto]
    public class EditCategoryDto
    {
        public int? Id { get; set; }
        public string Name { get; set; }
    }
}
