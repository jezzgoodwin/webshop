using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebShop.Models
{
    public class UserSession
    {
        public int Id { get; set; }
        public string Token { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
