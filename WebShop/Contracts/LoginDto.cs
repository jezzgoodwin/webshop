using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebShop.TypeReflect;

namespace WebShop.Contracts
{
    [Dto]
    public class LoginDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
