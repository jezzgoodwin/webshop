using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using WebShop.Models;
using System.Net;

namespace WebShop.Other
{
    public class CustomCookieAuthenticationEvents : CookieAuthenticationEvents
    {

        private readonly DatabaseContext _databaseContext;

        public CustomCookieAuthenticationEvents(DatabaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }

        public override Task RedirectToLogin(RedirectContext<CookieAuthenticationOptions> context)
        {
            context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
            return Task.FromResult(0);
        }

        public override async Task ValidatePrincipal(CookieValidatePrincipalContext context)
        {

            var isValid = false;

            int sessionId = 0;
            string token = null;

            var userPrincipal = context.Principal;
            foreach (var x in userPrincipal.Claims)
            {
                if (x.Type == "SessionId")
                {
                    int.TryParse(x.Value, out sessionId);
                }
                if (x.Type == "Token")
                {
                    token = x.Value;
                }
            }

            if (token != null)
            {
                var session = await _databaseContext.UserSessions
                    .SingleOrDefaultAsync(x => x.Id == sessionId && x.Token == token, context.HttpContext.RequestAborted);
                if (session != null)
                {
                    isValid = true;
                }
            }

            if (!isValid)
            {
                context.RejectPrincipal();

                await context.HttpContext.SignOutAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme);
            }

        }

    }
}
