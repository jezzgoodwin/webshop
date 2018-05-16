using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using WebShop.TypeReflect;

namespace WebShop
{
    public class Program
    {
        public static void Main(string[] args)
        {

            var generate = new Generate();
            generate.Run();

            BuildWebHost(args).Run();
        }

        public static IWebHost BuildWebHost(string[] args)
        {
            var contentRoot = Directory.GetCurrentDirectory();
            var webRoot = Path.Combine(Path.Combine(contentRoot, "webapp"), "wwwroot");

            return WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .UseContentRoot(contentRoot)
                .UseWebRoot(webRoot)
                .Build();
        }
    }
}
