using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Security.Claims;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using WebShop.Contracts;
using WebShop.Models;

namespace WebShop.Controllers
{
    [Route("[controller]")]
    public class AccountController : Controller
    {
        private readonly DatabaseContext _context;

        public AccountController(DatabaseContext context)
        {
            _context = context;
        }

        [HttpGet("Login")]
        public async Task<SuccessDto> Login(string Username, string Password, CancellationToken cancellationToken)
        {

            // check user
            var isValid = false;
            User user = null;

            if (Username != null && Username != "" && Password != null && Password != "")
            {
                user = await _context.Users
                    .SingleOrDefaultAsync(x => x.Username == Username, cancellationToken);
                cancellationToken.ThrowIfCancellationRequested();
                if (user != null)
                {
                    
                    byte[] salt = Convert.FromBase64String(user.Salt);
                    var pbkdf2 = new Rfc2898DeriveBytes(Password, salt, 10000);
                    var hash = pbkdf2.GetBytes(20);
                    var checkPassword = Convert.ToBase64String(hash);
                    if (checkPassword == user.Password)
                    {
                        isValid = true;
                    }
                }
            }
            
            if (!isValid) {
                return new SuccessDto
                {
                    Success = false
                };
            }

            // create sessions
            byte[] rand;
            new RNGCryptoServiceProvider().GetBytes(rand = new byte[16]);
            var token = Convert.ToBase64String(rand);

            var session = new UserSession
            {
                UserId = user.Id,
                Token = token
            };
            _context.UserSessions.Add(session);
            await _context.SaveChangesAsync(cancellationToken);
            cancellationToken.ThrowIfCancellationRequested();

            if (session.Id == default(int))
            {
                return new SuccessDto
                {
                    Success = false
                };
            }

            var claims = new List<Claim>
            {
                new Claim("SessionId", session.Id.ToString()),
                new Claim("Token", token),
            };

            var claimsIdentity = new ClaimsIdentity(
                claims, CookieAuthenticationDefaults.AuthenticationScheme);

            var authProperties = new AuthenticationProperties
            {
            };

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity),
                authProperties);

            return new SuccessDto
            {
                Success = true
            };

        }

        [HttpGet("Create")]
        public async Task<SuccessDto> Create(string Username, string Password, CancellationToken cancellationToken)
        {
            if (Username == null || Username == "" || Password == null || Password == "")
            {
                return new SuccessDto
                {
                    Success = false
                };
            }

            byte[] salt;
            new RNGCryptoServiceProvider().GetBytes(salt = new byte[16]);

            var pbkdf2 = new Rfc2898DeriveBytes(Password, salt, 10000);
            var hash = pbkdf2.GetBytes(20);

            var user = new User {
                Username = Username,
                Password = Convert.ToBase64String(hash),
                Salt = Convert.ToBase64String(salt)
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync(cancellationToken);
            cancellationToken.ThrowIfCancellationRequested();

            return new SuccessDto
            {
                Success = true
            };

        }

        [HttpGet("Logout")]
        public async Task<SuccessDto> Logout()
        {
            await HttpContext.SignOutAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme);

            return new SuccessDto
            {
                Success = true
            };
        }

        [HttpGet("IsLoggedIn")]
        public SuccessDto IsLoggedIn()
        {
            return new SuccessDto
            {
                Success = HttpContext.User.Identity.IsAuthenticated
            };
        }

    }
}
