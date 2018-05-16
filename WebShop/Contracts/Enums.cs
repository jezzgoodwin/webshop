using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebShop.TypeReflect;

namespace WebShop.Contracts
{

    [TypeReflect.Enum]
    public enum UserType
    {
        Visitor = 3,
        Admin = 7
    }
    
}
