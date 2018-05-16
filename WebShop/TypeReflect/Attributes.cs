using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebShop.TypeReflect
{

    [AttributeUsage(AttributeTargets.Class)]
    public class Dto : Attribute
    {
    }

    [AttributeUsage(AttributeTargets.Property)]
    public class Optional : Attribute
    {
    }

    [AttributeUsage(AttributeTargets.Method)]
    public class Api : Attribute
    {
    }

    [AttributeUsage(AttributeTargets.Enum)]
    public class Enum : Attribute
    {
    }

}
