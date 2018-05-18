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
using WebShop.TypeReflect;
using Microsoft.AspNetCore.Http;

namespace WebShop.Controllers
{
    public class AccountController
    {
        private readonly DatabaseContext DatabaseContext;
        private readonly IHttpContextAccessor HttpContextAccessor;

        public AccountController(DatabaseContext databaseContext, IHttpContextAccessor httpContextAccessor)
        {
            DatabaseContext = databaseContext;
            HttpContextAccessor = httpContextAccessor;
        }

        [Api]
        public async Task<SuccessDto> Login(LoginDto credentials, CancellationToken cancellationToken)
        {

            // check user
            var isValid = false;
            User user = null;

            if (credentials.Username != null && credentials.Username != "" && credentials.Password != null && credentials.Password != "")
            {
                user = await DatabaseContext.Users
                    .SingleOrDefaultAsync(x => x.Username == credentials.Username, cancellationToken);
                cancellationToken.ThrowIfCancellationRequested();
                if (user != null)
                {
                    
                    byte[] salt = Convert.FromBase64String(user.Salt);
                    var pbkdf2 = new Rfc2898DeriveBytes(credentials.Password, salt, 10000);
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
            DatabaseContext.UserSessions.Add(session);
            await DatabaseContext.SaveChangesAsync(cancellationToken);
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

            await HttpContextAccessor.HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity),
                authProperties);

            return new SuccessDto
            {
                Success = true
            };

        }

        [Api]
        public async Task<SuccessDto> Create(LoginDto credentials, CancellationToken cancellationToken)
        {
            if (credentials.Username == null || credentials.Username == "" || credentials.Password == null || credentials.Password == "")
            {
                return new SuccessDto
                {
                    Success = false
                };
            }

            byte[] salt;
            new RNGCryptoServiceProvider().GetBytes(salt = new byte[16]);

            var pbkdf2 = new Rfc2898DeriveBytes(credentials.Password, salt, 10000);
            var hash = pbkdf2.GetBytes(20);

            var user = new User {
                Username = credentials.Username,
                Password = Convert.ToBase64String(hash),
                Salt = Convert.ToBase64String(salt)
            };
            DatabaseContext.Users.Add(user);
            await DatabaseContext.SaveChangesAsync(cancellationToken);
            cancellationToken.ThrowIfCancellationRequested();

            return new SuccessDto
            {
                Success = true
            };

        }

        [Api]
        public async Task<SuccessDto> Logout()
        {
            await HttpContextAccessor.HttpContext.SignOutAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme);

            return new SuccessDto
            {
                Success = true
            };
        }

        [Api]
        public async Task<SuccessDto> IsLoggedIn()
        {
            return new SuccessDto
            {
                Success = HttpContextAccessor.HttpContext.User.Identity.IsAuthenticated
            };
        }

    }
}
